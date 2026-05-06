import React from 'react';
import { FaClipboardList, FaFileImport, FaUserShield, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const stats = [
        { label: 'Bộ đề TOEIC', value: '12', icon: FaClipboardList, color: 'bg-blue-500' },
        { label: 'Bài thi đã nhập', value: '48', icon: FaFileImport, color: 'bg-emerald-500' },
        { label: 'Học viên', value: '1,240', icon: FaUserShield, color: 'bg-orange-500' },
        { label: 'Lượt thi', value: '8,421', icon: FaChartLine, color: 'bg-indigo-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Hệ thống quản trị</h2>
                <p className="text-sm text-slate-500">Chào mừng bạn trở lại, Admin!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
                        <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Lối tắt quản lý</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/admin/test-sets" className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-center group">
                            <FaClipboardList className="mx-auto text-2xl text-slate-400 group-hover:text-blue-500 mb-2" />
                            <span className="text-sm font-bold text-slate-700">Quản lý bộ đề</span>
                        </Link>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-50 cursor-not-allowed text-center">
                            <FaUserShield className="mx-auto text-2xl text-slate-400 mb-2" />
                            <span className="text-sm font-bold text-slate-700">Người dùng (Coming soon)</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Hệ thống TOEIC</h3>
                        <p className="text-slate-400 text-sm">Hỗ trợ nhập liệu từ Excel và đính kèm phương tiện truyền thông thông minh.</p>
                    </div>
                    <div className="mt-8">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Dung lượng Media</span>
                            <span>65%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[65%]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
