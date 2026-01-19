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
        title: "ETS 2024",
        description: "Bộ đề độc quyền mới nhất từ IIG, được cập nhật sát với xu hướng ra đề thi thật năm 2024. Đây là tài liệu chuẩn mực giúp bạn làm quen với nhịp độ và độ khó thực tế của bài thi.",
        price: 15,
        // DANH SÁCH CÁC BÀI TEST TRONG BỘ NÀY
        tests: [{
                id: 101,
                title: "ETS 2024 - Test 01",
                time: 2,
                totalQuestions: 200,
                status: "new",  // TRẠNG THÁI: New
                parts: [
                    // ==============================
                    // PART 1: PHOTOGRAPHS (6 Câu)
                    // ==============================
                    {
                        id: "p1",
                        name: "Part 1",
                        title: "Photographs",
                        description: "Directions: For each question in this part, you will hear four statements about a picture in your test book. When you hear the statements, you must select the one statement that best describes what you see in the picture.",
                        questionCount: 6,
                        type: "listening",
                        questions: [{
                                id: "q1",
                                image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/615589605_2640044289703880_6790642332305010434_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=IYM_7kN4XTgQ7kNvwGxbncW&_nc_oc=AdkXINLJqjAYh31PV15chjVIC3gh_noyk9rE1AH-hSqPqA9e9Q4AzOysGEMlMsRMk6E&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=8vv8UZst6LyfNIxO0taudw&oh=00_Afp5Ge5nM00Bgtem-opT9Kpov9SUmlJ8FNK9mKtOT5WZnw&oe=69737A68",
                                audio: "https://example.com/audio/q1.mp3",
                                options: [
                                    "He is looking at the monitor.",
                                    "He is cleaning his desk.",
                                    "He is typing on a keyboard.",
                                    "He is walking out of the office."
                                ],
                                correctAnswer: "C"
                            },
                            {
                                id: "q2",
                                image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/616828048_2640044306370545_922878851786561556_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=OEU7ccaOmIYQ7kNvwFayGiQ&_nc_oc=Adlq_ZhjyRXgnZVFLgyNBHwJW2Kq8g_GJqfA6i-96LWotuphX3TEkLwN0-IQdgeSzwA&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=oRHJTHhcEAr68dc-1ImRrw&oh=00_AfrGanxPNfOyjkX7QA9_MHtc97otItXcfif2XQvN-Z61aw&oe=697374ED",
                                audio: "https://example.com/audio/q2.mp3",
                                options: [
                                    "She is pouring coffee into a cup.",
                                    "She is holding a document.",
                                    "She is talking on the phone.",
                                    "She is drinking from a mug."
                                ],
                                correctAnswer: "D"
                            }
                        ]
                    },

                    // ==============================
                    // PART 2: QUESTION - RESPONSE (25 Câu)
                    // ==============================
                    {
                        id: "p2",
                        name: "Part 2",
                        title: "Question - Response",
                        description: "Directions: You will hear a question or statement and three responses spoken in English. They will not be printed in your test book and will be spoken only one time.",
                        questionCount: 25,
                        type: "listening",
                        questions: [{
                                id: "q7",
                                audio: "https://example.com/audio/q7.mp3",
                                options: [
                                    "In Conference Room B.",
                                    "At two o'clock.",
                                    "It was a long meeting."
                                ],
                                correctAnswer: "B"
                            },
                            {
                                id: "q8",
                                audio: "https://example.com/audio/q8.mp3",
                                options: [
                                    "Mr. Tanaka is.",
                                    "Yes, I did.",
                                    "It costs fifty dollars."
                                ],
                                correctAnswer: "A"
                            }
                        ]
                    },

                    // ==============================
                    // PART 3: CONVERSATIONS (39 Câu)
                    // ==============================
                    {
                        id: "p3",
                        name: "Part 3",
                        title: "Conversations",
                        description: "Directions: You will hear some conversations between two or more people. You will be asked to answer three questions about what the speakers say in each conversation.",
                        questionCount: 39,
                        type: "listening",
                        groups: [{
                            id: "g1",
                            audio: "https://example.com/audio/part3-group1.mp3",
                            script: "M: Hi, I'd like to check out these books.\nW: Sure, do you have your library card?\nM: No, I left it at home. Can I look it up with my phone number?",
                            questions: [{
                                    id: "q32",
                                    text: "Where most likely are the speakers?",
                                    options: [
                                        "At a bookstore",
                                        "At a library",
                                        "At a post office",
                                        "At a bank"
                                    ],
                                    correctAnswer: "B"
                                },
                                {
                                    id: "q33",
                                    text: "What does the man want to do?",
                                    options: [
                                        "Return some items",
                                        "Apply for a job",
                                        "Borrow some books",
                                        "Pay a fine"
                                    ],
                                    correctAnswer: "C"
                                },
                                {
                                    id: "q34",
                                    text: "What problem does the man mention?",
                                    options: [
                                        "He forgot his card.",
                                        "He lost his wallet.",
                                        "The book is damaged.",
                                        "The store is closed."
                                    ],
                                    correctAnswer: "A"
                                }
                            ]
                        }]
                    },

                    // ==============================
                    // PART 5: INCOMPLETE SENTENCES (30 Câu)
                    // ==============================
                    {
                        id: "p5",
                        name: "Part 5",
                        title: "Incomplete Sentences",
                        description: "Directions: A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence.",
                        questionCount: 30,
                        type: "reading",
                        questions: [{
                                id: "q101",
                                text: "Ms. Layla _______ the marketing report before the meeting started yesterday.",
                                options: ["reviews", "reviewed", "reviewing", "will review"],
                                correctAnswer: "B"
                            },
                            {
                                id: "q102",
                                text: "All employees are required to wear their identification badges _______ at all times.",
                                options: ["visual", "visibly", "vision", "visible"],
                                correctAnswer: "B"
                            },
                            {
                                id: "q103",
                                text: "The new software is _______ easier to use than the previous version.",
                                options: ["significance", "significant", "significantly", "signify"],
                                correctAnswer: "C"
                            }
                        ]
                    },

                    // ==============================
                    // PART 6: TEXT COMPLETION (16 Câu)
                    // ==============================
                    {
                        id: "p6",
                        name: "Part 6",
                        title: "Text Completion",
                        description: "Directions: Read the texts that follow. A word, phrase, or sentence is missing in parts of each text. Select the best answer to complete the text.",
                        questionCount: 16,
                        type: "reading",
                        groups: [{
                            id: "g_p6_1",
                            passageTitle: "To: All Staff | From: Management",
                            passageContent: "We are pleased to announce that the office renovation will begin next Monday. Please remove all personal items from your desks by Friday. _______(131)_______, the kitchen will be closed for two weeks.",
                            questions: [{
                                id: "q131",
                                text: "Select the best answer for (131)",
                                options: ["However", "Therefore", "Additionally", "Instead"],
                                correctAnswer: "C"
                            }]
                        }]
                    },

                    // ==============================
                    // PART 7: READING COMPREHENSION (54 Câu)
                    // ==============================
                    {
                        id: "p7",
                        name: "Part 7",
                        title: "Reading Comprehension",
                        description: "Directions: In this part you will read a selection of texts, such as magazine and newspaper articles, e-mails, and instant messages. Each text or set of texts is followed by several questions.",
                        questionCount: 54,
                        type: "reading",
                        groups: [{
                            id: "g_p7_1",
                            passageType: "Email",
                            passageContent: "<b>From:</b> customer_service@shop.com<br><b>To:</b> john.doe@email.com<br><b>Subject:</b> Order #12345<br><br>Dear Mr. Doe,<br>Thank you for your recent order. Unfortunately, the item 'Wireless Mouse' is currently out of stock. We expect a new shipment on May 5th. Would you like to wait or receive a refund?",
                            questions: [{
                                    id: "q147",
                                    text: "Why did the company send the email?",
                                    options: [
                                        "To confirm a delivery",
                                        "To advertise a new product",
                                        "To inform about a delay",
                                        "To request a payment"
                                    ],
                                    correctAnswer: "C"
                                },
                                {
                                    id: "q148",
                                    text: "What is mentioned about the 'Wireless Mouse'?",
                                    options: [
                                        "It is broken.",
                                        "It is not available now.",
                                        "It is on sale.",
                                        "It has been shipped."
                                    ],
                                    correctAnswer: "B"
                                }
                            ]
                        }]
                    }
                ], // Đóng mảng parts
            }, // Đóng object Test 01
            {
                id: 102,
                title: "ETS 2024 - Test 02",
                time: 120,
                totalQuestions: 200,
                status: "completed", // TRẠNG THÁI: COMPLETED
                parts: [{
                        id: "p1",
                        name: "Part 1",
                        title: "Photographs",
                        description: "Directions: For each question in this part, you will hear four statements about a picture in your test book. When you hear the statements, you must select the one statement that best describes what you see in the picture.",
                        questionCount: 6,
                        type: "listening",
                        questions: [{
                                id: "q1",
                                image: "https://example.com/ets-test1-q1.jpg",
                                audio: "https://example.com/audio/q1.mp3",
                                options: [
                                    "He is looking at the monitor.",
                                    "He is cleaning his desk.",
                                    "He is typing on a keyboard.",
                                    "He is walking out of the office."
                                ],
                                correctAnswer: "C"
                            },
                            {
                                id: "q2",
                                image: "https://example.com/ets-test1-q2.jpg",
                                audio: "https://example.com/audio/q2.mp3",
                                options: [
                                    "She is pouring coffee into a cup.",
                                    "She is holding a document.",
                                    "She is talking on the phone.",
                                    "She is drinking from a mug."
                                ],
                                correctAnswer: "D"
                            }
                        ]
                    },

                    // ==============================
                    // PART 2: QUESTION - RESPONSE (25 Câu)
                    // ==============================
                    {
                        id: "p2",
                        name: "Part 2",
                        title: "Question - Response",
                        description: "Directions: You will hear a question or statement and three responses spoken in English. They will not be printed in your test book and will be spoken only one time.",
                        questionCount: 25,
                        type: "listening",
                        questions: [{
                                id: "q7",
                                audio: "https://example.com/audio/q7.mp3",
                                options: [
                                    "In Conference Room B.",
                                    "At two o'clock.",
                                    "It was a long meeting."
                                ],
                                correctAnswer: "B"
                            },
                            {
                                id: "q8",
                                audio: "https://example.com/audio/q8.mp3",
                                options: [
                                    "Mr. Tanaka is.",
                                    "Yes, I did.",
                                    "It costs fifty dollars."
                                ],
                                correctAnswer: "A"
                            }
                        ]
                    },

                    // ==============================
                    // PART 3: CONVERSATIONS (39 Câu)
                    // ==============================
                    {
                        id: "p3",
                        name: "Part 3",
                        title: "Conversations",
                        description: "Directions: You will hear some conversations between two or more people. You will be asked to answer three questions about what the speakers say in each conversation.",
                        questionCount: 39,
                        type: "listening",
                        groups: [{
                            id: "g1",
                            audio: "https://example.com/audio/part3-group1.mp3",
                            script: "M: Hi, I'd like to check out these books.\nW: Sure, do you have your library card?\nM: No, I left it at home. Can I look it up with my phone number?",
                            questions: [{
                                    id: "q32",
                                    text: "Where most likely are the speakers?",
                                    options: [
                                        "At a bookstore",
                                        "At a library",
                                        "At a post office",
                                        "At a bank"
                                    ],
                                    correctAnswer: "B"
                                },
                                {
                                    id: "q33",
                                    text: "What does the man want to do?",
                                    options: [
                                        "Return some items",
                                        "Apply for a job",
                                        "Borrow some books",
                                        "Pay a fine"
                                    ],
                                    correctAnswer: "C"
                                },
                                {
                                    id: "q34",
                                    text: "What problem does the man mention?",
                                    options: [
                                        "He forgot his card.",
                                        "He lost his wallet.",
                                        "The book is damaged.",
                                        "The store is closed."
                                    ],
                                    correctAnswer: "A"
                                }
                            ]
                        }]
                    },

                    // ==============================
                    // PART 5: INCOMPLETE SENTENCES (30 Câu)
                    // ==============================
                    {
                        id: "p5",
                        name: "Part 5",
                        title: "Incomplete Sentences",
                        description: "Directions: A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence.",
                        questionCount: 30,
                        type: "reading",
                        questions: [{
                                id: "q101",
                                text: "Ms. Layla _______ the marketing report before the meeting started yesterday.",
                                options: ["reviews", "reviewed", "reviewing", "will review"],
                                correctAnswer: "B"
                            },
                            {
                                id: "q102",
                                text: "All employees are required to wear their identification badges _______ at all times.",
                                options: ["visual", "visibly", "vision", "visible"],
                                correctAnswer: "B"
                            },
                            {
                                id: "q103",
                                text: "The new software is _______ easier to use than the previous version.",
                                options: ["significance", "significant", "significantly", "signify"],
                                correctAnswer: "C"
                            }
                        ]
                    },

                    // ==============================
                    // PART 6: TEXT COMPLETION (16 Câu)
                    // ==============================
                    {
                        id: "p6",
                        name: "Part 6",
                        title: "Text Completion",
                        description: "Directions: Read the texts that follow. A word, phrase, or sentence is missing in parts of each text. Select the best answer to complete the text.",
                        questionCount: 16,
                        type: "reading",
                        groups: [{
                            id: "g_p6_1",
                            passageTitle: "To: All Staff | From: Management",
                            passageContent: "We are pleased to announce that the office renovation will begin next Monday. Please remove all personal items from your desks by Friday. _______(131)_______, the kitchen will be closed for two weeks.",
                            questions: [{
                                id: "q131",
                                text: "Select the best answer for (131)",
                                options: ["However", "Therefore", "Additionally", "Instead"],
                                correctAnswer: "C"
                            }]
                        }]
                    },

                    // ==============================
                    // PART 7: READING COMPREHENSION (54 Câu)
                    // ==============================
                    {
                        id: "p7",
                        name: "Part 7",
                        title: "Reading Comprehension",
                        description: "Directions: In this part you will read a selection of texts, such as magazine and newspaper articles, e-mails, and instant messages. Each text or set of texts is followed by several questions.",
                        questionCount: 54,
                        type: "reading",
                        groups: [{
                            id: "g_p7_1",
                            passageType: "Email",
                            passageContent: "<b>From:</b> customer_service@shop.com<br><b>To:</b> john.doe@email.com<br><b>Subject:</b> Order #12345<br><br>Dear Mr. Doe,<br>Thank you for your recent order. Unfortunately, the item 'Wireless Mouse' is currently out of stock. We expect a new shipment on May 5th. Would you like to wait or receive a refund?",
                            questions: [{
                                    id: "q147",
                                    text: "Why did the company send the email?",
                                    options: [
                                        "To confirm a delivery",
                                        "To advertise a new product",
                                        "To inform about a delay",
                                        "To request a payment"
                                    ],
                                    correctAnswer: "C"
                                },
                                {
                                    id: "q148",
                                    text: "What is mentioned about the 'Wireless Mouse'?",
                                    options: [
                                        "It is broken.",
                                        "It is not available now.",
                                        "It is on sale.",
                                        "It has been shipped."
                                    ],
                                    correctAnswer: "B"
                                }
                            ]
                        }]
                    }
                ], 
            },
            {
                id: 103,
                title: "ETS 2024 - Test 03",
                time: 120,
                totalQuestions: 200,
                status: "locked", // TRẠNG THÁI: LOCKED
                parts: []
            }
        ] // Đóng mảng tests
    }, // Đóng object id: 1
    {
        id: 2,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/615684832_2637666403275002_6151656838858651882_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFXaSzx4wBnSekofig17CgRKN8eFgMf4roo3x4WAx_iuiacx4KYwCviym3ts93BVHC66WTV2trC5CXiomRhdcrn&_nc_ohc=CsVXNWczSNMQ7kNvwE0vi3d&_nc_oc=AdlcR6Imn-ETbdV5X2H3tooxMCr14Ovg_fENtUigzoXJtYGpwBrXp7yfkkqbB-GCbiY&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=EowHgpP1aRsf7mRUR_4IHg&oh=00_AfoXR_jwFIxG-WQq3h2oUMN7nINLWrIAyn9vbeVknkq4PA&oe=696FD0E9",
        tag: "TOEIC",
        title: "Hacker TOEIC 3",
        description: "Được mệnh danh là bộ đề 'khắc nghiệt' với độ khó cao hơn đề thi thật, giúp bạn rèn luyện tâm lý thép. Lựa chọn hoàn hảo cho các bạn muốn chinh phục mốc điểm 900+.",
        price: 10,
    },
    {
        id: 3,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/615684832_2637666403275002_6151656838858651882_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFXaSzx4wBnSekofig17CgRKN8eFgMf4roo3x4WAx_iuiacx4KYwCviym3ts93BVHC66WTV2trC5CXiomRhdcrn&_nc_ohc=CsVXNWczSNMQ7kNvwE0vi3d&_nc_oc=AdlcR6Imn-ETbdV5X2H3tooxMCr14Ovg_fENtUigzoXJtYGpwBrXp7yfkkqbB-GCbiY&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=EowHgpP1aRsf7mRUR_4IHg&oh=00_AfoXR_jwFIxG-WQq3h2oUMN7nINLWrIAyn9vbeVknkq4PA&oe=696FD0E9",
        tag: "TOEIC",
        title: "YBM TOEIC Vol.3",
        description: "Sở hữu giọng đọc giống đến 99% so với đề thi thật tại IIG, giúp bạn không bị bỡ ngỡ trong phòng thi. Cực kỳ phù hợp để luyện kỹ năng nghe chuyên sâu và tránh các bẫy âm thanh.",
        price: 12,
    },

    // --- IELTS ---
    {
        id: 4,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/616172523_2637666399941669_5416493300576885571_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHk6oraPyrs4bPz_xETbhw2HFw_ZcTDuyQcXD9lxMO7JDDENnvVSA4GWTXYrabmYmliVoDpPlCnLbQNBVP0nJzd&_nc_ohc=be1UKsM2N7YQ7kNvwFB4gWR&_nc_oc=AdlA2yMdxeZFc3Cj4tB0IpSgtoOTwsJSGwwaMcrgiwlciIXWdukYWzr5HkIfGMA7YAc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=yVssFuCGZM_Wl9PM_qMB7g&oh=00_AfpvPwyIp9BmMwQ-pQzWKSw_3KXGp7mvpmYLoVKda4Knmg&oe=696FF482",
        tag: "IELTS",
        title: "Cambridge IELTS 18",
        description: "Tài liệu kinh điển 'gối đầu giường' cho dân IELTS, phản ánh chính xác xu hướng ra đề mới nhất. Giúp bạn đánh giá năng lực thực tế trước khi bước vào kỳ thi chính thức.",
        price: 20,
    },
    {
        id: 5,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/616172523_2637666399941669_5416493300576885571_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHk6oraPyrs4bPz_xETbhw2HFw_ZcTDuyQcXD9lxMO7JDDENnvVSA4GWTXYrabmYmliVoDpPlCnLbQNBVP0nJzd&_nc_ohc=be1UKsM2N7YQ7kNvwFB4gWR&_nc_oc=AdlA2yMdxeZFc3Cj4tB0IpSgtoOTwsJSGwwaMcrgiwlciIXWdukYWzr5HkIfGMA7YAc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=yVssFuCGZM_Wl9PM_qMB7g&oh=00_AfpvPwyIp9BmMwQ-pQzWKSw_3KXGp7mvpmYLoVKda4Knmg&oe=696FF482",
        tag: "IELTS",
        title: "IELTS Trainer 2",
        description: "Cung cấp 6 bài test trọn vẹn kèm theo hướng dẫn giải thích chi tiết và các mẹo làm bài độc quyền từ chuyên gia. Đóng vai trò như huấn luyện viên riêng giúp bạn bứt phá điểm số.",
        price: 18,
    },
    {
        id: 6,
        image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/616172523_2637666399941669_5416493300576885571_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHk6oraPyrs4bPz_xETbhw2HFw_ZcTDuyQcXD9lxMO7JDDENnvVSA4GWTXYrabmYmliVoDpPlCnLbQNBVP0nJzd&_nc_ohc=be1UKsM2N7YQ7kNvwFB4gWR&_nc_oc=AdlA2yMdxeZFc3Cj4tB0IpSgtoOTwsJSGwwaMcrgiwlciIXWdukYWzr5HkIfGMA7YAc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=yVssFuCGZM_Wl9PM_qMB7g&oh=00_AfpvPwyIp9BmMwQ-pQzWKSw_3KXGp7mvpmYLoVKda4Knmg&oe=696FF482",
        tag: "IELTS",
        title: "Mindset for IELTS 3",
        description: "Sự kết hợp hoàn hảo giữa giáo trình học thuật và luyện đề, thiết kế chuyên biệt cho người học hướng tới band điểm cao. Phát triển tư duy ngôn ngữ Academic một cách bài bản.",
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