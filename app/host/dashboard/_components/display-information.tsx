import { Badge } from "@/components/ui/badge";

export function DisplayInformation({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="col-span-1">
      <div className="flex items-center justify-between w-full">
        <h3>{title}</h3>
        <Badge variant="secondary">{icon}</Badge>
      </div>

      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}
