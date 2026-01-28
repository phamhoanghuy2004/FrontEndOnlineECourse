import { FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { motion } from 'framer-motion';
import { hoverSpring } from "../../../../../constants/motionVariants";

const InstructorCard = ({ data }) => {
    return (
        <motion.div
            whileHover={hoverSpring}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 group text-center border border-gray-100 h-full flex flex-col items-center"
        >
            {/* Avatar Image */}
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full p-1 border-2 border-dashed border-primary/30 group-hover:border-primary transition-colors duration-300">
                    <img
                        src={data.image}
                        alt={data.name}
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                <span className="absolute bottom-0 right-0 w-6 h-6 bg-primary text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    ✓
                </span>
            </div>

            {/* Info */}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                {data.name}
            </h3>
            <span className="text-primary font-bold text-sm mt-1 block">
                {data.qualification}
            </span>

            <p className="text-gray-500 text-sm mt-4 mb-6 leading-relaxed">
                {data.bio}
            </p>

            {/* Social Icons */}
            <div className="mt-auto flex gap-4 justify-center">
                <a href={data.social.twitter} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-blue-400 hover:text-white transition-all duration-300">
                    <FaTwitter />
                </a>
                <a href={data.social.linkedin} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-blue-700 hover:text-white transition-all duration-300">
                    <FaLinkedinIn />
                </a>
            </div>
        </motion.div>
    );
};

export default InstructorCard;