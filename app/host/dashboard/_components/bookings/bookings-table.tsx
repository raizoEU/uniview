// components/BookingTable.tsx
"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpAZ, ArrowUpZA, ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSubmission } from "@/hooks/use-submission";
import { Bookings } from "@/lib/model/types";
import BookingEntryDropdown from "./booking-entry-dropdown";

interface BookingTableProps {
  bookings: Bookings[];
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { execute: acceptBooking } = useSubmission({
    action: async (bookingId: string) =>
      fetch(`/api/booking`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: bookingId, status: "confirmed" }),
      }),
    successMessage: "Booking accepted successfully",
    errorMessage: "Failed to accept booking",
    loadingMessage: "Accepting booking...",
  });

  const { execute: cancelBooking } = useSubmission({
    action: async (bookingId: string) =>
      fetch(`/api/booking`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: bookingId, status: "confirmed" }),
      }),
    successMessage: "Booking cancelled successfully",
    errorMessage: "Failed to cancel booking",
    loadingMessage: "Cancelling booking...",
  });

  const handleAcceptBooking = async (bookingId: string) =>
    acceptBooking(bookingId);

  const handleCancelBooking = async (bookingId: string) =>
    cancelBooking(bookingId);

  const columns: ColumnDef<Bookings>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "property",
      header: "Property",
    },
    {
      accessorKey: "tenantName", // Update to use tenantName
      header: "Tenant",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) =>
        new Date(row.getValue("startDate")).toLocaleDateString(),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => new Date(row.getValue("endDate")).toLocaleDateString(),
    },
    {
      accessorKey: "bookingStatus",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full flex justify-between items-center gap-3 group/booking-status"
        >
          Status
          {column.getIsSorted() === "asc" ? (
            <ArrowUpZA className="h-4 w-4 group-hover/booking-status:text-foreground transition-colors ease-in-out duration-300" />
          ) : (
            <ArrowUpAZ className="h-4 w-4 group-hover/booking-status:text-foreground transition-colors ease-in-out duration-300" />
          )}
        </button>
      ),
      cell: ({ row }) => row.getValue("bookingStatus"),
      enableSorting: true,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const booking = row.original;

        return (
          <BookingEntryDropdown
            handleAcceptBooking={() => handleAcceptBooking(booking.id)}
            handleCancelBooking={() => handleCancelBooking(booking.id)}
            booking={booking}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: bookings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center pb-4 gap-3">
        <Input
          placeholder="Filter by property name..."
          value={
            (table.getColumn("property")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("property")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <ToggleGroup
          type="single"
          onValueChange={(value) => {
            if (value === "all") {
              table.resetColumnFilters();
              return;
            }
            table.getColumn("bookingStatus")?.setFilterValue(value);
          }}
          value={
            (table.getColumn("bookingStatus")?.getFilterValue() as string) ??
            "all"
          }
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
          <ToggleGroupItem value="confirmed">Confirmed</ToggleGroupItem>
          <ToggleGroupItem value="cancelled">Cancelled</ToggleGroupItem>
        </ToggleGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingTable;
