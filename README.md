## Hướng dẫn cài đặt

**Yêu cầu:** Node.js >= 18.x, npm >= 9

```bash
# Clone repo
git clone git@github.com:MinhTan2606/zim-memorable-moments.git
cd zim-memorable-moments

# Cài dependencies
npm install
```

---

## Hướng dẫn chạy ứng dụng

```bash
# Khởi chạy Expo dev server
npx expo start

# Sau đó chọn:
# - Nhấn 'a' để mở Android Emulator
# - Nhấn 'i' để mở iOS Simulator (macOS)
# - Quét QR bằng Expo Go app trên thiết bị thật
```

> **Nhanh nhất:** Cài [Expo Go](https://expo.dev/go) trên điện thoại → quét QR code.

---

## Hướng dẫn build

### Android APK (Preview)

```bash
# Cài EAS CLI
npm install -g eas-cli

# Đăng nhập Expo account
eas login

# Build APK
eas build --platform android --profile preview
```

### Hoặc dùng Expo Snack

Mở project trên [snack.expo.dev](https://snack.expo.dev) để demo online không cần cài đặt.

---

## Mô tả giải pháp

### Kiến trúc component

```
App.tsx
└── MomentSection          — wrapper + header + FlatList + dot indicators
    └── MomentCard (×5)    — card từng khoảnh khắc với animations
        ├── RevealOverlay  — gradient reveal + caption + CTA
        └── ViewMoreButton  — micro-interaction spring button
```

### Quyết định kỹ thuật

#### 1. React Native Reanimated v3

Worklets chạy trực tiếp trên **UI thread** — đảm bảo 60fps ngay cả khi JS thread bận. Tất cả animations (`translateY`, `scale`, `opacity`) đều pass `useNativeDriver: true` ngầm qua Reanimated.

#### 2. Chỉ dùng `transform` + `opacity`

Không có bất kỳ animation nào thay đổi `top`, `left`, `width`, `height` — tránh layout recalculation và giữ 60fps.

#### 3. Tap state machine

- **Press lần 1:** hiển thị RevealOverlay với caption đầy đủ + CTA
- **Press lần 2:** navigate/thực thi action
- Announce qua `AccessibilityInfo.announceForAccessibility` để screen reader đọc hướng dẫn

#### 4. Reduced Motion

Hook `useReduceMotion()` wrap `AccessibilityInfo.isReduceMotionEnabled()` + event listener. Khi bật: tất cả `duration` set về `0` — transition instant, không loại bỏ state changes.

#### 5. Advanced Options triển khai

- **Reveal Overlay:** Gradient overlay + caption slide-up + CTA fade-in với delay 100ms/200ms, easing `bezier(0.25, 0.46, 0.45, 0.94)`
- **Micro-interaction:** ViewMoreButton với spring sequence `0.94 → 1.06 → 1.0` khi press

#### 6. Responsive

`useOrientation()` hook dùng `useWindowDimensions()`:

- **Portrait:** 1 card chiếm full width - padding
- **Landscape:** 2 cards hiển thị cùng lúc (52% mỗi card)
