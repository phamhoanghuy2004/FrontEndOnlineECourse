import ReviewCard from '../../common/ReviewCard';
import CommonMarquee from '../../common/CommonMarquee';

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

        {/* Hàng 1: Chạy từ Trái sang Phải (Mặc định) */}
        <CommonMarquee
          data={row1}
          CardComponent={ReviewCard}
          duration="40s" // Tốc độ như cũ
        />

        {/* Hàng 2: Chạy từ Phải sang Trái (Reverse) & Nhanh hơn xíu */}
        <CommonMarquee
          data={row2}
          CardComponent={ReviewCard}
          direction="reverse" // Đảo chiều như cũ
          duration="35s"      // Chạy nhanh hơn để so le
        />

      </div>
    </section>
  );
};

export default Testimonials;