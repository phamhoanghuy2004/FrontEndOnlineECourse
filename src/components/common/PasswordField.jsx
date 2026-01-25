import { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordField = ({ 
    label = "Mật khẩu", 
    placeholder = "••••••••", 
    value, 
    onChange, 
    size = "md", // "sm" (Login) hoặc "md" (Register)
    required = false 
}) => {
    const [showPassword, setShowPassword] = useState(false);

    // Cấu hình style theo size
    const styles = {
        sm: {
            label: "text-[10px]",
            padding: "py-2",
            iconSize: 12
        },
        md: {
            label: "text-[11px]",
            padding: "py-2.5",
            iconSize: 13
        }
    };

    const currentStyle = styles[size] || styles.md;

    return (
        <div className="space-y-1">
            <label className={`${currentStyle.label} font-bold text-slate-700 ml-1 uppercase tracking-wide`}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative group">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs group-focus-within:text-emerald-500 transition-colors" />
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    className={`w-full pl-9 pr-9 ${currentStyle.padding} text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700`}
                    placeholder={placeholder}
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                    {showPassword ? <FaEyeSlash size={currentStyle.iconSize} /> : <FaEye size={currentStyle.iconSize} />}
                </button>
            </div>
        </div>
    );
};

export default PasswordField;