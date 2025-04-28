import { getSession } from "@/lib/service/get-session";
import { notFound } from "next/navigation";

export default async function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return session?.user && session.user.role === "host" ? (
    <>{children}</>
  ) : (
    notFound()
  );
}
