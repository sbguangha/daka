"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href?: string; label: string };

const LABELS: Record<string, string> = {
  "/": "Home",
  "/simple-habit-tracker": "Simple",
  "/free-habit-tracker": "Free",
  "/printable-habit-tracker": "Printable",
  "/how-to-build-a-habit": "Guide",
  "/students": "Students",
  "/auth": "Auth",
  "/auth/signin": "Sign In",
  "/auth/error": "Auth Error",
};

function toLabel(path: string) {
  if (LABELS[path]) return LABELS[path];
  const seg = path.split("/").filter(Boolean).pop() || "";
  if (!seg) return "";
  return seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
}

export function Breadcrumbs({
  className,
  separator = "/",
  hideHome = false,
}: {
  className?: string;
  separator?: string;
  hideHome?: boolean;
}) {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);
  const paths: Item[] = [];
  let acc = "";
  for (let i = 0; i < parts.length; i++) {
    acc += "/" + parts[i];
    paths.push({ href: acc, label: toLabel(acc) });
  }
  if (!parts.length) paths.push({ href: "/", label: LABELS["/"] });
  const items = hideHome ? paths.filter(p => p.href !== "/") : paths;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        {(items.length ? items : [{ href: "/", label: LABELS["/"] }]).map((item, idx, arr) => {
          const isLast = idx === arr.length - 1;
          const content = (
            <span className={isLast ? "font-medium text-gray-900 dark:text-gray-100" : ""}>
              {item.label || toLabel(item.href || "/")}
            </span>
          );
          return (
            <li key={(item.href || "") + idx} className="flex items-center">
              {isLast || !item.href ? (
                content
              ) : (
                <Link href={item.href} className="hover:underline">
                  {content}
                </Link>
              )}
              {!isLast && (
                <span className="mx-2 select-none text-gray-400">{separator}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
