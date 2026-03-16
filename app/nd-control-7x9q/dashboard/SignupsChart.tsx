'use client'
import { useEffect, useRef } from 'react'

interface DataPoint {
  date: string
  count: number
}

export default function SignupsChart({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function draw() {
      const dpr = window.devicePixelRatio || 1
      const W   = canvas!.offsetWidth
      const H   = canvas!.offsetHeight

      if (W === 0 || H === 0) return   // not yet painted — skip

      canvas!.width  = W * dpr
      canvas!.height = H * dpr

      const ctx = canvas!.getContext('2d')!
      ctx.scale(dpr, dpr)

      const pad  = { top: 20, right: 16, bottom: 30, left: 36 }
      const gw   = W - pad.left - pad.right
      const gh   = H - pad.top  - pad.bottom
      const maxV = Math.max(...data.map(d => d.count), 1)
      const slot = gw / data.length
      const barW = Math.max(slot - 2, 2)

      ctx.clearRect(0, 0, W, H)

      // Horizontal grid lines + Y-axis labels
      const ySteps = 4
      for (let i = 0; i <= ySteps; i++) {
        const y   = pad.top + (gh / ySteps) * i
        const val = Math.ceil(maxV * (1 - i / ySteps))

        ctx.strokeStyle = '#21262d'
        ctx.lineWidth   = 0.5
        ctx.beginPath()
        ctx.moveTo(pad.left, y)
        ctx.lineTo(W - pad.right, y)
        ctx.stroke()

        ctx.fillStyle  = '#484f58'
        ctx.font       = '10px system-ui, -apple-system, sans-serif'
        ctx.textAlign  = 'right'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(val), pad.left - 6, y)
      }

      // Bars
      data.forEach((d, i) => {
        const x  = pad.left + i * slot + (slot - barW) / 2
        const bh = d.count > 0 ? Math.max(2, (d.count / maxV) * gh) : 0
        const y  = pad.top + gh - bh

        // Colour: today's bar is brighter
        ctx.fillStyle = i === data.length - 1 ? '#3b82f6' : '#1d4ed8'

        ctx.beginPath()
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barW, bh, [2, 2, 0, 0])
        } else {
          ctx.rect(x, y, barW, bh)
        }
        ctx.fill()
      })

      // X-axis date labels every 7 days + last day
      ctx.fillStyle    = '#484f58'
      ctx.font         = '10px system-ui, -apple-system, sans-serif'
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'alphabetic'
      data.forEach((d, i) => {
        if (i % 7 === 0 || i === data.length - 1) {
          const x = pad.left + i * slot + slot / 2
          // Show MM-DD
          ctx.fillText(d.date.slice(5), x, H - 6)
        }
      })

      // Tooltip-style: highlight today's count above the last bar
      const last = data[data.length - 1]
      if (last && last.count > 0) {
        const x  = pad.left + (data.length - 1) * slot + slot / 2
        const bh = Math.max(2, (last.count / maxV) * gh)
        const y  = pad.top + gh - bh - 6

        ctx.fillStyle    = '#e6edf3'
        ctx.font         = 'bold 10px system-ui, -apple-system, sans-serif'
        ctx.textAlign    = 'center'
        ctx.textBaseline = 'alphabetic'
        ctx.fillText(String(last.count), x, y)
      }
    }

    // Draw immediately
    draw()

    // Re-draw whenever the container resizes (handles initial render + window resize)
    const observer = new ResizeObserver(() => draw())
    observer.observe(canvas)

    return () => observer.disconnect()
  }, [data])

  // Show total signups in last 30 days
  const total = data.reduce((s, d) => s + d.count, 0)
  const peak  = Math.max(...data.map(d => d.count))

  return (
    <div style={{
      background: '#0d1117',
      border: '1px solid #21262d',
      borderRadius: 10,
      padding: '20px 20px 16px',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <p style={{ color: '#8b949e', fontSize: 12, fontWeight: 600, margin: 0 }}>
          New signups — last 30 days
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ color: '#484f58', fontSize: 11 }}>
            Total <strong style={{ color: '#e6edf3' }}>{total}</strong>
          </span>
          <span style={{ color: '#484f58', fontSize: 11 }}>
            Peak <strong style={{ color: '#e6edf3' }}>{peak}</strong>
          </span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ position: 'relative', height: 150 }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
    </div>
  )
}