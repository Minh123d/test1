# Trang Web Chúc Mừng Ngày 1/6

Đây là trang web chúc mừng ngày Quốc tế Thiếu nhi 1/6 với hiệu ứng chuyển động 3D đẹp mắt và các hiệu ứng ánh sáng đặc biệt.

## Tính năng

- Hiệu ứng 3D tương tác với trái tim, ngôi sao và hạt lấp lánh
- Vệt sáng chuyển động lung linh trên nền
- Các ngôi sao lấp lánh với vệt sáng chuyển động
- Hiệu ứng phát sáng (bloom) cho các đối tượng
- Hiển thị hình ảnh 3D có thể tùy chỉnh
- Theo dõi con trỏ chuột để điều khiển góc nhìn
- Thiết kế phản hồi, tương thích với nhiều kích thước màn hình
- Hiệu ứng animation mượt mà với chuyển động lơ lửng

## Cách sử dụng

1. Mở file `index.html` trong trình duyệt web
2. Di chuyển chuột để thay đổi góc nhìn
3. Tận hưởng trải nghiệm 3D tuyệt đẹp!

## Tùy chỉnh

### Tùy chỉnh nội dung
Bạn có thể dễ dàng tùy chỉnh tin nhắn bằng cách chỉnh sửa file `index.html`:

```html
<h1 class="title">Chúc Mừng Ngày 1/6</h1>
<p class="message">Chúc người yêu của anh có một ngày Quốc tế Thiếu nhi thật vui vẻ và hạnh phúc!</p>
<p class="love">Yêu em thật nhiều ❤️</p>
```

### Tùy chỉnh hình ảnh
Để thay đổi hình ảnh hiển thị, chỉnh sửa liên kết URL trong file `script.js`:

```javascript
// Thêm hình ảnh - thay thế URL với các hình ảnh thực tế của bạn
const photoPlanes = [
    createPhotoPlane('https://picsum.photos/300/400', 5, 7, -25, 10, -15),
    createPhotoPlane('https://picsum.photos/400/300', 7, 5, 25, -5, -10),
    createPhotoPlane('https://picsum.photos/300/300', 6, 6, 0, 15, -20)
];
```

## Công nghệ sử dụng

- HTML5
- CSS3
- JavaScript
- Three.js (thư viện đồ họa 3D)
- Bloom và Post-processing effects 