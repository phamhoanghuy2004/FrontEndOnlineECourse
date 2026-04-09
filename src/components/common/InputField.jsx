const InputField = ({
    label,
    icon: Icon,
    type,
    placeholder,
    value,
    name,
    onChange,
    onKeyDown,
    size = "normal", // Mặc định là normal (Register), truyền "compact" cho Login
    required = false, // Mặc định không hiện sao
    error = false // Cờ hiệu báo lỗi
}) => {
    // Cấu hình style dựa trên size
    const isCompact = size === "compact";
    const labelClass = isCompact ? "text-[10px]" : "text-[11px]"; // Login nhỏ hơn
    const inputPadding = isCompact ? "py-2" : "py-2.5";           // Login thấp hơn

    return (
        <div className="space-y-1">
            {label && (
                <label className={`${labelClass} font-bold ml-1 uppercase tracking-wide ${error ? 'text-red-500' : 'text-slate-700'}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-emerald-500'}`} />
                )}
                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 ${inputPadding} text-sm rounded-lg outline-none transition-all placeholder:text-slate-400 font-medium
                    ${error 
                        ? 'bg-red-50 border border-red-400 text-red-900 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                    }`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export default InputField;