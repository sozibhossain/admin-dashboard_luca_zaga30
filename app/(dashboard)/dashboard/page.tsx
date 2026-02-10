"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getAdminDashboardAnalytics,
  getPropertiesByCountry,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";

const metricCards = [
  { key: "users", label: "Total users" },
  { key: "properties", label: "Total properties" },
  { key: "payments", label: "Total payments" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;

  const analyticsQuery = useQuery({
    queryKey: ["admin-dashboard", accessToken],
    queryFn: () => getAdminDashboardAnalytics(),
    enabled: status === "authenticated" && !!accessToken,
  });

  const countryQuery = useQuery({
    queryKey: ["admin-country-summary", accessToken],
    queryFn: () => getPropertiesByCountry(),
    enabled: status === "authenticated" && !!accessToken,
  });

  const analytics = analyticsQuery.data?.data;
  const totals = analytics?.totals ?? {
    users: 0,
    properties: 0,
    payments: 0,
  };
  const newInRange = analytics?.newInRange ?? {
    users: 0,
    properties: 0,
    payments: 0,
  };
  const countrySummary = countryQuery.data?.data ?? [];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {metricCards.map((card) => (
            <Card key={card.key}>
              <CardHeader>
                <CardTitle>{card.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsQuery.isLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <p className="text-3xl font-semibold">
                    {totals[card.key as keyof typeof totals] ?? 0}
                  </p>
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                  New in range:{" "}
                  {analyticsQuery.isLoading ? (
                    <Skeleton className="mt-2 h-5 w-16" />
                  ) : (
                    newInRange[card.key as keyof typeof newInRange] ?? 0
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Revenue breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsQuery.isLoading ? (
              <>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-52" />
                <Skeleton className="h-8 w-44" />
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Total paid</p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(analytics?.amounts?.totalPaid ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total pending</p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(analytics?.amounts?.totalPending ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total overdue</p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(analytics?.amounts?.totalOverdue ?? 0)}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payments by status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsQuery.isLoading ? (
              <Skeleton className="h-28 w-full" />
            ) : (
              Object.entries(analytics?.paymentsByStatus ?? {}).map(
                ([status, value]) => (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>{status}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-brand"
                        style={{
                          width: `${
                            totals.payments
                              ? (value / totals.payments) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ),
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Properties by status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analyticsQuery.isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              Object.entries(analytics?.propertiesByStatus ?? {}).map(
                ([status, value]) => (
                  <div key={status} className="flex items-center justify-between">
                    <Badge variant="secondary">{status}</Badge>
                    <p className="text-sm font-semibold">{value}</p>
                  </div>
                ),
              )
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Monthly revenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analyticsQuery.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : analytics?.monthlyRevenue?.length ? (
              <div className="space-y-3">
                {analytics.monthlyRevenue.map((entry) => (
                  <div
                    key={`${entry.year}-${entry.month}`}
                    className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {new Date(entry.year, entry.month - 1).toLocaleString(
                          "en-US",
                          { month: "long", year: "numeric" },
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.count} payments processed
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatCurrency(entry.total)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No revenue entries for the selected range.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top countries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {countryQuery.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : countrySummary.length ? (
              countrySummary.slice(0, 5).map((country) => (
                <div
                  key={country.country}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold">{country.country}</p>
                    <p className="text-xs text-muted-foreground">
                      {country.count} properties
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatCurrency(country.totalPurchaseValue)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No country data available.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Range: {formatDate(analytics?.range?.from)} to{" "}
              {formatDate(analytics?.range?.to)}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
