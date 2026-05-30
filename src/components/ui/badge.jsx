import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-xl px-3 py-1 text-xs font-extrabold whitespace-nowrap',
  {
    variants: {
      variant: {
        new: 'bg-[#eef5fb] text-[#3b7fc9]',
        learning: 'bg-[#fff3e8] text-[#f0883e]',
        review: 'bg-[#fef0ee] text-[#e5594d]',
        mastered: 'bg-[#e7f5e9] text-[#3b8c40]',
        default: 'bg-[#f0ebe0] text-[#2d2a28]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
