"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Column = {
  key: string;
  label: string;
};

type Props = {
  loading?: boolean;

  data: any[];

  total: number;

  totalPages: number;

  page: number;

  pageSize: number;

  search: string;

  onSearchChange: (
    value: string
  ) => void;

  onPageChange: (
    page: number
  ) => void;

  onPageSizeChange: (
    size: number
  ) => void;

  columns: Column[];

  actions?: (
    row: any
  ) => React.ReactNode;
};

export default function DataTable({
  loading = false,
  data,
  total,
  totalPages,
  page,
  pageSize,
  search,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  columns,
  actions,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="rounded-md border p-4 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            onSearchChange(
              e.target.value
            )
          }
          className="max-w-sm"
        />

        <select
          value={pageSize}
          onChange={(e) =>
            onPageSizeChange(
              Number(
                e.target.value
              )
            )
          }
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value={5}>
            5
          </option>

          <option value={10}>
            10
          </option>

          <option value={20}>
            20
          </option>

          <option value={50}>
            50
          </option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map(
                (column) => (
                  <th
                    key={
                      column.key
                    }
                    className="px-4 py-3 text-left text-sm font-medium"
                  >
                    {
                      column.label
                    }
                  </th>
                )
              )}

              {actions && (
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-muted/30"
                >
                  {columns.map(
                    (
                      column
                    ) => (
                      <td
                        key={
                          column.key
                        }
                        className="px-4 py-3"
                      >
                        {
                          row[
                            column
                              .key
                          ]
                        }
                      </td>
                    )
                  )}

                  {actions && (
                    <td className="px-4 py-3">
                      {actions(
                        row
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (actions
                      ? 1
                      : 0)
                  }
                  className="py-10 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p className="font-medium">
                      No records found
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Try changing
                      your search
                      criteria.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          {total === 0
            ? 0
            : (page - 1) *
                pageSize +
              1}
          -
          {Math.min(
            page * pageSize,
            total
          )}{" "}
          of {total} records
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() =>
              onPageChange(
                page - 1
              )
            }
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {page} of{" "}
            {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={
              page ===
              totalPages
            }
            onClick={() =>
              onPageChange(
                page + 1
              )
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}