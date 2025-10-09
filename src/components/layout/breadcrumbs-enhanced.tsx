"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Home, ArrowLeft, RefreshCw, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

type Item = { href?: string; label: string };

const LABELS: Record<string, string> = {
  "/": "Home",
  "/simple-habit-tracker": "Simple Habit Tracker",
  "/free-habit-tracker": "Free Habit Tracker",
  "/printable-habit-tracker": "Printable Habit Tracker",
  "/how-to-build-a-habit": "Habit Building Guide",
  "/students": "Student Habit Tracker",
  "/auth": "Authentication",
  "/auth/signin": "Sign In",
  "/auth/error": "Auth Error",
};

// 页面图标映射
const ICONS: Record<string, string> = {
  "/": "🏠",
  "/simple-habit-tracker": "⚡",
  "/free-habit-tracker": "🎯",
  "/printable-habit-tracker": "🖨️",
  "/how-to-build-a-habit": "📚",
  "/students": "🎓",
  "/auth": "🔐",
  "/auth/signin": "👤",
  "/auth/error": "⚠️",
};

// 页面描述
const DESCRIPTIONS: Record<string, string> = {
  "/simple-habit-tracker": "The most minimal habit tracker - zero friction, 100% focus",
  "/free-habit-tracker": "Start tracking instantly with no signup required",
  "/printable-habit-tracker": "Download and print your habit tracking templates",
  "/how-to-build-a-habit": "Science-backed guide to building lasting habits",
  "/students": "Habit tracking designed specifically for student life",
};

function toLabel(path: string) {
  if (LABELS[path]) return LABELS[path];
  const seg = path.split("/").filter(Boolean).pop() || "";
  if (!seg) return "";
  return seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
}

function getIcon(path: string) {
  return ICONS[path] || "📄";
}

export function EnhancedBreadcrumbs({
  className,
  separator = "chevron",
  hideHome = false,
  showDescriptions = true,
  maxItems = 5,
  showBackButton = true,
  showRefresh = true,
  showExternalLinks = true,
}: {
  className?: string;
  separator?: "slash" | "chevron" | "arrow" | "dot";
  hideHome?: boolean;
  showDescriptions?: boolean;
  maxItems?: number;
  showBackButton?: boolean;
  showRefresh?: boolean;
  showExternalLinks?: boolean;
}) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [breadcrumbsHistory, setBreadcrumbsHistory] = useState<string[]>([]);

  // 记录浏览历史
  useEffect(() => {
    setBreadcrumbsHistory(prev => {
      if (prev[prev.length - 1] === pathname) return prev;
      return [...prev.slice(-4), pathname];
    });
  }, [pathname]);

  const parts = pathname.split("/").filter(Boolean);
  const paths: Item[] = [];
  let acc = "";
  for (let i = 0; i < parts.length; i++) {
    acc += "/" + parts[i];
    paths.push({ href: acc, label: toLabel(acc) });
  }
  if (!parts.length) paths.push({ href: "/", label: LABELS["/"] });
  const items = hideHome ? paths.filter(p => p.href !== "/") : paths;

  // 如果项目太多，显示省略号
  const displayItems = items.length > maxItems ? [
    items[0],
    { href: undefined, label: "..." },
    ...items.slice(-maxItems + 2)
  ] : items;

  const SeparatorIcon = () => {
    switch (separator) {
      case "chevron":
        return <ChevronRight className="w-4 h-4 text-gray-400" />;
      case "arrow":
        return <span className="text-gray-400">→</span>;
      case "dot":
        return <span className="text-gray-400 text-xs">•</span>;
      default:
        return <span className="mx-2 select-none text-gray-400">/</span>;
    }
  };

  const currentDescription = DESCRIPTIONS[pathname] || "";

  const handleGoBack = () => {
    if (breadcrumbsHistory.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleQuickJump = (href: string) => {
    router.push(href);
  };

  // 快速访问菜单
  const quickLinks = [
    { href: "/simple-habit-tracker", label: "Simple Tracker", icon: "⚡" },
    { href: "/free-habit-tracker", label: "Free Tracker", icon: "🎯" },
    { href: "/printable-habit-tracker", label: "Printable", icon: "🖨️" },
    { href: "/how-to-build-a-habit", label: "Guide", icon: "📚" },
  ].filter(link => link.href !== pathname);

  return (
    <div className={`w-full ${className}`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="返回上一页"
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </button>
          )}

          {showRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
              title="刷新页面"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              刷新
            </button>
          )}
        </div>

        {showExternalLinks && quickLinks.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">快速访问:</span>
            {quickLinks.slice(0, 3).map((link) => (
              <button
                key={link.href}
                onClick={() => handleQuickJump(link.href)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title={link.label}
              >
                <span>{link.icon}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 面包屑导航 */}
      <nav aria-label="Breadcrumb" className="mb-2">
        <ol className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 flex-wrap">
          {(displayItems.length ? displayItems : [{ href: "/", label: LABELS["/"] }]).map((item, idx, arr) => {
            const isLast = idx === arr.length - 1;
            const isEllipsis = item.label === "...";

            const content = (
              <span className={`${
                isLast
                  ? "font-semibold text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              } ${isEllipsis ? "px-1" : ""}`}>
                {idx === 0 && item.href === "/" ? (
                  <span className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    {item.label}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    {getIcon(item.href || "")}
                    {item.label || toLabel(item.href || "/")}
                  </span>
                )}
              </span>
            );

            return (
              <li key={(item.href || "") + idx} className="flex items-center">
                {isLast || !item.href || isEllipsis ? (
                  <span className="flex items-center">
                    {content}
                    {isLast && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                        (当前页面)
                      </span>
                    )}
                  </span>
                ) : (
                  <Link href={item.href} className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded-md transition-colors">
                    {content}
                  </Link>
                )}
                {!isLast && (
                  <span className="mx-1 flex items-center">
                    <SeparatorIcon />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {showDescriptions && currentDescription && (
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700">
          <span className="font-medium">当前页面:</span> {currentDescription}
        </div>
      )}
    </div>
  );
}

// 简化版面包屑组件（用于不需要完整功能的页面）
export function SimpleBreadcrumbs(props: Omit<Parameters<typeof EnhancedBreadcrumbs>[0], 'showBackButton' | 'showRefresh' | 'showExternalLinks'>) {
  return <EnhancedBreadcrumbs {...props} showBackButton={false} showRefresh={false} showExternalLinks={false} />;
}

// 默认导出增强版
export default EnhancedBreadcrumbs;