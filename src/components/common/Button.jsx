import React from 'react';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    type = 'button',
    disabled = false
}) => {

    const baseStyles = "px-8 py-3 rounded-full font-bold transition-all duration-300 transform flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 hover:bg-emerald-600 hover:-translate-y-1",
        secondary: "bg-[#EAFFF9] text-emerald-600 hover:bg-[#dbfbf3] hover:-translate-y-1",
        outline: "border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50 hover:-translate-y-1",
    };

    const disabledStyles = "opacity-50 cursor-not-allowed transform-none hover:transform-none";

    const combinedStyles = `${baseStyles} ${variants[variant] || variants.primary} ${disabled ? disabledStyles : ''} ${className}`;

    return (
        <button
            type={type}
            onClick={!disabled ? onClick : undefined}
            className={combinedStyles}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;