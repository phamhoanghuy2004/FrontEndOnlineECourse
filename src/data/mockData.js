export const navLinks = [{
        name: "Khóa học",
        href: "/courses",
        dropdown: [{
                name: "TOEIC",
                href: "/courses"
            },
            {
                name: "IELTS",
                href: "/courses"
            },
        ]
    },
    {
        name: "Đánh giá trình độ",
        href: "/level-test"
    },
    {
        name: "Luyện đề",
        href: "/testPractice",
        dropdown: [{
                name: "TOEIC",
                href: "/testPractice"
            },
            {
                name: "IELTS",
                href: "/testPractice"
            },
        ]
    },
    {
        name: "Blog",
        href: "/"
    },
    {
        name: "Liên hệ",
        href: "/"
    },
];

export const steps = [{
        id: 1,
        title: "Kiểm tra trình độ",
        desc: "Thực hiện bài kiểm tra để chúng tôi xác định trình độ của bạn.",
        icon: "B1"
    },
    {
        id: 2,
        title: "Nhận đề xuất",
        desc: "Dựa trên kết quả đó. Chúng tôi sẽ đề xuất khóa học phù hợp.",
        icon: "B2"
    },
    {
        id: 3,
        title: "Học và chill",
        desc: "Đăng ký khóa học mong muốn và học tập với sự trợ giúp từ AI.",
        icon: "B3"
    },
];

export const courses = [{
        id: 1,
        title: "TOEIC Basic 450+",
        description: "Lấy lại căn bản từ con số 0, mục tiêu đạt 450+.",
        price: "200.000đ",
        rating: 4.5,
        reviewCount: "16,325",
        students: 120,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/614786882_2632756040432705_8535312098585471585_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFiUI8Tyoi3zZ7nkK7uv2Apqr_r2eqFO22qv-vZ6oU7bcB7iwz3DfWfwvryhpSXJdb8GFZ57OlvbFwK4E2BrOcj&_nc_ohc=O2RJQxrDZusQ7kNvwH88Wya&_nc_oc=AdkWEcgs76zRy8mCFf6KN1FSmMVkDY-6OZcbpAeTjdptq7x07yxeK42UXQa8bSQPX6s&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=abinq4ju-7TdJ0SGgbgy8g&oh=00_Afr_k1C6gdOiM90m6mTLQB6gAByeppvpELj6pbrvzy-6SA&oe=696F7DBB", // Thay ảnh thật sau
        tutor: "Ms. Hoa",
        avatarGV: "https://i.pravatar.cc/150?img=1",
        tag: "TOEIC",
        level: "BASIC",
        trialLesson: {
            video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Ví dụ video
            document: "https://example.com/document.pdf",
            test: "https://example.com/test",
            description: "Học thử bài 1: Giới thiệu về TOEIC và các thì cơ bản trong tiếng Anh."
        }
    },
    {
        id: 2,
        title: "TOEIC Advanced 800+",
        description: "Chiến thuật giải đề thực chiến, bứt phá mốc 800+.",
        price: "500.000đ",
        rating: 4.8,
        reviewCount: "8,450",
        students: 85,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/614045228_2632756207099355_5276660425071840258_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeExmGrAVfnq7TIY2UrFLiJXjfLKEZxcx4yN8soRnFzHjM7sdAHzwFobXN1sCaiss-Pf6qXzWsxNcdjLP0g2lAsD&_nc_ohc=lhFry8nFoGIQ7kNvwEKIkaq&_nc_oc=AdlhVBC4u2-qVSqDVTv2UOPtR9SkMKnDBIniP0EVCQ9w9laCqUkx-bUrekSvAfiZDbI&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=Y-pWySP24kcgskGLG32TmQ&oh=00_Afq2oaO2g7qoeu8xgvFS_ANX0tnPb6xkFuvFiVzKeyxB7A&oe=696F6CB1",
        tutor: "Mr. Jack",
        avatarGV: "https://i.pravatar.cc/150?img=5",
        tag: "TOEIC",
        level: "ADVANCE",
        trialLesson: {
            video: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
            document: "https://example.com/document-adv.pdf",
            test: "https://example.com/test-adv",
            description: "Học thử bài 1: Chiến thuật nghe Part 3, 4 đỉnh cao."
        }
    },
    {
        id: 3,
        title: "IELTS Foundation",
        description: "Xây dựng nền tảng 4 kỹ năng chuẩn quốc tế.",
        price: "800.000đ",
        rating: 4.9,
        reviewCount: "12,100",
        students: 200,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/614908279_2632756120432697_2974025794158688791_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHO4gOhNZ7TasHfvuwqN5_0GlU6DgL-QqwaVToOAv5CrK_lMF7L5ztAPa4gfryiEXszldW--qO078EnhXGFzm8y&_nc_ohc=qRzKuntQ1vQQ7kNvwE3skGK&_nc_oc=Adm9RMXrc7IR3NnfqRFp4zg0oSP9ihlAgvNTMp2vtSU8_tMGH9mz0Q1E3X5FU3seT4E&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=G6Koh02Pu0nUtRPPbYyteg&oh=00_AfpnKCWX625-SlIgSpUQkeR36AFlJnm1oO77b4FS8YbuqA&oe=696F7536",
        tutor: "Ms. Lan",
        avatarGV: "https://i.pravatar.cc/150?img=3",
        tag: "IELTS",
        level: "BASIC",
        trialLesson: {
            video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            document: "https://example.com/ielts-doc.pdf",
            test: "https://example.com/ielts-test",
            description: "Học thử bài 1: Speaking Part 1 - Intro & Interview."
        }
    },
];

