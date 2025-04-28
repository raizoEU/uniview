import { db } from "@/lib/model";
import { notFound } from "next/navigation";
import { PaymentHistory } from "./_components/payment-history";
import { getSession } from "@/lib/service/get-session";
import { and, eq, sql } from "drizzle-orm";
import { payments } from "@/lib/model/schema";

export default async function PaymentPage() {
  const session = await getSession();
  if (!session?.user) {
    notFound();
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Fetch all payments with their related data
  const paymentsData = await db.query.payments.findMany({
    where: (payments, { eq }) => eq(payments.studentId, session.user.id),
    with: {
      booking: {
        with: {
          listing: true,
        },
      },
    },
  });

  // Fetch recent payments (within last 30 days)
  const recentPaymentsData = await db.query.payments.findMany({
    where: (payments, { eq, and, gt }) =>
      and(
        eq(payments.studentId, session.user.id),
        gt(payments.createdAt, thirtyDaysAgo)
      ),
    with: {
      booking: {
        with: {
          listing: true,
        },
      },
    },
  });

  // Calculate total spent (successful payments)
  const totalSpentResult = await db
    .select({
      total: sql<string>`CAST(COALESCE(SUM(CAST(amount AS DECIMAL(10,2))), 0) AS VARCHAR)`,
    })
    .from(payments)
    .where(
      and(
        eq(payments.studentId, session.user.id),
        eq(payments.status, "successful")
      )
    );

  // Calculate pending amount
  const pendingAmountResult = await db
    .select({
      total: sql<string>`CAST(COALESCE(SUM(CAST(amount AS DECIMAL(10,2))), 0) AS VARCHAR)`,
    })
    .from(payments)
    .where(
      and(
        eq(payments.studentId, session.user.id),
        eq(payments.status, "pending")
      )
    );

  // Get last payment amount
  const lastPaymentResult = await db.query.payments.findFirst({
    where: (payments, { eq }) => eq(payments.studentId, session.user.id),
    orderBy: (payments, { desc }) => [desc(payments.createdAt)],
  });

  return (
    <div className="container mx-auto py-6">
      <PaymentHistory
        payments={paymentsData}
        recentPayments={recentPaymentsData}
        totalSpent={totalSpentResult[0]?.total ?? "0.00"}
        pendingAmount={pendingAmountResult[0]?.total ?? "0.00"}
        lastPayment={lastPaymentResult?.amount?.toString() ?? "0.00"}
      />
    </div>
  );
}
