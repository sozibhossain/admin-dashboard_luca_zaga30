"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getAdminPayments } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import TableSkeleton from "@/components/table-skeleton";
import PaginationControls from "@/components/pagination-controls";
import { formatCurrency, formatDate } from "@/lib/format";

const statusVariant = (
  status: string,
): "success" | "danger" | "warning" | "secondary" => {
  switch (status.toLowerCase()) {
    case "paid":
      return "success";
    case "overdue":
      return "danger";
    case "rejected":
      return "warning";
    default:
      return "secondary";
  }
};

export default function PaymentsPage() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const query = useQuery({
    queryKey: ["admin-payments", page, search, accessToken],
    queryFn: () =>
      getAdminPayments({
        page,
        limit: 10,
        type: search ? search : undefined,
      }),
    enabled: status === "authenticated" && !!accessToken,
  });

  const payments = query.data?.data.items ?? [];
  const meta = query.data?.data.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Payments</h2>
          <p className="text-sm text-muted-foreground">
            Monitor billing activity and settlement status.
          </p>
        </div>
        <div className="flex w-full max-w-md items-center gap-3">
          <Input
            placeholder="Search by type"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button
            onClick={() => {
              setPage(1);
              setSearch(searchInput.trim());
            }}
          >
            Search
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent payments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {query.isLoading ? (
            <TableSkeleton columns={6} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell className="font-medium">{payment.type}</TableCell>
                    <TableCell>{payment.property?.name ?? "-"}</TableCell>
                    <TableCell>{payment.user?.name ?? payment.user?.email}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{formatDate(payment.dueDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PaginationControls
        page={meta?.page ?? 1}
        totalPages={meta?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
