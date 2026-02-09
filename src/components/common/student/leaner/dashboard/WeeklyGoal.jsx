import React from 'react';
import { FaGift, FaCheckCircle, FaFire } from 'react-icons/fa';
import Button from '../../../../common/Button';
import ProgressBar from '../../../ProgressBar';

const WeeklyGoal = ({ currentHours, targetHours = 10, isClaimed, onClaim }) => {
    // Tính phần trăm tiến độ
    const isCompleted = currentHours >= targetHours;

    return (
        <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
            {/* Decor Circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        
                {/* Info Section (Giữ nguyên) */}
                <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <FaFire className="text-yellow-300" /> Mục tiêu tuần này
                        </h3>
                        <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-lg">
                            {currentHours.toFixed(1)} / {targetHours} giờ
                        </span>
                    </div>

                    {/* SỬ DỤNG PROGRESS BAR TÁI SỬ DỤNG */}
                    <ProgressBar
                        value={currentHours}
                        max={targetHours}
                        height="h-3"
                        trackColor="bg-black/20 backdrop-blur-sm"
                        fillColor="bg-gradient-to-r from-yellow-300 to-yellow-500"
                        shadowColor="shadow-[0_0_10px_rgba(253,224,71,0.5)]"
                    />

                    <p className="text-xs text-indigo-100 mt-2 italic">
                        {isCompleted
                            ? "Tuyệt vời! Bạn đã hoàn thành mục tiêu tuần này."
                            : `Cố lên! Còn ${(targetHours - currentHours).toFixed(1)} giờ nữa để nhận thưởng.`
                        }
                    </p>
                </div>

                {/* --- 2. PHẦN BUTTON ĐÃ TÁI SỬ DỤNG --- */}
                <div className="shrink-0">
                    {isClaimed ? (
                        // TRẠNG THÁI 1: ĐÃ NHẬN
                        // Dùng !bg-... để ghi đè màu xanh mặc định của Button
                        <Button
                            className="!bg-white/20 !text-white !border-white/10 !cursor-default !shadow-none hover:!translate-y-0 backdrop-blur-md !px-5 !py-2.5"
                            onClick={() => { }} // Không làm gì cả
                        >
                            <FaCheckCircle className="text-green-400" /> Đã nhận
                        </Button>
                    ) : (
                        // TRẠNG THÁI 2: CHƯA NHẬN (Hoàn thành hoặc Chưa hoàn thành)
                        <Button
                            onClick={isCompleted ? onClaim : undefined}
                            // Nếu chưa hoàn thành thì tắt click (vì Button của bạn chưa hỗ trợ prop disabled)
                            className={`
                                relative group !px-6 !py-2.5
                                ${isCompleted
                                    ? '!bg-yellow-400 !text-yellow-900 hover:!bg-yellow-300 !shadow-xl hover:!shadow-yellow-400/40 animate-pulse-slow'
                                    : '!bg-gray-400/50 !text-gray-200 !cursor-not-allowed !shadow-none grayscale hover:!translate-y-0'
                                }
                            `}
                        >
                            <FaGift className={`text-xl ${isCompleted ? 'group-hover:rotate-12 transition-transform' : ''}`} />
                            <span>Nhận 10 Xu</span>

                            {/* Hiệu ứng Ping sáng khi hoàn thành */}
                            {isCompleted && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-100 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-200"></span>
                                </span>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeeklyGoal;