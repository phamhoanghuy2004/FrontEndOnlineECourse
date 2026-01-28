const InputField = ({
    label,
    icon: Icon,
    type,
    placeholder,
    value,
    name,
    onChange,
    size = "normal", // Mặc định là normal (Register), truyền "compact" cho Login
    required = false // Mặc định không hiện sao
}) => {
    // Cấu hình style dựa trên size
    const isCompact = size === "compact";
    const labelClass = isCompact ? "text-[10px]" : "text-[11px]"; // Login nhỏ hơn
    const inputPadding = isCompact ? "py-2" : "py-2.5";           // Login thấp hơn

    return (
        <div className="space-y-1">
            <label className={`${labelClass} font-bold text-slate-700 ml-1 uppercase tracking-wide`}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative group">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs group-focus-within:text-emerald-500 transition-colors" />
                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    className={`w-full pl-9 pr-3 ${inputPadding} text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export default InputField