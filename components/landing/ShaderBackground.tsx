"use client"

import { useEffect, useRef } from "react"

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Non-nullable aliases captured by nested functions
    const cv = canvas
    const cx = ctx

    let width = window.innerWidth
    let height = window.innerHeight
    cv.width = width
    cv.height = height

    const isMobile = width < 768
    const particleCount = isMobile ? 120 : 320

    const mouse = { x: width / 2, y: height / 2 }
    let animId: number
    let time = 0

    const particles: {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
    }[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1.2,
        alpha: Math.random() * 0.5 + 0.55,
      })
    }

    function noise(x: number, y: number, t: number) {
      return (
        Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.7) +
        Math.sin(x * 0.02 - t * 0.5) * Math.cos(y * 0.015 + t * 0.3) * 0.5
      )
    }

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function handleResize() {
      width = window.innerWidth
      height = window.innerHeight
      cv.width = width
      cv.height = height
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    function draw() {
      time += 0.003
      cx.clearRect(0, 0, width, height)

      // Connection lines — desktop only (O(n²) is fine at 320 particles, too slow on mobile)
      if (!isMobile) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i]
            const b = particles[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 100) {
              const lineAlpha = (1 - dist / 100) * 0.18
              cx.beginPath()
              cx.moveTo(a.x, a.y)
              cx.lineTo(b.x, b.y)
              cx.strokeStyle = `rgba(52, 211, 153, ${lineAlpha})`
              cx.lineWidth = 0.6
              cx.stroke()
            }
          }
        }
      }

      for (const p of particles) {
        const n = noise(p.x, p.y, time)
        const angle = n * Math.PI * 2
        p.vx += Math.cos(angle) * 0.015
        p.vy += Math.sin(angle) * 0.015

        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 280) {
          const force = (280 - dist) / 280
          p.vx += (dx / dist) * force * 0.12
          p.vy += (dy / dist) * force * 0.12
        }

        p.vx *= 0.96
        p.vy *= 0.96
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Outer glow — tight so it's concentrated
        const glowR = p.size * 7
        const gradient = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
        gradient.addColorStop(0, `rgba(52, 211, 153, ${p.alpha * 0.9})`)
        gradient.addColorStop(0.35, `rgba(52, 211, 153, ${p.alpha * 0.45})`)
        gradient.addColorStop(1, "rgba(52, 211, 153, 0)")
        cx.beginPath()
        cx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
        cx.fillStyle = gradient
        cx.fill()

        // Bright solid core — makes each particle actually visible as a dot
        cx.beginPath()
        cx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2)
        cx.fillStyle = `rgba(167, 243, 208, ${p.alpha})`
        cx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      style={{ opacity: 0.9 }}
    />
  )
}
