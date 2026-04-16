import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    // Bug Category 3: CSS/Layout - Missing cleanup when modal closes
    // overflow is never reset to '' when isOpen becomes false
    // Body stays locked after modal closes
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Bug Category 3: z-index stacking bug
    // Header has no z-index set, but this overlay uses z-30 instead of z-50
    // On some scroll positions the sticky header (which gets a natural stacking context) renders on top
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg p-6',
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
