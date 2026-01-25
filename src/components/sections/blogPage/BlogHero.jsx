import React from 'react';
import { motion } from 'framer-motion';

const BlogHero = () => {
    return (
        <section className="bg-gradient-to-r from-primary/10 to-blue-100 py-20">
            <div className="container mx-auto px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
                >
                    Chia sẻ kiến thức & Kinh nghiệm
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-gray-600 max-w-2xl mx-auto"
                >
                    Cập nhật những phương pháp học tập hiệu quả, tài liệu mới nhất và mẹo thi cử từ đội ngũ giảng viên giàu kinh nghiệm.
                </motion.p>
            </div>
        </section>
    );
};

export default BlogHero;
