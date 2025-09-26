"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function formatSegment(segment: string) {
  if (!segment) return "Home";
  const s = decodeURIComponent(segment).replace(/[-_]/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function AppBreadcrumb() {
  const pathname = usePathname() ?? "/";
  const path =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  const rawSegments = path
    .split("/")
    .filter(Boolean)
    .filter((s) => decodeURIComponent(s).toLowerCase() !== "dashboard");

  const segments = rawSegments.map((seg, idx) => {
    const href = "/" + rawSegments.slice(0, idx + 1).join("/");
    return { seg, href, label: formatSegment(seg) };
  });

  const items = [{ seg: "", href: "/", label: "Home" }, ...segments];

  const maxVisible = 4;
  const shouldCollapse = items.length > maxVisible;

  return (
    <Breadcrumb aria-label="breadcrumb" className="w-full">
      <BreadcrumbList>
        {shouldCollapse ? (
          <>
            {/* Home */}
            <BreadcrumbItem>
              <Link href={{pathname: items[0].href}} passHref legacyBehavior>
                <BreadcrumbLink asChild>
                  <a>{items[0].label}</a>
                </BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* First real segment */}
            <BreadcrumbItem>
              <Link href={{pathname: items[1].href}} passHref legacyBehavior>
                <BreadcrumbLink asChild>
                  <a>{items[1].label}</a>
                </BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* Ellipsis dropdown for middle segments */}
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Show more breadcrumb items"
                  >
                    <BreadcrumbEllipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {items.slice(2, items.length - 1).map((it) => (
                    <div key={it.href} className="px-2 py-1">
                      <Link href={{pathname: it.href}} passHref legacyBehavior>
                        <a className="block w-full text-sm">{it.label}</a>
                      </Link>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* Last segment */}
            <BreadcrumbItem aria-current="page">
              <span>{items[items.length - 1].label}</span>
            </BreadcrumbItem>
          </>
        ) : (
          // Render all items when not collapsed
          items.map((it, i) => {
            const isLast = i === items.length - 1;
            return (
              <React.Fragment key={it.href}>
                <BreadcrumbItem aria-current={isLast ? "page" : undefined}>
                  {isLast ? (
                    <BreadcrumbPage>{it.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <a>{it.label}</a>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {i < items.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
