'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

// 页面标签映射
const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/simple-habit-tracker": "Simple Habit Tracker",
  "/free-habit-tracker": "Free Habit Tracker",
  "/printable-habit-tracker": "Printable Habit Tracker",
  "/how-to-build-a-habit": "How to Build a Habit",
  "/students": "Students",
  "/auth": "Sign In",
  "/auth/signin": "Sign In",
  "/auth/error": "Sign In Error",
};

// 页面分组映射（用于SEO分类）
const PAGE_GROUPS: Record<string, string> = {
  "/simple-habit-tracker": "Tools",
  "/free-habit-tracker": "Tools",
  "/printable-habit-tracker": "Tools",
  "/how-to-build-a-habit": "Guides",
  "/students": "Students",
};

function toLabel(path: string): string {
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];

  const segments = path.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment) return "";

  return lastSegment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function UnifiedBreadcrumbs({
  className = "",
  customSeparator = ">",
  showHomeIcon = true,
  showCurrentPage = true,
  maxItems = 6,
}: {
  className?: string;
  customSeparator?: string;
  showHomeIcon?: boolean;
  showCurrentPage?: boolean;
  maxItems?: number;
}) {
  const pathname = usePathname() || "/";

  // 构建面包屑路径
  const buildBreadcrumbs = () => {
    if (pathname === "/") {
      return [{ href: "/", label: PAGE_LABELS["/"] || "Home", isCurrent: true }];
    }

    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];
    let currentPath = "";

    // 首页
    breadcrumbs.push({
      href: "/",
      label: PAGE_LABELS["/"] || "Home",
      isCurrent: false,
    });

    // 添加分组（如果存在）
    const currentGroup = PAGE_GROUPS[pathname];
    if (currentGroup && segments.length > 1) {
      breadcrumbs.push({
        href: "#",
        label: currentGroup,
        isCurrent: false,
        isGroup: true,
      });
    }

    // 添加具体页面
    for (let i = 0; i < segments.length; i++) {
      currentPath += "/" + segments[i];
      const isLast = i === segments.length - 1;

      breadcrumbs.push({
        href: currentPath,
        label: toLabel(currentPath),
        isCurrent: isLast,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();
  const displayItems = breadcrumbs.length > maxItems
    ? [...breadcrumbs.slice(0, 2), { href: "#", label: "...", isCurrent: false, isEllipsis: true }, ...breadcrumbs.slice(-2)]
    : breadcrumbs;

  return (
    <nav className={`unified-breadcrumbs ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = (item as any).isEllipsis;

          return (
            <li key={item.href + index} className="breadcrumb-item">
              {isEllipsis ? (
                <span className="breadcrumb-ellipsis">{item.label}</span>
              ) : item.isCurrent && !showCurrentPage ? (
                <span className="breadcrumb-current">{item.label}</span>
              ) : item.isCurrent ? (
                <span className="breadcrumb-current-page">{item.label}</span>
              ) : item.href === "#" || !item.href ? (
                <span className="breadcrumb-group">{item.label}</span>
              ) : (
                <Link href={item.href} className="breadcrumb-link">{item.label}</Link>
              )}

              {!isLast && (
                <span className="breadcrumb-separator">{customSeparator}</span>
              )}
            </li>
          );
        })}
      </ol>

      {showCurrentPage && breadcrumbs[breadcrumbs.length - 1]?.isCurrent && (
        <div className="breadcrumb-current-info">
          <span className="current-label">Current page: {breadcrumbs[breadcrumbs.length - 1].label}</span>
        </div>
      )}
    </nav>
  );
}

// 导出默认组件
export default UnifiedBreadcrumbs;