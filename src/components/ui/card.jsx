import { cn } from '@/lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,.06)] border border-black/[.03] transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,.08)]',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('px-6 pt-6 pb-0', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-extrabold leading-none tracking-tight', className)} {...props} />
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-[#9a948c]', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6', className)} {...props} />
}

export function CardFooter({ className, ...props }) {
  return <div className={cn('flex items-center px-6 pb-6 pt-0', className)} {...props} />
}
