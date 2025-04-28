"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

function formatLabel(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface DashboardBreadcrumbProps {
  displayRootLevel?: string;
}

export function DashboardBreadcrumb({
  displayRootLevel,
}: DashboardBreadcrumbProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Filter out the root level for display only
  const displayedSegments = displayRootLevel
    ? pathSegments.filter((segment) => segment !== displayRootLevel)
    : pathSegments;

  return (
    <Breadcrumb className="flex items-center">
      <BreadcrumbList>
        {displayedSegments.map((segment, index) => {
          // Always generate href based on full pathSegments
          const fullIndex = pathSegments.indexOf(segment);
          const href = `/${pathSegments.slice(0, fullIndex + 1).join("/")}`;

          return (
            <BreadcrumbItem key={index}>
              {index < displayedSegments.length - 1 ? (
                <BreadcrumbLink href={href}>
                  {formatLabel(segment)}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{formatLabel(segment)}</BreadcrumbPage>
              )}
              {index < displayedSegments.length - 1 && (
                <BreadcrumbSeparator className="mt-0.5" />
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
