/**
 * Lightweight Transformer-inspired Architecture for Resume Analysis
 *
 * Free open-source implementation inspired by BERT/GPT without external dependencies
 * - Self-attention mechanism for context understanding
 * - Position encodings for word order
 * - Multi-head attention (simplified)
 * - Feedforward neural network layers
 *
 * This is a lightweight implementation optimized for browser/edge computing
 * No TensorFlow.js or external ML libraries required - pure TypeScript
 */

/**
 * Positional Encoding (sinusoidal, like in "Attention Is All You Need")
 */
function getPositionalEncoding(position: number, dimension: number): number[] {
  const encoding: number[] = [];

  for (let i = 0; i < dimension; i++) {
    const angle = position / Math.pow(10000, (2 * i) / dimension);
    encoding.push(i % 2 === 0 ? Math.sin(angle) : Math.cos(angle));
  }

  return encoding;
}

/**
 * Softmax activation function
 */
function softmax(values: number[]): number[] {
  const maxVal = Math.max(...values);
  const expValues = values.map(v => Math.exp(v - maxVal));
  const sum = expValues.reduce((a, b) => a + b, 0);
  return expValues.map(v => v / sum);
}

/**
 * Layer Normalization
 */
function layerNorm(vector: number[], epsilon: number = 1e-5): number[] {
  const mean = vector.reduce((a, b) => a + b, 0) / vector.length;
  const variance = vector.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / vector.length;
  const std = Math.sqrt(variance + epsilon);

  return vector.map(val => (val - mean) / std);
}

/**
 * Self-Attention mechanism (core of Transformers)
 */
export function selfAttention(
  queries: number[][],
  keys: number[][],
  values: number[][],
  scalingFactor?: number
): number[][] {
  const dk = keys[0].length;
  const scale = scalingFactor || Math.sqrt(dk);
  const attentionOutput: number[][] = [];

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];

    // Calculate attention scores
    const scores: number[] = [];
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      let score = 0;
      for (let k = 0; k < query.length; k++) {
        score += query[k] * key[k];
      }
      scores.push(score / scale);
    }

    // Apply softmax to get attention weights
    const attentionWeights = softmax(scores);

    // Weighted sum of values
    const output: number[] = new Array(values[0].length).fill(0);
    for (let j = 0; j < values.length; j++) {
      const value = values[j];
      const weight = attentionWeights[j];
      for (let k = 0; k < value.length; k++) {
        output[k] += weight * value[k];
      }
    }

    attentionOutput.push(output);
  }

  return attentionOutput;
}

/**
 * Multi-Head Attention (simplified version)
 */
export function multiHeadAttention(
  input: number[][],
  numHeads: number = 4,
  headDim: number = 16
): number[][] {
  const fullDim = numHeads * headDim;
  const results: number[][][] = [];

  // Split into multiple heads
  for (let h = 0; h < numHeads; h++) {
    const headInput: number[][] = input.map(vec => {
      const start = h * headDim;
      const end = Math.min(start + headDim, vec.length);
      const headVec = vec.slice(start, end);
      // Pad if necessary
      while (headVec.length < headDim) {
        headVec.push(0);
      }
      return headVec;
    });

    // Apply self-attention for this head
    const headOutput = selfAttention(headInput, headInput, headInput);
    results.push(headOutput);
  }

  // Concatenate heads
  const output: number[][] = [];
  for (let i = 0; i < input.length; i++) {
    const concatenated: number[] = [];
    for (let h = 0; h < numHeads; h++) {
      concatenated.push(...results[h][i]);
    }
    output.push(concatenated.slice(0, fullDim));
  }

  return output;
}

/**
 * Feedforward Neural Network (2 layers with ReLU)
 */
