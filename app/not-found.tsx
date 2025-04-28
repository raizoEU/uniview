import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 bg-background container mx-auto">
      <div className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-foreground font-semibold text-3xl md:text-4xl tracking-tight leading-none">
            Not Found
          </h2>
          <p className="text-muted-foreground">
            Could not find requested resource
          </p>
        </div>

        <Link className={buttonVariants({ variant: "default" })} href="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
