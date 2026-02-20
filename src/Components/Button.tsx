 type Size= "sm" |"md"|"lg";


 const sizeClasses: Record<Size, string> = {
  sm: "px-[8px] py-[6px]",
  md: "px-[16px] py-[10px]",
  lg: "px-[24px] py-[14px]",
};




type Props={
    onClick:()=>void;
    children: React.ReactNode;
    disabled?:boolean,
    size: Size
   
}

export default function Button({onClick,children,disabled,size}:Props) {
    return(
        <button disabled={disabled} onClick={onClick} className={`  ${sizeClasses[size]} bg-[#000] text-[#fff] rounded-md ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#333]'}`} >
            {children}
        </button>
    )
}