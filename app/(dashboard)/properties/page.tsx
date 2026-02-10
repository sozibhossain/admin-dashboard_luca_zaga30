"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getAdminProperties } from "@/lib/api";
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

export default function PropertiesPage() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const query = useQuery({
    queryKey: ["admin-properties", page, search, accessToken],
    queryFn: () => getAdminProperties({ page, limit: 10, search }),
    enabled: status === "authenticated" && !!accessToken,
  });

  const properties = query.data?.data.items ?? [];
  const meta = query.data?.data.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Properties</h2>
          <p className="text-sm text-muted-foreground">
            Track portfolio inventory and ownership details.
          </p>
        </div>
        <div className="flex w-full max-w-md items-center gap-3">
          <Input
            placeholder="Search by name, city, country"
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
          <CardTitle>All properties</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {query.isLoading ? (
            <TableSkeleton columns={6} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Purchase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property._id}>
                    <TableCell className="font-medium">
                      {property.name}
                    </TableCell>
                    <TableCell>
                      {property.address?.city}, {property.address?.country}
                    </TableCell>
                    <TableCell>{property.propertyType}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{property.status}</Badge>
                    </TableCell>
                    <TableCell>{property.user?.name ?? "-"}</TableCell>
                    <TableCell>
                      <div className="text-sm font-semibold">
                        {formatCurrency(property.purchasePrice)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(property.createdAt)}
                      </div>
                    </TableCell>
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
