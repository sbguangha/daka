/**
 * 浏览器兼容性检测工具
 */

export interface BrowserSupport {
  cssVariables: boolean;
  localStorage: boolean;
  matchMedia: boolean;
  classList: boolean;
  requestAnimationFrame: boolean;
}

/**
 * 检测浏览器对主题切换功能的支持情况
 */
export function detectBrowserSupport(): BrowserSupport {
  const support: BrowserSupport = {
    cssVariables: false,
    localStorage: false,
    matchMedia: false,
    classList: false,
    requestAnimationFrame: false,
  };

  // 检测 CSS 变量支持
  try {
    if (typeof window !== 'undefined' && window.CSS && window.CSS.supports) {
      support.cssVariables = window.CSS.supports('color', 'var(--test)');
    }
  } catch (e) {
    support.cssVariables = false;
  }

  // 检测 localStorage 支持
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__theme_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      support.localStorage = true;
    }
  } catch (e) {
    support.localStorage = false;
  }

  // 检测 matchMedia 支持
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      support.matchMedia = typeof window.matchMedia('(prefers-color-scheme: dark)').matches === 'boolean';
    }
  } catch (e) {
    support.matchMedia = false;
  }

  // 检测 classList 支持
  try {
    if (typeof document !== 'undefined' && document.documentElement && document.documentElement.classList) {
      support.classList = true;
    }
  } catch (e) {
    support.classList = false;
  }

  // 检测 requestAnimationFrame 支持
  try {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      support.requestAnimationFrame = true;
    }
  } catch (e) {
    support.requestAnimationFrame = false;
  }

  return support;
}

/**
 * 获取浏览器信息
 */
export function getBrowserInfo() {
  if (typeof navigator === 'undefined') {
    return {
      name: 'Unknown',
      version: 'Unknown',
      userAgent: 'Unknown',
    };
  }

  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';

  // Chrome
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    name = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
  // Firefox
  else if (userAgent.includes('Firefox')) {
    name = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    if (match) version = match[1];
  }
  // Safari
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    if (match) version = match[1];
  }
  // Edge
  else if (userAgent.includes('Edg')) {
    name = 'Edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    if (match) version = match[1];
  }

  return {
    name,
    version,
    userAgent,
  };
}

/**
 * 检查是否为移动设备
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 检查是否支持触摸
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 获取完整的兼容性报告
 */
export function getCompatibilityReport() {
  const support = detectBrowserSupport();
  const browser = getBrowserInfo();
  const isMobile = isMobileDevice();
  const isTouch = isTouchDevice();

  const issues: string[] = [];
  const warnings: string[] = [];

  // 检查关键功能支持
  if (!support.cssVariables) {
    issues.push('CSS Variables not supported - theme colors may not work correctly');
  }

  if (!support.localStorage) {
    warnings.push('localStorage not available - theme preferences will not persist');
  }

  if (!support.matchMedia) {
    warnings.push('matchMedia not supported - system theme detection unavailable');
  }

  if (!support.classList) {
    issues.push('classList not supported - theme switching may fail');
  }

  if (!support.requestAnimationFrame) {
    warnings.push('requestAnimationFrame not supported - animations may be choppy');
  }

  // 浏览器特定检查
  if (browser.name === 'Safari' && parseInt(browser.version) < 14) {
    warnings.push('Safari version may have limited CSS variable support');
  }

  if (browser.name === 'Firefox' && parseInt(browser.version) < 85) {
    warnings.push('Firefox version may have limited theme support');
  }

  return {
    browser,
    support,
    isMobile,
    isTouch,
    issues,
    warnings,
    isFullySupported: issues.length === 0,
    hasWarnings: warnings.length > 0,
  };
}

/**
 * 应用兼容性修复
 */
export function applyCompatibilityFixes() {
  const support = detectBrowserSupport();

  // CSS 变量降级
  if (!support.cssVariables) {
    console.warn('CSS Variables not supported, applying fallback styles');
    // 这里可以添加降级样式的逻辑
  }

  // localStorage 降级
  if (!support.localStorage) {
    console.warn('localStorage not available, theme preferences will not persist');
    // 可以使用 cookie 或内存存储作为降级方案
  }

  // matchMedia 降级
  if (!support.matchMedia) {
    console.warn('matchMedia not supported, system theme detection disabled');
    // 可以提供手动主题选择作为降级方案
  }
}

/**
 * 记录兼容性信息到控制台
 */
export function logCompatibilityInfo() {
  const report = getCompatibilityReport();
  
  console.group('🎨 Theme Toggle Compatibility Report');
  console.log('Browser:', `${report.browser.name} ${report.browser.version}`);
  console.log('Mobile Device:', report.isMobile);
  console.log('Touch Device:', report.isTouch);
  console.log('Support:', report.support);
  
  if (report.issues.length > 0) {
    console.group('❌ Critical Issues');
    report.issues.forEach(issue => console.error(issue));
    console.groupEnd();
  }
  
  if (report.warnings.length > 0) {
    console.group('⚠️ Warnings');
    report.warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }
  
  if (report.isFullySupported && !report.hasWarnings) {
    console.log('✅ All features fully supported!');
  }
  
  console.groupEnd();
}