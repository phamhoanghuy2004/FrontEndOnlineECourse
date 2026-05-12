import React, { useEffect, useState } from 'react';
import ReviewCard from '../../../../common/student/guest/home/ReviewCard';
import CommonMarquee from '../../../../common/CommonMarquee';
import SectionHeader from '../../../../common/SectionHeader';
import reviewApi from '../../../../../api/reviewApi';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Mock Data dự phòng (Fallback)
  const fallbackReviews = [
    { id: 1, name: "Nguyễn Thị Tuyết", content: "Thật là một khóa học thú vị.", userAvatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Trần Đức Bo", content: "Khóa học tuyệt vời.", userAvatar: "https://i.pravatar.cc/150?img=11" },
    { id: 3, name: "Trần Thanh Nhã", content: "Bổ ích lắm ạ.", userAvatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Lê Văn Luyện", content: "Cải thiện kỹ năng rõ rệt.", userAvatar: "https://i.pravatar.cc/150?img=13" },
    { id: 5, name: "Trần Văn Thời", content: "Em sẽ giới thiệu bạn bè.", userAvatar: "https://i.pravatar.cc/150?img=59" },
    { id: 6, name: "Nguyễn Thị Phiến", content: "Đáng tiền bỏ ra.", userAvatar: "https://i.pravatar.cc/150?img=9" },
    { id: 7, name: "Nguyễn Anh Kim", content: "Giáo viên quá giỏi.", userAvatar: "https://i.pravatar.cc/150?img=5" },
    { id: 8, name: "Phạm Thoại", content: "Học xong tự tin hẳn.", userAvatar: "https://i.pravatar.cc/150?img=60" },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewApi.getFeaturedReviewsApi();
        console.log("Dữ liệu đánh giá từ Backend:", response.data);
        
        if (response.data && response.data.length > 0) {
          const mappedReviews = response.data.map(r => ({
            id: r.id,
            name: r.userName || "Học viên ẩn danh",
            comment: r.content,
            rating: r.rating,
            avatar: r.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userName || 'U')}&background=random`
          }));
          
          // Nếu có ít đánh giá, lặp lại chúng để đủ 8 cái cho 2 hàng chạy mượt
          let finalData = [...mappedReviews];
          while (finalData.length > 0 && finalData.length < 8) {
            finalData = [...finalData, ...mappedReviews];
          }
          setReviews(finalData.slice(0, Math.max(8, finalData.length)));
        } else {
          setReviews(fallbackReviews.map(r => ({...r, comment: r.content, avatar: r.userAvatar, rating: 5})));
        }
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
        setReviews(fallbackReviews.map(r => ({...r, comment: r.content, avatar: r.userAvatar, rating: 5})));
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Chia làm 2 hàng (Row 1 & Row 2)
  // Luôn đảm bảo có đủ dữ liệu cho cả 2 hàng
  const row1 = reviews.slice(0, Math.ceil(reviews.length / 2));
  const row2 = reviews.slice(Math.ceil(reviews.length / 2));

  return (
    <section className="py-20 bg-primary text-white overflow-hidden">
      
      {/* Header */}
      <SectionHeader
        title="Học viên nói gì về chúng tôi?"
        description=" Hơn 5000+ học viên đã tin tưởng và đạt được kết quả mong muốn. Hãy xem họ nói gì về trải nghiệm học tập tại Echill."
        align="left"
        titleClassName='text-white'
        descriptionClassName='text-white'
      />

      {/* --- MARQUEE AREA --- */}
      <div className="flex flex-col gap-6"> 
        <CommonMarquee
          data={row1}
          CardComponent={ReviewCard}
          duration="40s" 
        />

        <CommonMarquee
          data={row2}
          CardComponent={ReviewCard}
          direction="reverse" 
          duration="35s"      
        />
      </div>
    </section>
  );
};

export default Testimonials;