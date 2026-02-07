import { useState } from 'react';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';
import StudentTable from '../../components/common/teacher/StudentTable';
import { courses } from '../../data/mockData';
import { FaSearch, FaLayerGroup } from 'react-icons/fa';

const StudentManagementPage = () => {
    // Mock Students Data
    const mockStudents = [
        { id: 1, name: 'Nguyễn Văn A', email: 'vana@gmail.com', avatar: 'https://i.pravatar.cc/150?img=1', courseName: 'TOEIC Basic 450+', courseId: 1, progress: 45, joinDate: '20/01/2025' },
        { id: 2, name: 'Trần Thị B', email: 'thib@gmail.com', avatar: 'https://i.pravatar.cc/150?img=5', courseName: 'TOEIC Advanced 800+', courseId: 2, progress: 10, joinDate: '22/01/2025' },
        { id: 3, name: 'Lê C', email: 'lec@gmail.com', avatar: 'https://i.pravatar.cc/150?img=3', courseName: 'TOEIC Basic 450+', courseId: 1, progress: 90, joinDate: '15/01/2025' },
        { id: 4, name: 'Phạm D', email: 'phamd@gmail.com', avatar: 'https://i.pravatar.cc/150?img=8', courseName: 'IELTS Foundation', courseId: 6, progress: 100, joinDate: '10/01/2025' },
        { id: 5, name: 'Hoàng E', email: 'hoange@gmail.com', avatar: 'https://i.pravatar.cc/150?img=12', courseName: 'TOEIC Basic 450+', courseId: 1, progress: 0, joinDate: '25/01/2025' },
    ];

    const [selectedCourse, setSelectedCourse] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = mockStudents.filter(student => {
        const matchesCourse = selectedCourse === 'ALL' || student.courseId === parseInt(selectedCourse);
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCourse && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quản lý học viên</h1>
                    <p className="text-slate-500 text-sm">Theo dõi tiến độ học tập của học viên</p>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    <InputField
                        label="Tìm kiếm"
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
                            ...courses.map(c => ({ value: c.id, label: c.title }))
                        ]}
                    />
                </div>
            </div>

            <StudentTable students={filteredStudents} />
        </div>
    );
};

export default StudentManagementPage;
