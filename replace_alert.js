import fs from 'fs';
import path from 'path';

const files = [
  'src/components/common/teacher/AddTestModal.jsx',
  'src/components/common/teacher/AddTestSetModal.jsx',
  'src/components/common/teacher/LessonList.jsx',
  'src/components/common/teacher/TestQuestionManager.jsx',
  'src/components/common/teacher/TestSetDetailModal.jsx',
  'src/components/sections/student/guest/consulationPage/ConsultationSection.jsx',
  'src/page/admin/ConsultationManagement.jsx',
  'src/page/auth/ForgotPasswordPage.jsx',
  'src/page/auth/VerifyOtpPage.jsx',
  'src/page/student/guest/CoinShopPage.jsx',
  'src/page/student/guest/ProfilePage.jsx',
  'src/page/teacher/BlogEditorPage.jsx',
  'src/page/teacher/CoinPackageManagement.jsx',
  'src/page/teacher/CourseEditorPage.jsx',
  'src/page/teacher/CourseManagementPage.jsx',
  'src/page/teacher/TeacherBlogPage.jsx'
];

files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    let hasChanges = false;

    // Add import if needed
    if (!content.includes("import { toast }")) {
        // Find last import statement
        const importRegex = /^import\s+.*?;?\s*$/gm;
        let lastMatch;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            lastMatch = match;
        }

        if (lastMatch) {
            const insertIndex = lastMatch.index + lastMatch[0].length;
            content = content.slice(0, insertIndex) + "\nimport { toast } from 'react-toastify';" + content.slice(insertIndex);
            hasChanges = true;
        } else {
            content = "import { toast } from 'react-toastify';\n" + content;
            hasChanges = true;
        }
    }

    // Replace alerts
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('alert(')) {
            const lowerLine = lines[i].toLowerCase();
            let type = 'info';
            
            if (lowerLine.includes('lỗi') || lowerLine.includes('failed') || lowerLine.includes('thất bại') || lowerLine.includes('không thể') || lowerLine.includes('không tìm thấy') || lowerLine.includes('error.')) {
                type = 'error';
            } else if (lowerLine.includes('thành công') || lowerLine.includes('đã') || lowerLine.includes('isediting ?')) {
                type = 'success';
            } else if (lowerLine.includes('vui lòng') || lowerLine.includes('chỉ được')) {
                type = 'warning';
            }

            lines[i] = lines[i].replace(/alert\(/g, `toast.${type}(`);
            hasChanges = true;
        }
    }

    if (hasChanges) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
        console.log(`Updated ${file}`);
    }
});
