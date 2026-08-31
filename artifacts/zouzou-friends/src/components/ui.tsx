import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'board' | 'ghost';
  children: React.ReactNode;
}

export function ActionButton({ 
  children, onClick, className = '', variant = 'primary', disabled = false, ...props
}: ActionButtonProps) {
  const variants = {
    primary: 'bg-[#D97736] text-white shadow-[0_4px_0_0_#994B1B]',
    secondary: 'bg-[#B5EAD7] text-[#4A3B32] shadow-[0_4px_0_0_#7BA898]',
    danger: 'bg-[#FFB7B2] text-[#4A3B32] shadow-[0_4px_0_0_#C78B87]',
    board: 'bg-transparent text-board border-2 border-board shadow-[0_4px_0_0_var(--board)]',
    ghost: 'bg-transparent text-board hover:bg-black/5 shadow-none'
  };
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2
        active:shadow-none active:translate-y-[4px] 
        transition-all select-none
        ${disabled ? 'opacity-50 cursor-not-allowed active:shadow-[0_4px_0_0_currentColor] active:translate-y-0' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[hsl(var(--background))] border-4 border-board rounded-3xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-black text-board mb-6 text-center tracking-tight">{title}</h2>
        <div className="mb-6 text-board/90 font-medium text-center">
          {children}
        </div>
      </div>
    </div>
  );
}
