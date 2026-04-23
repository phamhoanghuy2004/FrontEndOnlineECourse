import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const CommonCarousel = ({ 
    data, 
    CardComponent, 
    breakpoints = {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }, // Default for courses
    }
}) => {
    return (
        <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{
                delay: 60000,
                disableOnInteraction: false,
            }}
            breakpoints={breakpoints} 
            className="pb-16" 
        >
            {data.map((item, index) => (
                <SwiperSlide key={`${item.id || index}-${index}`} className="py-4 pl-1 !h-auto flex">
                    <CardComponent data={item} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default CommonCarousel;