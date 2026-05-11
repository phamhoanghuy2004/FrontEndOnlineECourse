import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from "react-icons/fi";
import { RiCoinFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import ToeicTestSet from '../../../../../assets/ToeicTestSet.jpg'

const TestSetCard = ({ data }) => {
    return (
        <Link to={`/tests/${data.id}`} state={data} className='block h-full'>
            <motion.div
                whileHover={{ y: -15 }}
                transition={{ type: "spring", stiffness: 1000, damping: 60 }}
                className="group bg-slate-50 rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col"
            >
                {/* 1. IMAGE AREA */}
                <div className="relative overflow-hidden rounded-xl h-52 mb-4">
                    <img
                        src={ToeicTestSet}
                        alt={data.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                {/* 2. CONTENT AREA */}
                <div className="flex flex-col flex-grow">
                    {/* Tag */}
                    <span className="text-primary font-bold text-xs uppercase mb-1 block tracking-wide">
                        {data.tag || "TOEIC"}
                    </span>

                    {/* Title & Arrow */}
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 pr-2">
                            {data.title}
                        </h3>
                        <FiArrowUpRight className="text-xl text-gray-400 group-hover:text-primary transition-colors flex-shrink-0 transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                        {data.description}
                    </p>

                    {/* Footer: Price */}
                    <div className="mt-auto flex justify-end items-center gap-1">
                        <span className="text-2xl font-bold text-yellow-400 leading-none">
                            {data.price}
                        </span>
                        <RiCoinFill className="text-yellow-400 text-xl" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default TestSetCard;