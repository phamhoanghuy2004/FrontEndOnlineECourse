import React from 'react';

const SelectField = ({
    label,
    icon: Icon,
    value,
    onChange,
    options = [], // Mảng các option: [{ value: '...', label: '...' }]
    name,
    size = "normal",
    required = false
}) => {
    const isCompact = size === "compact";
    const labelClass = isCompact ? "text-[10px]" : "text-[11px]";
    const inputPadding = isCompact ? "py-2" : "py-2.5";

    return (
        <div className="space-y-1 w-full">
            <label className={`${labelClass} font-bold text-slate-700 ml-1 uppercase tracking-wide`}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative group">
                {/* Icon bên trái */}
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs group-focus-within:text-emerald-500 transition-colors pointer-events-none" />

                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full pl-9 pr-8 ${inputPadding} text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer`}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Mũi tên Chevron bên phải (Custom Arrow) */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>
    );
};

export default SelectField;