// 2. Component hiển thị 1 dòng tính năng
const FeatureItem = ({ icon: Icon, color, label }) => (
  <div className="flex items-center gap-3">
    <Icon className={`${color} text-2xl`} />
    <span className="text-sm font-semibold text-gray-600">{label}</span>
  </div>
);

export default FeatureItem;