export const instructors = [{
        id: 1,
        name: "Thầy Huy",
        qualification: "TOEIC 990",
        bio: "Chuyên gia lấy gốc tiếng Anh, cam kết đầu ra 450+ cho người mất gốc hoàn toàn.",
        image: "https://i.pravatar.cc/300?img=11", // Ảnh mẫu
        social: {
            twitter: "#",
            linkedin: "#"
        }
    },
    {
        id: 2,
        name: "Cô Nhàn",
        qualification: "IELTS 8.5",
        bio: "Hơn 10 năm kinh nghiệm, chuyên thiết kế lộ trình cá nhân hóa giúp học viên đạt aim nhanh chóng.",
        image: "https://i.pravatar.cc/300?img=5",
        social: {
            twitter: "#",
            linkedin: "#"
        }
    },
    {
        id: 3,
        name: "Thầy Jack",
        qualification: "IELTS 8.0",
        bio: "Bậc thầy chiến thuật Reading & Listening, giúp bạn chinh phục các bài thi khó nhằn nhất.",
        image: "https://i.pravatar.cc/300?img=3",
        social: {
            twitter: "#",
            linkedin: "#"
        }
    },
    {
        id: 4,
        name: "Cô Jenny",
        qualification: "TESOL Master",
        bio: "Phương pháp giảng dạy hiện đại, tập trung vào phản xạ giao tiếp tự nhiên và phát âm chuẩn.",
        image: "https://i.pravatar.cc/300?img=9",
        social: {
            twitter: "#",
            linkedin: "#"
        }
    },
    {
        id: 5,
        name: "Thầy David",
        qualification: "Business English",
        bio: "Cựu giám đốc nhân sự tập đoàn đa quốc gia, chuyên đào tạo tiếng Anh thương mại và phỏng vấn.",
        image: "https://i.pravatar.cc/300?img=13", // Ảnh mới
        social: {
            twitter: "#",
            linkedin: "#"
        }
    },
    {
        id: 6,
        name: "Cô Sarah",
        qualification: "SAT 1500+",
        bio: "Chuyên luyện thi chứng chỉ SAT/ACT, giúp học viên săn học bổng du học Mỹ, Canada.",
        image: "https://i.pravatar.cc/300?img=24", // Ảnh mới
        social: {
            twitter: "#",
            linkedin: "#"
        }
    },
];

export const testimonials = [{
        id: 1,
        name: "Nguyễn Văn A",
        role: "Sinh viên",
        content: "Khóa học rất thực tế, giúp mình tăng 200 điểm TOEIC chỉ sau 2 tháng.",
        avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
        id: 2,
        name: "Trần Thị B",
        role: "Nhân viên VP",
        content: "Giảng viên nhiệt tình, hỗ trợ sửa bài chi tiết 24/7.",
        avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
        id: 3,
        name: "Lê Văn C",
        role: "IT Dev",
        content: "Giao diện web đẹp, dễ học, lộ trình rõ ràng.",
        avatar: "https://i.pravatar.cc/150?img=3"
    },
];


