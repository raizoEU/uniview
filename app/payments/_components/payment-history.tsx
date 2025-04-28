import {
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  XCircleIcon,
} from "lucide-react";
import { NoPaymentHistory } from "./no-payment-history";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bookings, Listings, Payments } from "@/lib/model/types";

type PaymentStatus = "successful" | "pending" | "failed";
type PaymentMethod = "card" | "paypal" | "bank-transfer";

interface PaymentHistoryProps {
  payments: (Payments & {
    booking: (Bookings & {
      listing: Listings | null;
    }) | null;
  })[];
  recentPayments: (Payments & {
    booking: (Bookings & {
      listing: Listings | null;
    }) | null;
  })[];
  totalSpent: string;
  pendingAmount: string;
  lastPayment: string;
}

export function PaymentHistory({
  payments: paymentsData,
  recentPayments,
  totalSpent,
  pendingAmount,
  lastPayment,
}: PaymentHistoryProps) {
  if (!paymentsData || paymentsData.length === 0) {
    return <NoPaymentHistory />;
  }
  function getPaymentMethodIcon(method: PaymentMethod) {
    switch (method) {
      case "card":
        return <CreditCardIcon className="h-4 w-4" />;
      case "paypal":
        return <span className="font-bold text-blue-600">P</span>;
      case "bank-transfer":
        return <span className="font-bold">B</span>;
      default:
        return <CreditCardIcon className="h-4 w-4" />;
    }
  }
  function getStatusBadge(status: PaymentStatus) {
    switch (status) {
      case "successful":
        return (
          <Badge className="bg-green-500">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Successful
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <ClockIcon className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            <XCircleIcon className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground">
          View and manage your payment transactions.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">
                Total Spent
              </div>
              <div className="mt-1 text-2xl font-bold">${totalSpent}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">
                Pending Payments
              </div>
              <div className="mt-1 text-2xl font-bold">${pendingAmount}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">
                Last Payment
              </div>
              <div className="mt-1 text-2xl font-bold">${lastPayment}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="recent">Recent Payments</TabsTrigger>
          <TabsTrigger value="all">All Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        <p className="text-muted-foreground">
                          No recent payments found.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {payment.createdAt?.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {payment.booking?.listing?.title || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getPaymentMethodIcon(
                              payment.paymentMethod as PaymentMethod
                            )}
                            <span className="capitalize">
                              {(payment.paymentMethod || "").replace("-", " ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          ${Number(payment.amount || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(payment.status as PaymentStatus)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsData.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {payment.createdAt?.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.booking?.listing?.title || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getPaymentMethodIcon(
                            payment.paymentMethod as PaymentMethod
                          )}
                          <span className="capitalize">
                            {(payment.paymentMethod || "").replace("-", " ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        £{Number(payment.amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status as PaymentStatus)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
