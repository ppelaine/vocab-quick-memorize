import { useEffect, useState } from 'react'

const COLORS = ['#ff7b5c', '#f4b843', '#58b368', '#5b9bd5', '#8b6fc0', '#ff9e80', '#ffcc80', '#a5d6a7']

export default function Confetti({ active }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!active) { setParticles([]); return }
    const items = []
    for (let i = 0; i < 80; i++) {
      items.push({
        id: i,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 10,
        x: 50 + (Math.random() - 0.5) * 80,
        delay: Math.random() * 0.6,
        duration: 1.5 + Math.random() * 2,
        rotation: Math.random() * 720 - 360,
        initRotation: Math.random() * 360,
      })
    }
    setParticles(items)
    const timer = setTimeout(() => setParticles([]), 4000)
    return () => clearTimeout(timer)
  }, [active])

  if (!active || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[999]" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}vw`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            background: p.color,
            borderRadius: '2px',
            opacity: 0,
            transform: `rotate(${p.initRotation}deg)`,
            animation: `confetti ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}