export const sections = [{
        id: 'basic',
        title: 'Basic',
        description: 'Khởi đầu vững chắc cho người mới bắt đầu hoặc mất gốc. Lộ trình được thiết kế tinh gọn giúp bạn nhanh chóng lấy lại nền tảng ngữ pháp và từ vựng cốt lõi.',
        data: [...courses, ...courses] // Ở đây tôi dùng chung data mẫu, thực tế bạn filter: courses.filter(c => c.level === 'Basic')
    },
    {
        id: 'medium',
        title: 'Medium',
        description: 'Bứt phá giới hạn và hoàn thiện kỹ năng toàn diện. Lộ trình tập trung vào tư duy ngôn ngữ chuyên sâu, giúp bạn tự tin giao tiếp và xử lý các dạng đề thi phức tạp.',
        data: [...courses, ...courses] // courses.filter(c => c.level === 'Medium')
    },
    {
        id: 'advanced',
        title: 'Advanced',
        description: 'Chinh phục đỉnh cao ngôn ngữ với các bài giảng nâng cao. Phù hợp cho những ai muốn đạt điểm số tối đa và sử dụng tiếng Anh như người bản xứ.',
        data: [...courses, ...courses] // courses.filter(c => c.level === 'Advanced')
    }
];

export const testSets = [
    // --- TOEIC ---
    {
        id: 1,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/615684832_2637666403275002_6151656838858651882_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFXaSzx4wBnSekofig17CgRKN8eFgMf4roo3x4WAx_iuiacx4KYwCviym3ts93BVHC66WTV2trC5CXiomRhdcrn&_nc_ohc=CsVXNWczSNMQ7kNvwE0vi3d&_nc_oc=AdlcR6Imn-ETbdV5X2H3tooxMCr14Ovg_fENtUigzoXJtYGpwBrXp7yfkkqbB-GCbiY&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=EowHgpP1aRsf7mRUR_4IHg&oh=00_AfoXR_jwFIxG-WQq3h2oUMN7nINLWrIAyn9vbeVknkq4PA&oe=696FD0E9",
        tag: "TOEIC",
        title: "ETS 2024 - Full Test",
        description: "Bộ đề cập nhật mới nhất từ IIG, bám sát cấu trúc đề thi thật năm nay.",
        price: 15,
    },
    {
        id: 2,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/615684832_2637666403275002_6151656838858651882_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFXaSzx4wBnSekofig17CgRKN8eFgMf4roo3x4WAx_iuiacx4KYwCviym3ts93BVHC66WTV2trC5CXiomRhdcrn&_nc_ohc=CsVXNWczSNMQ7kNvwE0vi3d&_nc_oc=AdlcR6Imn-ETbdV5X2H3tooxMCr14Ovg_fENtUigzoXJtYGpwBrXp7yfkkqbB-GCbiY&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=EowHgpP1aRsf7mRUR_4IHg&oh=00_AfoXR_jwFIxG-WQq3h2oUMN7nINLWrIAyn9vbeVknkq4PA&oe=696FD0E9",
        tag: "TOEIC",
        title: "Hacker TOEIC 3",
        description: "Bộ đề khó hơn thi thật, giúp rèn luyện tâm lý vững vàng để đạt 900+.",
        price: 10,
    },
    {
        id: 3,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/615684832_2637666403275002_6151656838858651882_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFXaSzx4wBnSekofig17CgRKN8eFgMf4roo3x4WAx_iuiacx4KYwCviym3ts93BVHC66WTV2trC5CXiomRhdcrn&_nc_ohc=CsVXNWczSNMQ7kNvwE0vi3d&_nc_oc=AdlcR6Imn-ETbdV5X2H3tooxMCr14Ovg_fENtUigzoXJtYGpwBrXp7yfkkqbB-GCbiY&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=EowHgpP1aRsf7mRUR_4IHg&oh=00_AfoXR_jwFIxG-WQq3h2oUMN7nINLWrIAyn9vbeVknkq4PA&oe=696FD0E9",
        tag: "TOEIC",
        title: "YBM TOEIC Vol.3",
        description: "Giọng đọc giống 99% đề thi thật, phù hợp luyện nghe chuyên sâu.",
        price: 12,
    },

    // --- IELTS ---
    {
        id: 4,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/616172523_2637666399941669_5416493300576885571_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHk6oraPyrs4bPz_xETbhw2HFw_ZcTDuyQcXD9lxMO7JDDENnvVSA4GWTXYrabmYmliVoDpPlCnLbQNBVP0nJzd&_nc_ohc=be1UKsM2N7YQ7kNvwFB4gWR&_nc_oc=AdlA2yMdxeZFc3Cj4tB0IpSgtoOTwsJSGwwaMcrgiwlciIXWdukYWzr5HkIfGMA7YAc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=yVssFuCGZM_Wl9PM_qMB7g&oh=00_AfpvPwyIp9BmMwQ-pQzWKSw_3KXGp7mvpmYLoVKda4Knmg&oe=696FF482",
        tag: "IELTS",
        title: "Cambridge IELTS 18",
        description: "Bộ đề 'gối đầu giường' cho dân IELTS, cập nhật xu hướng ra đề mới nhất.",
        price: 20,
    },
    {
        id: 5,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/616172523_2637666399941669_5416493300576885571_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHk6oraPyrs4bPz_xETbhw2HFw_ZcTDuyQcXD9lxMO7JDDENnvVSA4GWTXYrabmYmliVoDpPlCnLbQNBVP0nJzd&_nc_ohc=be1UKsM2N7YQ7kNvwFB4gWR&_nc_oc=AdlA2yMdxeZFc3Cj4tB0IpSgtoOTwsJSGwwaMcrgiwlciIXWdukYWzr5HkIfGMA7YAc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=yVssFuCGZM_Wl9PM_qMB7g&oh=00_AfpvPwyIp9BmMwQ-pQzWKSw_3KXGp7mvpmYLoVKda4Knmg&oe=696FF482",
        tag: "IELTS",
        title: "IELTS Trainer 2",
        description: "6 bài test kèm hướng dẫn giải chi tiết từng kỹ năng từ Cambridge.",
        price: 18,
    },
    {
        id: 6,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/616172523_2637666399941669_5416493300576885571_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHk6oraPyrs4bPz_xETbhw2HFw_ZcTDuyQcXD9lxMO7JDDENnvVSA4GWTXYrabmYmliVoDpPlCnLbQNBVP0nJzd&_nc_ohc=be1UKsM2N7YQ7kNvwFB4gWR&_nc_oc=AdlA2yMdxeZFc3Cj4tB0IpSgtoOTwsJSGwwaMcrgiwlciIXWdukYWzr5HkIfGMA7YAc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=yVssFuCGZM_Wl9PM_qMB7g&oh=00_AfpvPwyIp9BmMwQ-pQzWKSw_3KXGp7mvpmYLoVKda4Knmg&oe=696FF482",
        tag: "IELTS",
        title: "Mindset for IELTS 3",
        description: "Giáo trình tích hợp luyện đề và phát triển tư duy ngôn ngữ academic.",
        price: 25,
    }
];


