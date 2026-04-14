import { useState, useEffect } from 'react';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';
import StudentTable from '../../components/common/teacher/StudentTable';
import { FaSearch, FaLayerGroup, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import userApi from '../../api/userApi';
import { toast } from 'react-hot-toast';

const StudentManagementPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        fetchStudents(currentPage);
    }, [currentPage]);

    const fetchStudents = async (page) => {
        setLoading(true);
        try {
            // Spring Web Pageable: 0-indexed cho frontend request
            const response = await userApi.getStudentStatisticsApi({ page: page - 1, size: 10 });
            const pageData = response.data; // ApiResponse<PageResponse>
            
            if (pageData) {
                setStudents(pageData.content || []);
                setCurrentPage(pageData.currentPage || 1);
                setTotalPages(pageData.totalPages || 0);
                setTotalElements(pageData.totalElements || 0);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu học viên:', error);
            toast.error('Có lỗi xảy ra khi tải dữ liệu học viên');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Lấy danh sách khóa học duy nhất từ danh sách học viên hiện tại
    const courses = Array.from(new Set(students.map(s => s.courseId)))
        .map(id => {
            const student = students.find(s => s.courseId === id);
            return { id: student.courseId, title: student.courseName };
        });

    const filteredStudents = students.filter(student => {
        const matchesCourse = selectedCourse === 'ALL' || student.courseId === parseInt(selectedCourse);
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCourse && matchesSearch;
    });

    if (loading && students.length === 0) {
        return <div className="flex justify-center items-center h-64 text-slate-500 font-medium">Đang tải dữ liệu học viên...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quản lý học viên</h1>
                    <p className="text-slate-500 text-sm">Theo dõi tiến độ học tập (Tổng: {totalElements} học viên)</p>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    <InputField
                        label="Tìm kiếm trang hiện tại"
                        name="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm học viên theo tên, email..."
                        icon={FaSearch}
                    />
                </div>

                <div className="w-full md:w-auto md:min-w-[250px]">
                    <SelectField
                        label="Lọc khóa học (trang hiện tại)"
                        name="courseFilter"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        icon={FaLayerGroup}
                        options={[
                            { value: 'ALL', label: 'Tất cả' },
                            ...courses.map(c => ({ value: c.id, label: c.title }))
                        ]}
                    />
                </div>
            </div>

            <div className={loading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
                <StudentTable students={filteredStudents} />
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                            currentPage === 1 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm border border-slate-200'
                        }`}
                    >
                        <FaChevronLeft className="text-sm" />
                    </button>
                    
                    <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
                                    currentPage === page
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                            currentPage === totalPages 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm border border-slate-200'
                        }`}
                    >
                        <FaChevronRight className="text-sm" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentManagementPage;
