import { useState, useRef, useEffect, useCallback } from 'react'

const COLORS = {
  present: { fill: '#10b981', shadow: '#059669', label: 'Present' },
  absent: { fill: '#ef4444', shadow: '#dc2626', label: 'Absent' },
  holiday: { fill: '#f97316', shadow: '#ea580c', label: 'Holiday' },
}

function PieChart3D({ present = 0, absent = 0, holiday = 0 }) {
  const total = present + absent + holiday
  const [animated, setAnimated] = useState(false)
  const [hoveredSlice, setHoveredSlice] = useState(null)
  const chartRef = useRef(null)

  const getPercent = (val) => (total > 0 ? ((val / total) * 100).toFixed(1) : 0)

  const slices = total > 0 ? [
    { key: 'present', value: present, ...COLORS.present },
    { key: 'absent', value: absent, ...COLORS.absent },
    { key: 'holiday', value: holiday, ...COLORS.holiday },
  ].filter(s => s.value > 0) : []

  const createSlicePath = useCallback((startAngle, endAngle, radius, offset = 0) => {
    const gap = 0.02
    startAngle = startAngle + gap
    endAngle = endAngle - gap
    const innerRadius = radius * 0.55
    const angle = endAngle - startAngle
    const largeArc = angle > Math.PI ? 1 : 0

    const x1 = 200 + (radius + offset) * Math.cos(startAngle)
    const y1 = 200 + (radius + offset) * Math.sin(startAngle)
    const x2 = 200 + (radius + offset) * Math.cos(endAngle)
    const y2 = 200 + (radius + offset) * Math.sin(endAngle)
    const ix1 = 200 + (innerRadius + offset) * Math.cos(startAngle)
    const iy1 = 200 + (innerRadius + offset) * Math.sin(startAngle)
    const ix2 = 200 + (innerRadius + offset) * Math.cos(endAngle)
    const iy2 = 200 + (innerRadius + offset) * Math.sin(endAngle)

    return `M ${x1} ${y1} A ${radius + offset} ${radius + offset} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius + offset} ${innerRadius + offset} 0 ${largeArc} 0 ${ix1} ${iy1} Z`
  }, [])

  const createSidePath = useCallback((startAngle, endAngle, radius, height) => {
    const x1 = 200 + radius * Math.cos(startAngle)
    const y1 = 200 + radius * Math.sin(startAngle)
    const x2 = 200 + radius * Math.cos(endAngle)
    const y2 = 200 + radius * Math.sin(endAngle)
    const ix1 = 200 + radius * 0.55 * Math.cos(startAngle)
    const iy1 = 200 + radius * 0.55 * Math.sin(startAngle)
    const ix2 = 200 + radius * 0.55 * Math.cos(endAngle)
    const iy2 = 200 + radius * 0.55 * Math.sin(endAngle)

    return `M ${x1} ${y1} L ${x1} ${y1 + height} L ${x2} ${y2 + height} L ${x2} ${y2} Z M ${ix1} ${iy1} L ${ix1} ${iy1 + height} L ${ix2} ${iy2 + height} L ${ix2} ${iy2} Z`
  }, [])

  const getLabelPosition = (startAngle, endAngle, radius) => {
    const midAngle = (startAngle + endAngle) / 2
    const r = radius * 0.77
    return {
      x: 200 + r * Math.cos(midAngle),
      y: 200 + r * Math.sin(midAngle),
    }
  }

  let currentAngle = -Math.PI / 2
  const radius = 120
  const height = 18

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ width: '100%', maxWidth: 400, margin: '0 auto', position: 'relative' }}>
      <svg
        ref={chartRef}
        viewBox="0 0 400 420"
        width="100%"
        style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.15))' }}
      >
        <defs>
          {slices.map((slice, i) => (
            <linearGradient key={`grad-${i}`} id={`grad-${slice.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={slice.fill} stopOpacity="1" />
              <stop offset="100%" stopColor={slice.shadow} stopOpacity="1" />
            </linearGradient>
          ))}
          <filter id="innerShadow">
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="3" />
            <feComposite operator="out" in="SourceGraphic" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
            <feBlend in="SourceGraphic" mode="normal" />
          </filter>
        </defs>

        <g transform={animated ? 'scale(1) rotate(0)' : 'scale(0.3) rotate(-180)'}
          style={{ transformOrigin: '200px 200px', transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          {/* 3D Side walls */}
          {slices.map((slice, i) => {
            const startAngle = currentAngle
            const sliceAngle = (slice.value / total) * 2 * Math.PI
            const endAngle = startAngle + sliceAngle
            const sidePath = createSidePath(startAngle, endAngle, radius, height)
            return (
              <path
                key={`side-${i}`}
                d={sidePath}
                fill={slice.shadow}
                opacity={hoveredSlice === i ? 0.9 : 0.7}
                style={{ transition: 'opacity 0.3s' }}
              />
            )
          })}

          {/* Bottom ring */}
          <circle cx="200" cy="200" r={radius} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
          <ellipse cx="200" cy="218" rx={radius} ry={radius * 0.3} fill="rgba(0,0,0,0.08)" />

          {/* Main slices */}
          {slices.map((slice, i) => {
            const startAngle = currentAngle
            const sliceAngle = (slice.value / total) * 2 * Math.PI
            const endAngle = startAngle + sliceAngle
            const path = createSlicePath(startAngle, endAngle, radius, hoveredSlice === i ? 8 : 0)
            const labelPos = getLabelPosition(startAngle, endAngle, radius)
            const percent = getPercent(slice.value)

            return (
              <g
                key={slice.key}
                onMouseEnter={() => setHoveredSlice(i)}
                onMouseLeave={() => setHoveredSlice(null)}
                onClick={() => setHoveredSlice(hoveredSlice === i ? null : i)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={path}
                  fill={`url(#grad-${slice.key})`}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  filter={hoveredSlice === i ? 'url(#innerShadow)' : undefined}
                  style={{
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: hoveredSlice === i ? 'translate(0, -4px)' : 'none',
                  }}
                />
                {parseFloat(percent) >= 5 && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="700"
                    style={{
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                      pointerEvents: 'none',
                      opacity: animated ? 1 : 0,
                      transition: 'opacity 0.6s 0.5s',
                    }}
                  >
                    {percent}%
                  </text>
                )}
              </g>
            )
          })}

          {/* Inner circle for donut effect */}
          <circle cx="200" cy="200" r={radius * 0.55} fill="rgba(255,255,255,0.9)" style={{ backdropFilter: 'blur(10px)' }} />
          <text x="200" y="195" textAnchor="middle" fill="#1e293b" fontSize="24" fontWeight="800">
            {total}
          </text>
          <text x="200" y="215" textAnchor="middle" fill="#64748b" fontSize="12">
            Total Days
          </text>
        </g>

        {/* Legend at bottom */}
        <g transform="translate(200, 380)">
          {slices.map((slice, i) => (
            <g key={`legend-${i}`} transform={`translate(${i * 90 - (slices.length - 1) * 45}, 0)`}>
              <rect x="-40" y="-8" width="12" height="12" rx="3" fill={slice.fill} />
              <text x="-24" y="2" fill="#475569" fontSize="11" fontWeight="500">
                {slice.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

export default PieChart3D