export const testSetType = [{
        id: 'toeic',
        title: 'TOEIC',
        description: 'Tổng hợp các bộ đề TOEIC chất lượng, bám sát cấu trúc đề thi thật. Hệ thống bài tập phong phú giúp người học củng cố kiến thức, hoàn thiện kỹ năng làm bài và tự tin chinh phục mục tiêu điểm số.',
        data: testSets // Ở đây tôi dùng chung data mẫu, thực tế bạn filter: courses.filter(c => c.level === 'Basic')
    },
    {
        id: 'ielts',
        title: 'IELTS',
        description: 'Hệ thống bài test IELTS chất lượng giúp người học làm quen với áp lực phòng thi và đa dạng dạng bài. Hỗ trợ củng cố kiến thức nền tảng, khắc phục điểm yếu và tối ưu hóa kết quả trong thời gian ngắn nhất.',
        data: testSets // Ở đây tôi dùng chung data mẫu, thực tế bạn filter: courses.filter(c => c.level === 'Basic')
    }
]

// Mock Data học viên
export const topStudents = [{
        id: 1,
        name: "Phạm Hoàng Huy",
        avatar: "https://i.pravatar.cc/150?img=11",
        scores: {
            reading: 8.5,
            listening: 8.0,
            speaking: 8.0,
            writing: 8.0,
            total: 8.0
        }
    },
    {
        id: 2,
        name: "Nguyễn Thảo Ly",
        avatar: "https://i.pravatar.cc/150?img=5",
        scores: {
            reading: 9.0,
            listening: 8.5,
            speaking: 7.5,
            writing: 7.0,
            total: 8.0
        }
    },
    {
        id: 3,
        name: "Trần Đức Bo",
        avatar: "https://i.pravatar.cc/150?img=3",
        scores: {
            reading: 7.5,
            listening: 8.0,
            speaking: 8.5,
            writing: 7.5,
            total: 8.0
        }
    },
    {
        id: 4,
        name: "Lê Văn Luyện",
        avatar: "https://i.pravatar.cc/150?img=13",
        scores: {
            reading: 8.0,
            listening: 7.5,
            speaking: 7.0,
            writing: 7.5,
            total: 7.5
        }
    },
    {
        id: 5,
        name: "Đỗ Nhật Nam",
        avatar: "https://i.pravatar.cc/150?img=60",
        scores: {
            reading: 9.0,
            listening: 9.0,
            speaking: 8.5,
            writing: 8.0,
            total: 8.5
        }
    },
];