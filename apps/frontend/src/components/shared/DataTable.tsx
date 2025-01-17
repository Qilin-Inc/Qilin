
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "P001",
    paymentStatus: "Unbanned",
    totalAmount: "Immortal 3",
    paymentMethod: "Cheese #6465",
  },
  {
    invoice: "P002",
    paymentStatus: "Unbanned",
    totalAmount: "Silver 3",
    paymentMethod: "CipherGlider #5432",
  },
  {
    invoice: "P003",
    paymentStatus: "Unbanned",
    totalAmount: "Gold 1",
    paymentMethod: "WinVin #2274",
  },
  {
    invoice: "P004",
    paymentStatus: "Unbanned",
    totalAmount: "Gold 2",
    paymentMethod: "Kaviar #9981",
  },
  {
    invoice: "P005",
    paymentStatus: "Banned",
    totalAmount: "Emerald 3",
    paymentMethod: "Overwatch10x #2121",
  },
  {
    invoice: "P006",
    paymentStatus: "Unbanned",
    totalAmount: "Platinum 2",
    paymentMethod: "Ookami #7001",
  },
  {
    invoice: "P007",
    paymentStatus: "Unbanned",
    totalAmount: "Iron 3",
    paymentMethod: "GitGud #1234",
  },
]

export function TableDemo() {
  return (
    <Table className="bg-white rounded-md drop-shadow shadow-black">
      <TableCaption>A list of players</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Player ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Rank</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
