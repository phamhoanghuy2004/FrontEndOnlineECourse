import React from 'react';
import { FaStar } from "react-icons/fa";

// 1. Mock Data: Chia làm 2 hàng (Row 1 & Row 2)
const row1 = [
  { id: 1, name: "Nguyễn Thị Tuyết", comment: "Thật là một khóa học thú vị.", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Trần Đức Bo", comment: "Khóa học tuyệt vời.", avatar: "https://i.pravatar.cc/150?img=11" },
  { id: 3, name: "Trần Thanh Nhã", comment: "Bổ ích lắm ạ.", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Lê Văn Luyện", comment: "Cải thiện kỹ năng rõ rệt.", avatar: "https://i.pravatar.cc/150?img=13" },
];

const row2 = [
  { id: 5, name: "Trần Văn Thời", comment: "Em sẽ giới thiệu bạn bè.", avatar: "https://i.pravatar.cc/150?img=59" },
  { id: 6, name: "Nguyễn Thị Phiến", comment: "Đáng tiền bỏ ra.", avatar: "https://i.pravatar.cc/150?img=9" },
  { id: 7, name: "Nguyễn Anh Kim", comment: "Giáo viên quá giỏi.", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 8, name: "Phạm Thoại", comment: "Học xong tự tin hẳn.", avatar: "https://i.pravatar.cc/150?img=60" },
];

// Component con: Thẻ Review đơn lẻ
const ReviewCard = ({ item }) => (
  <div className="w-[350px] bg-white p-6 rounded-xl shadow-md mx-3 flex flex-col justify-center h-full border border-green-100/50">
    {/* Header: Avatar + Tên */}
    <div className="flex items-center gap-3 mb-4">
      <img
        src={item.avatar}
        alt={item.name}
        className="w-10 h-10 rounded-full object-cover border border-gray-200"
      />
      <span className="font-bold text-gray-800 text-sm">{item.name}</span>
    </div>

    {/* Content: Comment */}
    <h4 className="text-lg font-bold text-gray-900 mb-3">
      {item.comment}
    </h4>

    {/* Footer: Stars */}
    <div className="flex text-yellow-400 text-sm gap-1">
      {[...Array(5)].map((_, i) => <FaStar key={i} />)}
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-20 bg-primary text-white overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Học viên nói gì <br /> về chúng tôi?
        </h2>
        <p className="text-white/80 max-w-lg">
          Hơn 5000+ học viên đã tin tưởng và đạt được kết quả mong muốn. Hãy xem họ nói gì về trải nghiệm học tập tại EduSkill.
        </p>
      </div>

      {/* --- MARQUEE AREA --- */}
      <div className="flex flex-col gap-6"> {/* Khoảng cách giữa 2 hàng */}

        {/* Hàng 1: Chạy từ Trái sang Phải */}
        {/* pause-on-hover: Class tự chế trong CSS để dừng khi hover */}
        <div className="relative w-full overflow-hidden pause-on-hover py-2">
          <div className="animate-marquee flex">
            {/* Render 2 lần danh sách để tạo vòng lặp không đứt đoạn */}
            {[...row1, ...row1, ...row1].map((item, index) => (
              <ReviewCard key={`${item.id}-${index}`} item={item} />
            ))}
          </div>
        </div>

        {/* Hàng 2: Chạy từ Phải sang Trái (Hoặc chạy chậm hơn/nhanh hơn để so le) */}
        <div className="relative w-full overflow-hidden pause-on-hover py-2">
          {/* style={{ animationDirection: 'reverse' }} để chạy ngược chiều */}
          <div className="animate-marquee flex" style={{ animationDuration: '35s', animationDirection: 'reverse' }}>
            {[...row2, ...row2, ...row2].map((item, index) => (
              <ReviewCard key={`${item.id}-${index}`} item={item} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;