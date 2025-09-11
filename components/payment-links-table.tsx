import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink } from "lucide-react"

const mockLinks = [
  {
    id: "abc123",
    amount: "500.00",
    memo: "Service payment",
    requireKYC: true,
    checkSanctions: true,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "def456",
    amount: "250.00",
    memo: "Product purchase",
    requireKYC: false,
    checkSanctions: true,
    status: "paid",
    createdAt: "2024-01-14",
  },
  {
    id: "ghi789",
    amount: "1000.00",
    memo: "Consulting fee",
    requireKYC: true,
    checkSanctions: true,
    status: "active",
    createdAt: "2024-01-13",
  },
]

export function PaymentLinksTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Links</CardTitle>
        <CardDescription>Manage your active and completed payment links</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Link ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLinks.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-mono text-sm">{link.id}</TableCell>
                <TableCell>${link.amount}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {link.requireKYC && (
                      <Badge variant="secondary" className="text-xs">
                        KYC
                      </Badge>
                    )}
                    {link.checkSanctions && (
                      <Badge variant="secondary" className="text-xs">
                        Sanctions
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={link.status === "paid" ? "default" : "outline"}>{link.status}</Badge>
                </TableCell>
                <TableCell>{link.createdAt}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
