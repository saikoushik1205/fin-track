// Performance utilities for FinTrack

// Debounce utility for performance
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Check device type
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Check if device is low-end
export const isLowEndDevice = (): boolean => {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;

  // Check memory (if available)
  const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4;

  return cores <= 2 || memory <= 2;
};

// Optimize animations based on device
export const getAnimationConfig = () => {
  if (prefersReducedMotion()) {
    return {
      duration: 0.01,
      ease: "linear" as const,
    };
  }

  if (isLowEndDevice() || isMobile()) {
    return {
      duration: 0.3,
      ease: "easeOut" as const,
    };
  }

  return {
    duration: 0.5,
    ease: "easeInOut" as const,
  };
};
