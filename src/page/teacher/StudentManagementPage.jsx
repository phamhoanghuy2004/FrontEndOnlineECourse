import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';
import StudentTable from '../../components/common/teacher/StudentTable';
import { FaSearch, FaLayerGroup } from 'react-icons/fa';
import userApi from '../../api/userApi';
import chatApi from '../../api/chatApi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../context/ChatContext';

const StudentManagementPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const { user: currentUser } = useAuth();
    const { setActiveConversation } = useChat();

    // Fetch students data
    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await userApi.getStudentStatisticsApi();
            setStudents(response.data || []);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu học viên:', error);
            toast.error('Có lỗi xảy ra khi tải dữ liệu học viên');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleOpenChat = async (studentId) => {
        try {
            const response = await chatApi.createOrGetConversation(currentUser.id, studentId);
            setActiveConversation(response.data);
            navigate('/teacher/chat');
        } catch (error) {
            console.error('Lỗi khi mở cuộc trò chuyện:', error);
            toast.error('Không thể mở chat với học viên này');
        }
    };

    // Lấy danh sách khóa học duy nhất
    const courses = Array.from(new Set(students.map(s => s.courseId)))
        .map(id => {
            const student = students.find(s => s.courseId === id);
            return { id: student.courseId, title: student.courseName };
        });

    // Filter phía client
    const filteredStudents = students.filter(student => {
        const matchesCourse =
            selectedCourse === 'ALL' || student.courseId === parseInt(selectedCourse);

        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCourse && matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Quản lý học viên
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Theo dõi tiến độ học tập (Tổng: {filteredStudents.length} học viên)
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    <InputField
                        label="Tìm kiếm học viên"
                        name="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm học viên theo tên, email..."
                        icon={FaSearch}
                    />
                </div>

                <div className="w-full md:w-auto md:min-w-[250px]">
                    <SelectField
                        label="Lọc theo khóa học"
                        name="courseFilter"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        icon={FaLayerGroup}
                        options={[
                            { value: 'ALL', label: 'Tất cả khóa học' },
                            ...courses.map(c => ({
                                value: c.id,
                                label: c.title
                            }))
                        ]}
                    />
                </div>
            </div>

            {/* Table */}
            {students.length === 0 && loading ? (
                <div className="flex justify-center items-center h-64 text-slate-500 font-medium">
                    Đang tải dữ liệu học viên...
                </div>
            ) : (
                <div
                    className={
                        loading
                            ? 'opacity-50 pointer-events-none transition-opacity'
                            : 'transition-opacity'
                    }
                >
                    <StudentTable 
                        students={filteredStudents} 
                        onChatClick={(studentId) => handleOpenChat(studentId)}
                    />
                </div>
            )}
        </div>
    );
};

export default StudentManagementPage;