function feedForward(input: number[], hiddenDim: number = 64): number[] {
  // Layer 1: input -> hidden (with ReLU)
  const hidden: number[] = [];
  for (let i = 0; i < hiddenDim; i++) {
    let sum = 0;
    for (let j = 0; j < input.length; j++) {
      // Simplified weight initialization
      const weight = Math.cos((i + j + 1) * 0.1) * 0.5;
      sum += input[j] * weight;
    }
    hidden.push(Math.max(0, sum)); // ReLU
  }

  // Layer 2: hidden -> output
  const output: number[] = [];
  for (let i = 0; i < input.length; i++) {
    let sum = 0;
    for (let j = 0; j < hiddenDim; j++) {
      const weight = Math.sin((i + j + 1) * 0.1) * 0.5;
      sum += hidden[j] * weight;
    }
    output.push(sum);
  }

  return layerNorm(output);
}

/**
 * Transformer Encoder Block
 */
export function transformerEncoderBlock(
  input: number[][],
  numHeads: number = 4,
  headDim: number = 16
): number[][] {
  // Multi-head self-attention
  const attention = multiHeadAttention(input, numHeads, headDim);

  // Add & Norm (residual connection + layer normalization)
  const afterAttention = input.map((vec, i) => {
    const combined = vec.map((val, j) => val + (attention[i][j] || 0));
    return layerNorm(combined);
  });

  // Feedforward + Add & Norm
  const output = afterAttention.map((vec) => {
    const ffOutput = feedForward(vec);
    const combined = vec.map((val, i) => val + (ffOutput[i] || 0));
    return layerNorm(combined);
  });

  return output;
}

/**
 * BERT-inspired Resume Encoder
 * Generates context-aware embeddings for resume text
 */
export class ResumeTransformerEncoder {
  private dimension: number;
  private numHeads: number;
  private numLayers: number;

  constructor(
    dimension: number = 64,
    numHeads: number = 4,
    numLayers: number = 2
  ) {
    this.dimension = dimension;
    this.numHeads = numHeads;
    this.numLayers = numLayers;
  }

  /**
   * Tokenize and embed text
   */
  private tokenizeAndEmbed(text: string): number[][] {
    const tokens = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 0)
      .slice(0, 128); // Limit to 128 tokens (BERT-like)

    return tokens.map((token, position) => {
      // Create initial embedding using character-based hashing
      const embedding = new Array(this.dimension).fill(0);

      for (let i = 0; i < token.length; i++) {
        const charCode = token.charCodeAt(i);
        for (let d = 0; d < this.dimension; d++) {
          // Hash-based embedding
          const hash = (charCode * (d + 1) + i) % this.dimension;
          embedding[hash] += Math.sin(charCode * (d + 1) * 0.01);
        }
      }

      // Add positional encoding
      const posEncoding = getPositionalEncoding(position, this.dimension);
      for (let d = 0; d < this.dimension; d++) {
        embedding[d] += posEncoding[d];
      }

      // Normalize
      const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
      return norm > 0 ? embedding.map(val => val / norm) : embedding;
    });
  }

  /**
   * Encode resume text into contextualized embeddings
   */
  encode(text: string): number[][] {
    // Initial embedding
    let embeddings = this.tokenizeAndEmbed(text);

    // Apply transformer layers
    for (let layer = 0; layer < this.numLayers; layer++) {
      embeddings = transformerEncoderBlock(
        embeddings,
        this.numHeads,
        this.dimension / this.numHeads
      );
    }

    return embeddings;
  }

  /**
   * Get a single document-level embedding (mean pooling)
   */
  encodeToSingleVector(text: string): number[] {
    const tokenEmbeddings = this.encode(text);

    if (tokenEmbeddings.length === 0) {
      return new Array(this.dimension).fill(0);
    }

    // Mean pooling
    const docEmbedding = new Array(this.dimension).fill(0);
    tokenEmbeddings.forEach(embedding => {
      embedding.forEach((val, i) => {
        docEmbedding[i] += val;
      });
    });

    // Average and normalize
    const norm = Math.sqrt(
      docEmbedding.reduce((sum, val) => sum + (val / tokenEmbeddings.length) ** 2, 0)
    );

    return norm > 0
      ? docEmbedding.map(val => (val / tokenEmbeddings.length) / norm)
      : docEmbedding;
  }

  /**
   * Calculate semantic similarity between two texts
   */
  similarity(text1: string, text2: string): number {
    const emb1 = this.encodeToSingleVector(text1);
    const emb2 = this.encodeToSingleVector(text2);

    // Cosine similarity
    let dotProduct = 0;
    for (let i = 0; i < emb1.length; i++) {
      dotProduct += emb1[i] * emb2[i];
    }

    return dotProduct; // Already normalized, so just dot product
  }

  /**
   * Extract most important tokens using attention scores
   */
  extractImportantTokens(
    text: string,
    topK: number = 10
  ): Array<{ token: string, importance: number }> {
    const tokens = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 0)
      .slice(0, 128);

    const embeddings = this.encode(text);

    if (embeddings.length === 0) {
      return [];
    }

    // Calculate importance using attention mechanism
    const avgEmbedding = new Array(this.dimension).fill(0);
    embeddings.forEach(emb => {
      emb.forEach((val, i) => {
        avgEmbedding[i] += val;
      });
    });
    const norm = Math.sqrt(avgEmbedding.reduce((sum, val) => sum + val * val, 0));
    const normalizedAvg = avgEmbedding.map(val => val / (norm || 1));

    // Score each token by similarity to document average
    const scores = embeddings.map((emb, idx) => {
      let score = 0;
      for (let i = 0; i < emb.length; i++) {
        score += emb[i] * normalizedAvg[i];
      }
      return { token: tokens[idx], importance: score };
    });

    // Sort and return top K
    return scores
      .sort((a, b) => b.importance - a.importance)
      .slice(0, topK);
  }
}

