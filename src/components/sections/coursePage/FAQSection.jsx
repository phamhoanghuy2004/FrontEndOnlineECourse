import { useState } from 'react';
import { BsChatDotsFill } from "react-icons/bs";
import AccordionItem from '../../common/AccordionItem';
import { useChat } from '../../../context/ChatContext';

// Mock Data câu hỏi
const faqData = [
    {
        id: 1,
        question: "Khóa học có đảm bảo chất lượng đầu ra không?",
        answer: "Chắc chắn rồi! Chúng tôi cam kết bằng văn bản. Nếu bạn không đạt mục tiêu đầu ra sau khi hoàn thành lộ trình và tham gia đầy đủ các buổi học, ECHILL sẽ tổ chức ôn tập lại miễn phí cho đến khi bạn đạt kết quả."
    },
    {
        id: 2,
        question: "Giáo viên tại trung tâm có trình độ như thế nào?",
        answer: "100% đội ngũ giảng viên tại ECHILL đều sở hữu chứng chỉ IELTS 8.0+ hoặc TESOL quốc tế. Các thầy cô không chỉ giỏi chuyên môn mà còn có ít nhất 3 năm kinh nghiệm giảng dạy thực chiến, cực kỳ tâm lý và nhiệt huyết."
    },
    {
        id: 3,
        question: "Học phí có hỗ trợ trả góp không?",
        answer: "Có ạ. Để giảm bớt gánh nặng tài chính cho học viên, chúng tôi hỗ trợ chia nhỏ học phí đóng theo từng giai đoạn hoặc trả góp 0% lãi suất qua thẻ tín dụng liên kết với hơn 20 ngân hàng."
    },
    {
        id: 4,
        question: "Lịch học có linh động cho người đi làm không?",
        answer: "Hoàn toàn linh động. Chúng tôi có các ca học Sáng - Chiều - Tối và cả cuối tuần. Bạn có thể bảo lưu hoặc học bù nếu có lịch công tác đột xuất."
    }
];

const FAQSection = () => {
    // State quản lý câu hỏi nào đang mở (null là đóng hết)
    const [activeIndex, setActiveIndex] = useState(0); // Mặc định mở câu đầu tiên

    const handleToggle = (index) => {
        // Nếu click vào cái đang mở thì đóng lại, ngược lại thì mở cái mới
        setActiveIndex(activeIndex === index ? null : index);
    };

    const { openChat } = useChat();

    return (
        <section className="py-20 bg-gray-50 relative overflow-hidden">
            
            {/* Decoration Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* --- CỘT TRÁI: Tiêu đề & CTA (Chiếm 4/12 cột) --- */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24">
                        <span className="text-primary font-bold uppercase tracking-wider text-sm bg-green-100 px-3 py-1 rounded-full inline-block mb-4">
                            Hỗ trợ 24/7
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            Giải đáp thắc mắc <br/> cùng <span className="text-primary">ECHILL</span>
                        </h2>
                        <p className="text-gray-500 mb-8 text-lg">
                            Bạn còn những băn khoăn chưa được giải đáp? Đừng ngần ngại liên hệ ngay với đội ngũ tư vấn của chúng tôi.
                        </p>

                        {/* Button Chat Custom */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 inline-block">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-primary text-xl">
                                    <BsChatDotsFill />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Bạn cần tư vấn ngay?</p>
                                    <p className="font-bold text-gray-900">Chat với tư vấn viên</p>
                                </div>
                            </div>
                            <button onClick={openChat} className="w-full bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30 hover:bg-green-600 hover:-translate-y-1 transition-all duration-300">
                                Trao đổi trực tiếp
                            </button>
                        </div>
                    </div>

                    {/* --- CỘT PHẢI: Accordion List (Chiếm 7/12 cột) --- */}
                    <div className="lg:col-span-7">
                        {faqData.map((item, index) => (
                            <AccordionItem
                                key={item.id}
                                question={item.question}
                                answer={item.answer}
                                isOpen={activeIndex === index}
                                onClick={() => handleToggle(index)}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FAQSection;