"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getAdminUsers } from "@/lib/api";
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
import { formatDate } from "@/lib/format";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const query = useQuery({
    queryKey: ["admin-users", page, search, accessToken],
    queryFn: () => getAdminUsers({ page, limit: 10, search }),
    enabled: status === "authenticated" && !!accessToken,
  });

  const users = query.data?.data.items ?? [];
  const meta = query.data?.data.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Users</h2>
          <p className="text-sm text-muted-foreground">
            Verified users and recent signups.
          </p>
        </div>
        <div className="flex w-full max-w-md items-center gap-3">
          <Input
            placeholder="Search by name, email, phone"
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
          <CardTitle>All users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {query.isLoading ? (
            <TableSkeleton columns={5} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      {user.name ?? "-"}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {user.verificationInfo?.verified ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
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
