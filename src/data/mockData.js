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
        href: "/"
    },
    {
        name: "Luyện đề",
        href: "/",
        dropdown: [{
                name: "TOEIC",
                href: "/"
            },
            {
                name: "IELTS",
                href: "/"
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
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/614786882_2632756040432705_8535312098585471585_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFiUI8Tyoi3zZ7nkK7uv2Apqr_r2eqFO22qv-vZ6oU7bcB7iwz3DfWfwvryhpSXJdb8GFZ57OlvbFwK4E2BrOcj&_nc_ohc=6m9wxbo-2OkQ7kNvwHzJAQ0&_nc_oc=AdnpPo0MsWuBPUF4W95BbNC4NrH2qB-pR9yWRV196biLF8i5seF0e-J4493vdYTD_9U&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=C-TMq--z1QfgHsQJaztO_Q&oh=00_AfpewqlpzJ023Hdwadt2gXEM5-Mr-uUmDQ6sD7eyX_OZBw&oe=69683D7B", // Thay ảnh thật sau
        tutor: "Ms. Hoa",
        avatarGV: "https://i.pravatar.cc/150?img=1",
        tag: "TOEIC",
        level: "BASIC"
    },
    {
        id: 2,
        title: "TOEIC Advanced 800+",
        description: "Chiến thuật giải đề thực chiến, bứt phá mốc 800+.",
        price: "500.000đ",
        rating: 4.8,
        reviewCount: "8,450",
        students: 85,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/614045228_2632756207099355_5276660425071840258_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeExmGrAVfnq7TIY2UrFLiJXjfLKEZxcx4yN8soRnFzHjM7sdAHzwFobXN1sCaiss-Pf6qXzWsxNcdjLP0g2lAsD&_nc_ohc=puQ2VkJGgw8Q7kNvwFvllLt&_nc_oc=Adnp6KO6QpvJgGOPN1YQpSmB7ni-8e1BeIaWL7Lx2fn7GFM2LPCHLxh8Lrz1ESfyMlI&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=FiRC578zTW6MVp7DU__20w&oh=00_AfoY8NAudbaMI-GT0mbFgCbX2ikLx1rA0rz8JNSzfUNYlg&oe=69682C71",
        tutor: "Mr. Jack",
        avatarGV: "https://i.pravatar.cc/150?img=5",
        tag: "TOEIC",
        level: "ADVANCE"
    },
    {
        id: 3,
        title: "IELTS Foundation",
        description: "Xây dựng nền tảng 4 kỹ năng chuẩn quốc tế.",
        price: "800.000đ",
        rating: 4.9,
        reviewCount: "12,100",
        students: 200,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/614908279_2632756120432697_2974025794158688791_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHO4gOhNZ7TasHfvuwqN5_0GlU6DgL-QqwaVToOAv5CrK_lMF7L5ztAPa4gfryiEXszldW--qO078EnhXGFzm8y&_nc_ohc=pq-Eteqsx2UQ7kNvwHrx7Wa&_nc_oc=AdlpL4SFEqY5G1L6S_mZGECRTkG83F3bSFgTxqu9tAC2jR7BU08NNU978ZI3gUGYBTo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=ivlV5Q7rTRqS5f-1E9_qcA&oh=00_AfoMfAObVWxyJK5mZ1H8ehmD0TaaEFFaTFGWCugZ9tp1YA&oe=696834F6",
        tutor: "Ms. Lan",
        avatarGV: "https://i.pravatar.cc/150?img=3",
        tag: "IELTS",
        level: "BASIC"
    },
];

export const instructors = [
    {
        id: 1,
        name: "Thầy Huy",
        qualification: "TOEIC 990",
        bio: "Chuyên gia lấy gốc tiếng Anh, cam kết đầu ra 450+ cho người mất gốc hoàn toàn.",
        image: "https://i.pravatar.cc/300?img=11", // Ảnh mẫu
        social: { twitter: "#", linkedin: "#" }
    },
    {
        id: 2,
        name: "Cô Nhàn",
        qualification: "IELTS 8.5",
        bio: "Hơn 10 năm kinh nghiệm, chuyên thiết kế lộ trình cá nhân hóa giúp học viên đạt aim nhanh chóng.",
        image: "https://i.pravatar.cc/300?img=5",
        social: { twitter: "#", linkedin: "#" }
    },
    {
        id: 3,
        name: "Thầy Jack",
        qualification: "IELTS 8.0",
        bio: "Bậc thầy chiến thuật Reading & Listening, giúp bạn chinh phục các bài thi khó nhằn nhất.",
        image: "https://i.pravatar.cc/300?img=3",
        social: { twitter: "#", linkedin: "#" }
    },
    {
        id: 4,
        name: "Cô Jenny",
        qualification: "TESOL Master",
        bio: "Phương pháp giảng dạy hiện đại, tập trung vào phản xạ giao tiếp tự nhiên và phát âm chuẩn.",
        image: "https://i.pravatar.cc/300?img=9",
        social: { twitter: "#", linkedin: "#" }
    },
    {
        id: 5,
        name: "Thầy David",
        qualification: "Business English",
        bio: "Cựu giám đốc nhân sự tập đoàn đa quốc gia, chuyên đào tạo tiếng Anh thương mại và phỏng vấn.",
        image: "https://i.pravatar.cc/300?img=13", // Ảnh mới
        social: { twitter: "#", linkedin: "#" }
    },
    {
        id: 6,
        name: "Cô Sarah",
        qualification: "SAT 1500+",
        bio: "Chuyên luyện thi chứng chỉ SAT/ACT, giúp học viên săn học bổng du học Mỹ, Canada.",
        image: "https://i.pravatar.cc/300?img=24", // Ảnh mới
        social: { twitter: "#", linkedin: "#" }
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