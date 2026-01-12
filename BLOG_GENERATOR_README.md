# Daily Blog Post Generator

## Overview

El sistema genera automáticamente un post de blog optimizado para SEO cada 24 horas utilizando OpenAI GPT-4o-mini.

## Características

### 🎯 Generación Automática
- **Frecuencia**: Un post cada 24 horas
- **Modelo IA**: GPT-4o-mini de OpenAI
- **Categorías**: ATS Tips, Resume Writing, Job Search, Interview Prep, Career Advice, Industry Guide

### 📝 Contenido del Post
Cada post incluye:
- Título SEO-optimizado (50-60 caracteres)
- Excerpt atractivo (150 caracteres)
- Contenido de 800-1200 palabras
- Estructura con H2, H3, listas, y ejemplos
- Keywords y tags para SEO
- Meta descripción optimizada
- Tiempo estimado de lectura

### 🎨 Temas Cubiertos
El generador cubre más de 60 temas diversos:
- Optimización ATS y resume parsing
- Estrategias de búsqueda de empleo
- Escritura de CV y bullet points
- Preparación para entrevistas
- Desarrollo profesional
- Guías específicas por industria
- Cover letters y networking
- Tendencias del mercado laboral

## Mejoras de UI Implementadas

### Hero Section
- Badge "Career Resources" con icono
- Título con gradiente cyan-teal
- Elementos decorativos de fondo
- Tipografía mejorada (text-7xl font-black)

### Featured Post Card
- Border gradient hover effect
- Badge "Featured" con gradiente y sombra
- Hover effects con scale y glow
- Iconos en badges de metadata
- Button con gradiente cyan-teal
- Animaciones suaves en hover

### Recent Posts Grid
- Grid responsive (lg:grid-cols-3)
- Badge "POPULAR" para posts con >100 views
- Hover glow effect por card
- Line-clamp para títulos y excerpts
- Tags limitados a 3 visibles + contador
- Mejor espaciado y jerarquía visual

### CTA Section
- Gradiente de fondo cyan/teal
- Elementos decorativos blur
- Badge "Start Your Journey"
- Button con shadow glow effect
- Texto de confianza (no credit card required)

## Configuración

### Variables de Entorno Requeridas

```bash
OPENAI_API_KEY=sk-...
```

Añade esta variable en tu dashboard de Convex:
1. Ve a Convex Dashboard
2. Selecciona tu proyecto
3. Ve a Settings > Environment Variables
4. Añade `OPENAI_API_KEY` con tu API key de OpenAI

## Uso Manual (Testing)

Para generar un post manualmente:

```bash
npx convex run blogGenerator:generateDailyPost
```

Esto ejecutará el generador inmediatamente y creará un nuevo post.

## Cron Job

El cron job está configurado en `src/convex/crons.ts`:

```typescript
crons.interval(
  "generate_daily_blog_post",
  { hours: 24 },
  internalAny.blogGenerator.generateDailyPost,
  {}
);
```

**Frecuencia**: Cada 24 horas (el mínimo permitido para cron jobs en Convex)

## Estructura de Archivos

```
src/
├── convex/
│   ├── blogGenerator.ts     # Generador de posts con IA
│   ├── blog.ts              # Queries y mutations de blog
│   ├── crons.ts             # Cron job configuration
│   └── schema.ts            # Blog schema definition
├── pages/
│   └── Blog.tsx             # UI mejorado de la página de blog
└── components/
    └── blog/
        └── BlogPost.tsx     # Componente individual de post
```

## SEO Benefits

### Freshness
- Google valora contenido nuevo y actualizado regularmente
- Un post diario mantiene el sitio "vivo" para los crawlers

### Keywords Diversity
- 60+ temas diferentes = amplia cobertura de keywords
- Long-tail keywords específicas por industria
- Semantic relevance para ATS, resume, job search

### Internal Linking
- Cada post incluye CTA a la herramienta principal
- Related posts section para mejor link structure
- Improved site architecture

### User Engagement
- Más contenido = más tiempo en sitio
- Lower bounce rate
- Más páginas indexadas = más oportunidades de ranking

## Monitoring

Para ver los posts generados:
1. Ve a tu dashboard de Convex
2. Navega a la tabla `blogPosts`
3. Verifica que `published: true` y `publishedAt` está seteado

## Logs

Los logs del generador aparecen en Convex Functions logs:
- ✅ Success: "Blog post created successfully: [title]"
- ❌ Error: "Error generating blog post: [error]"

## Cost Considerations

**Estimado por post**:
- GPT-4o-mini: ~$0.01-0.02 por post (3000 tokens)
- Convex database: Incluido en plan
- Cron execution: Incluido en plan

**Mensual**: ~$0.30-0.60 (30 posts)

## Best Practices

1. **Monitorea la calidad**: Revisa posts generados periódicamente
2. **Ajusta prompts**: Si la calidad baja, modifica el prompt en `blogGenerator.ts`
3. **Diversifica temas**: El pool de topics cubre diversos temas, pero puedes añadir más
4. **SEO tracking**: Usa Google Search Console para ver qué posts rankean mejor

## Troubleshooting

### "OPENAI_API_KEY not configured"
- Verifica que la variable de entorno está seteada en Convex Dashboard

### "Failed to parse AI response"
- El modelo a veces devuelve respuestas mal formateadas
- El código intenta extraer JSON de code blocks
- Si persiste, revisa los logs para ver el output exacto

### "Slug already exists"
- El código automáticamente añade timestamp al slug para evitar colisiones
- Esto nunca debería ser un problema

### Cron job no ejecuta
- Verifica que el cron job está activo en Convex Dashboard
- Revisa los logs de cron execution
- Asegúrate que el intervalo es mínimo 5 minutos (usamos 24 horas)

## Future Enhancements

Posibles mejoras:
- [ ] Generación de imágenes con DALL-E para featured images
- [ ] A/B testing de diferentes estilos de título
- [ ] Analytics integration para tracking engagement
- [ ] Automatic social media posting
- [ ] Multi-language support (Spanish, French, German)
- [ ] Topic trending based on Google Trends API
