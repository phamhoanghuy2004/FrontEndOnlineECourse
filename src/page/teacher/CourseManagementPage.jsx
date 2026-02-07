import { useState } from 'react';
import { courses as mockCourses } from '../../data/mockData';
import CourseTable from '../../components/common/teacher/CourseTable';
import FilterBar from '../../components/common/FilterBar';
import InputField from '../../components/common/InputField';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CourseManagementPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState(mockCourses);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('ALL');
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);

    const handleDelete = (id) => {
        setCourses(courses.filter(course => course.id !== id));
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = filterLevel === 'ALL' || course.level === filterLevel;
        return matchesSearch && matchesLevel;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quản lý khóa học</h1>
                    <p className="text-slate-500 text-sm">Quản lý danh sách khóa học và bài giảng của bạn</p>
                </div>
                <Button onClick={() => navigate('/teacher/courses/new')}>
                    <FaPlus /> Tạo khóa học mới
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                <FilterBar
                    filters={['ALL', 'BASIC', 'MEDIUM', 'ADVANCE']}
                    activeFilter={filterLevel}
                    onFilterChange={setFilterLevel}
                    onToggleAdvanced={() => setIsAdvancedOpen(!isAdvancedOpen)}
                    isAdvancedOpen={isAdvancedOpen}
                />

                <AnimatePresence>
                    {isAdvancedOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="w-full md:w-1/2 lg:w-1/3">
                                    <InputField
                                        label="Tìm kiếm khóa học"
                                        name="search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Nhập tên khóa học..."
                                        icon={FaSearch}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Course Table */}
            <CourseTable courses={filteredCourses} onDelete={handleDelete} />

        </div>
    );
};

export default CourseManagementPage;
