import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * A-01: Tôn trọng 'prefers-reduced-motion'
 * Returns true khi người dùng bật chế độ giảm chuyển động.
 * Khi true, animation nên được tắt hoặc sử dụng instant transition.
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái hiện tại ngay khi mount
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);

    // Lắng nghe thay đổi từ system settings
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );

    return () => subscription.remove();
  }, []);

  return reduceMotion;
}
