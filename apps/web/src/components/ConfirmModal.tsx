import { HugeiconsIcon } from '@hugeicons/react'
import { AlertCircleIcon, Alert02Icon, HelpCircleIcon } from '@hugeicons/core-free-icons'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'destructive' | 'warning' | 'default'
  onConfirm: () => void
  onCancel?: () => void
}

export default function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    onOpenChange(false)
  }

  const iconConfig = {
    destructive: {
      icon: AlertCircleIcon,
      bgColor: 'bg-destructive/15 text-destructive border-destructive/30',
      buttonVariant: 'destructive' as const,
    },
    warning: {
      icon: Alert02Icon,
      bgColor: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
      buttonVariant: 'default' as const,
    },
    default: {
      icon: HelpCircleIcon,
      bgColor: 'bg-primary/15 text-primary border-primary/30',
      buttonVariant: 'default' as const,
    },
  }[variant]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${iconConfig.bgColor}`}
            >
              <HugeiconsIcon icon={iconConfig.icon} size={20} />
            </div>
            <div className="space-y-1 text-left">
              <DialogTitle
                className="text-base font-extrabold text-foreground tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2 pt-2 border-t border-border mt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-xs font-semibold h-8"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={iconConfig.buttonVariant}
            size="sm"
            onClick={handleConfirm}
            className={`text-xs font-bold h-8 active:scale-95 transition-transform ${
              variant === 'warning' ? 'bg-amber-600 hover:bg-amber-500 text-white' : ''
            }`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
