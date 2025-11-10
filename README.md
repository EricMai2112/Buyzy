HƯỚNG DẪN CÀI ĐẶT VÀ TRIỂN KHAI HỆ THỐNG

Tài liệu này cung cấp các bước chi tiết để cài đặt môi trường phát triển cục bộ và triển khai ứng dụng lên môi trường Production (Railway cho Backend và EAS cho Mobile).

I. YÊU CẦU PHẦN CỨNG & PHẦN MỀM

Hệ điều hành: Windows 10/11, macOS
Node.js: Phiên bản 20.x (hoặc mới hơn)
Yarn/npm: Trình quản lý gói
MongoDB: MongoDB Atlas
IDE: Visual Code
Công cụ CLI: Expo CLI, EAS CLI

II. CÀI ĐẶT MÔI TRƯỜNG PHÁT TRIỂN CỤC BỘ

1. Chuẩn bị Code
Clone Repository về máy tính của bạn:
git clone: [ [URL_GITHUB_REPO]](https://github.com/EricMai2112/Buyzy)
Di chuyển vào thư mục chính và Backend: cd Buyzy
2. Cài đặt Dependencies
Frontend (React Native/Expo):
Trong thư mục Buyzy (FrontEnd), chạy lệnh:
npm install 
Backend (Express/Node.js):
Trong thư mục Backend, chạy lệnh:
npm install 
3. Khởi động Local Server và App
A. Khởi động Backend (Development Mode):
Trong thư mục Backend, chạy lệnh:
npm run dev
# Lệnh này sử dụng ts-node-dev để tự động khởi động lại server khi code thay đổi.
Server sẽ chạy trên cổng 5000 (hoặc cổng được chỉ định).
B. Khởi động Frontend App:
Trong thư mục Buyzy, chạy lệnh:
npx expo start
Sử dụng ứng dụng Expo Go trên điện thoại để quét mã QR và chạy ứng dụng.
Hoặc npx expo start --web để có thể chạy trên web nhưng phải đổi sang hiển thị điện thoại (Pixel 7)

III. HƯỚNG DẪN TRIỂN KHAI LÊN PRODUCTION

Việc triển khai được chia thành hai luồng chính: Backend (API) và Frontend (Mobile Build).
1. Triển khai Backend API (Sử dụng Railway)
Cập nhật Biến Môi trường:
Sử dụng MongoDB Atlas Production và Railway.
Trong Dashboard Railway (Variables Tab), đặt biến: MONGO_URI (Giá trị là chuỗi kết nối Atlas Production).
Khởi động Deployment:
Railway sẽ tự động thực hiện quá trình CI/CD: Chạy npm run build (TSC), sau đó chạy npm start (node dist/app.js).
Lấy URL Public:
Sau khi triển khai thành công, lấy địa chỉ Public Domain (ví dụ: https://buyzy-production.up.railway.app).
2. Đồng bộ URL API Frontend
BƯỚC QUAN TRỌNG: Sửa tất cả các file API Client trong Frontend để gọi URL Public của Railway.
3. Triển khai Frontend Mobile (EAS Build)
Quá trình này tạo ra file cài đặt .apk để phân phối nội bộ cho nhóm.
Cài đặt Công cụ: Đảm bảo bạn đã cài eas-cli và eas login.
Chạy Build Production (Android APK):
Chạy lệnh trong thư mục Frontend:
eas build --platform android --profile production
