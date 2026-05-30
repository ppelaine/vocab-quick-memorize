import { useRef, useEffect, useState } from 'react'

function ToastItem({ toast }) {
  const ref = useRef(null)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setExiting(true), 2200)
    return () => clearTimeout(t)
  }, [])

  const bg = toast.type === 'success' ? '#58b368' : '#f2675a'

  return (
    <div
      ref={ref}
      className="px-8 py-3.5 rounded-[28px] text-white font-extrabold text-sm shadow-[0_8px_32px_rgba(0,0,0,.15)] pointer-events-none"
      style={{
        background: bg,
        animation: exiting
          ? 'toast-out 0.3s ease forwards'
          : 'toast-in 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {toast.message}
    </div>
  )
}

export default function ToastContainer({ toasts }) {
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 items-center">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
