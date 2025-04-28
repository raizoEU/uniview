import { Card } from "../ui/card";

export function ResponsiveGridCardsSkeleton() {
  const cards = [0, 1, 2];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
      {cards.map((card) => (
        <Card key={card} className="animate-pulse h-full" />
      ))}
    </div>
  );
}
