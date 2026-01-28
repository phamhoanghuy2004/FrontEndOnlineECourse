import React from 'react';
import { motion } from 'framer-motion';

const Title = ({ 
    text, 
    as: Tag = "h1", // Mặc định là thẻ h1, nhưng truyền "h2" vào cũng được
    className = "", 
    baseColor = "text-gray-900",   // Màu 1: Đen
    highlightColor = "text-primary", // Màu 2: Xanh
    variants, // Nhận animation truyền vào
}) => {
    
    // Tách chuỗi thành mảng các từ
    const words = text.split(" ");

    return (
        <Tag className={`${className} leading-tight`}>
            {/* Nếu có truyền variants thì bọc motion, không thì render thường */}
            <motion.span 
                variants={variants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="inline-block"
            >
                {words.map((word, index) => {
                    // --- THUẬT TOÁN ĐỔI MÀU ---
                    // Math.floor(index / 2): Gom 2 từ thành 1 nhóm (0,0, 1,1, 2,2...)
                    // % 2 !== 0: Nếu là nhóm lẻ thì Highlight, chẵn thì Base
                    const isHighlight = Math.floor(index / 2) % 2 !== 0;

                    return (
                        <span 
                            key={index} 
                            className={`inline-block mr-[0.25em] ${isHighlight ? highlightColor : baseColor}`}
                        >
                            {word}
                        </span>
                    );
                })}
            </motion.span>
        </Tag>
    );
};

export default Title;