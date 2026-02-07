import StatsGrid from '../../components/common/teacher/StatsGrid';
import RevenueChart from '../../components/common/teacher/RevenueChart';
import RevenueTable from '../../components/common/teacher/RevenueTable';
import { courses } from '../../data/mockData';
import { FaDollarSign, FaUserGraduate, FaChartLine } from 'react-icons/fa';

const RevenuePage = () => {
    const stats = [
        { label: 'Tổng doanh thu', value: '150.000.000đ', change: '+12.5%', icon: FaDollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Học viên mới (Tháng này)', value: '128', change: '+8.2%', icon: FaUserGraduate, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Doanh thu trung bình/Học viên', value: '1.200.000đ', change: '-2.1%', icon: FaChartLine, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Quản lý doanh thu</h1>

            <StatsGrid stats={stats} columns={3} />

            <RevenueChart />

            <RevenueTable courses={courses} />
        </div>
    );
};

export default RevenuePage;
