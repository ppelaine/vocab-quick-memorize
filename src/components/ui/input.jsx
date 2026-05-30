import { cn } from '@/lib/utils'

export function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-xl border-2 border-[#e8e0d0] bg-white px-3.5 py-3 text-base font-semibold transition-all duration-200',
        'placeholder:text-[#9a948c]',
        'focus:outline-none focus:border-[#ff7b5c] focus:shadow-[0_0_0_4px_rgba(255,123,92,.12)]',
        'file:border-0 file:bg-transparent file:text-sm file:font-bold',
        className
      )}
      {...props}
    />
  )
}