/**
 * Advanced Resume-Job Description Matching using Transformer
 */
export function transformerMatchScore(
  resumeText: string,
  jobDescription: string
): {
  overallScore: number,
  semanticSimilarity: number,
  keywordOverlap: number,
  importantMissingKeywords: string[]
} {
  const encoder = new ResumeTransformerEncoder(64, 4, 2);

  // Calculate semantic similarity using transformer
  const semanticSimilarity = encoder.similarity(resumeText, jobDescription);

  // Extract important keywords from job description
  const jdKeywords = encoder.extractImportantTokens(jobDescription, 20);
  const resumeKeywords = encoder.extractImportantTokens(resumeText, 50);

  // Calculate keyword overlap
  const jdKeywordSet = new Set(jdKeywords.map(k => k.token));
  const resumeKeywordSet = new Set(resumeKeywords.map(k => k.token));

  const matchingKeywords = jdKeywords.filter(k => resumeKeywordSet.has(k.token));
  const keywordOverlap = matchingKeywords.length / jdKeywords.length;

  // Find important missing keywords
  const missingKeywords = jdKeywords
    .filter(k => !resumeKeywordSet.has(k.token))
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 10)
    .map(k => k.token);

  // Overall score (weighted combination)
  const overallScore = (semanticSimilarity * 0.6) + (keywordOverlap * 0.4);

  return {
    overallScore,
    semanticSimilarity,
    keywordOverlap,
    importantMissingKeywords: missingKeywords
  };
}

/**
 * Attention Visualization Data
 * Extract attention weights for visualization
 */
export function getAttentionWeights(
  text: string
): Array<{ token: string, weights: number[] }> {
  const encoder = new ResumeTransformerEncoder(64, 4, 1);
  const tokens = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0)
    .slice(0, 128);

  const embeddings = encoder.encode(text);

  // Calculate attention weights for each token
  return tokens.map((token, i) => {
    const query = embeddings[i];
    const weights: number[] = [];

    embeddings.forEach(key => {
      let score = 0;
      for (let d = 0; d < query.length; d++) {
        score += query[d] * key[d];
      }
      weights.push(score);
    });

    // Softmax
    const maxScore = Math.max(...weights);
    const expWeights = weights.map(w => Math.exp(w - maxScore));
    const sum = expWeights.reduce((a, b) => a + b, 0);
    const normalizedWeights = expWeights.map(w => w / sum);

    return { token, weights: normalizedWeights };
  });
}
