type Size = "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-3 text-base",
};

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  size?: Size;
};


export default function Button({
  onClick,
  children,
  disabled = false,
  size = "md",
}: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${sizeClasses[size]} bg-slate-900 text-white rounded-md font-medium transition-all ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-slate-800 active:scale-[0.98] shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
      }`}
    >
      {children}
    </button>
  );
}
