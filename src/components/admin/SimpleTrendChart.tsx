/**
 * Lightweight trend chart without heavy chart libraries
 * Uses pure SVG for minimal bundle size
 */

interface TrendDataPoint {
  hour: number;
  hitRate: number;
  totalRequests: number;
}

interface SimpleTrendChartProps {
  data: TrendDataPoint[];
  height?: number;
}

export function SimpleTrendChart({ data, height = 300 }: SimpleTrendChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-slate-500"
        style={{ height: `${height}px` }}
      >
        No cache performance data available yet
      </div>
    );
  }

  const width = 800;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const maxHitRate = 100;
  const minHitRate = 0;

  const xScale = (index: number) => {
    return (index / (data.length - 1)) * chartWidth;
  };

  const yScale = (value: number) => {
    const normalized = (value - minHitRate) / (maxHitRate - minHitRate);
    return chartHeight - (normalized * chartHeight);
  };

  // Generate path
  const pathData = data.map((point, index) => {
    const x = xScale(index);
    const y = yScale(point.hitRate);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Generate grid lines
  const yGridLines = [0, 25, 50, 75, 100];
  const xGridPoints = Math.min(data.length, 6);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minWidth: '600px' }}
      >
        {/* Grid */}
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Horizontal grid lines */}
          {yGridLines.map(value => (
            <g key={value}>
              <line
                x1={0}
                y1={yScale(value)}
                x2={chartWidth}
                y2={yScale(value)}
                stroke="#E2E8F0"
                strokeDasharray="3,3"
              />
              <text
                x={-10}
                y={yScale(value)}
                textAnchor="end"
                alignmentBaseline="middle"
                fill="#64748B"
                fontSize="12"
              >
                {value}%
              </text>
            </g>
          ))}

          {/* Vertical grid lines */}
          {Array.from({ length: xGridPoints }).map((_, i) => {
            const dataIndex = Math.floor((i / (xGridPoints - 1)) * (data.length - 1));
            const point = data[dataIndex];
            const x = xScale(dataIndex);
            const date = new Date(point.hour * 60 * 60 * 1000);

            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={chartHeight}
                  stroke="#E2E8F0"
                  strokeDasharray="3,3"
                />
                <text
                  x={x}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="11"
                >
                  {date.getHours()}:00
                </text>
              </g>
            );
          })}

          {/* Line path */}
          <path
            d={pathData}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = xScale(index);
            const y = yScale(point.hitRate);

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#10B981"
                  className="hover:r-6 transition-all cursor-pointer"
                >
                  <title>
                    {`${new Date(point.hour * 60 * 60 * 1000).toLocaleString()}\n${point.hitRate.toFixed(1)}% hit rate\n${point.totalRequests} requests`}
                  </title>
                </circle>
              </g>
            );
          })}

          {/* Axes labels */}
          <text
            x={chartWidth / 2}
            y={chartHeight + 35}
            textAnchor="middle"
            fill="#475569"
            fontSize="13"
            fontWeight="500"
          >
            Time (Hours)
          </text>
          <text
            x={-chartHeight / 2}
            y={-45}
            textAnchor="middle"
            fill="#475569"
            fontSize="13"
            fontWeight="500"
            transform={`rotate(-90, -${chartHeight / 2}, -45)`}
          >
            Cache Hit Rate (%)
          </text>
        </g>
      </svg>
    </div>
  );
}
