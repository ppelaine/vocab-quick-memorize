import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold active:scale-95 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#ff7b5c] text-white shadow-[0_4px_12px_rgba(255,123,92,.3)] hover:bg-[#f06d4e] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,123,92,.4)]',
        secondary: 'bg-[#8b6fc0] text-white shadow-[0_4px_12px_rgba(139,111,192,.3)] hover:bg-[#7d5fb5] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,111,192,.4)]',
        outline: 'border-2 border-[#ff7b5c] text-[#ff7b5c] bg-transparent hover:bg-[#fff0eb] hover:text-[#f06d4e] hover:-translate-y-0.5',
        destructive: 'bg-[#f2675a] text-white shadow-[0_4px_12px_rgba(242,103,90,.25)] hover:bg-[#e5594d] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,103,90,.35)]',
        ghost: 'bg-transparent hover:bg-[#f0ebe0]/50',
        link: 'text-[#ff7b5c] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-[26px]',
        sm: 'h-9 px-[18px] text-xs rounded-[18px]',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      style={{
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      {...props}
    />
  )
}
