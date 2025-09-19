"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Shield, CreditCard, Users, AlertTriangle, CheckCircle, Clock, DollarSign } from "lucide-react"

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Transaction Volume",
      value: "$2.4M",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Compliance Score",
      value: "98.7%",
      change: "+2.1%",
      icon: Shield,
      trend: "up",
    },
    {
      title: "Active Payment Links",
      value: "1,247",
      change: "+8.3%",
      icon: CreditCard,
      trend: "up",
    },
    {
      title: "Cross-border Payments",
      value: "89",
      change: "+15.2%",
      icon: Users,
      trend: "up",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "Payment Link",
      description: "KYC-gated link created for institutional client",
      amount: "$45,000",
      status: "completed",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "Compliance Vault",
      description: "Policy simulation completed - 3 transactions blocked",
      amount: null,
      status: "warning",
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "RWA Subscription",
      description: "T-bill subscription auto-renewed",
      amount: "$100,000",
      status: "completed",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "Payroll Rails",
      description: "Batch payment to 45 recipients in Singapore",
      amount: "$78,500",
      status: "processing",
      time: "2 hours ago",
    },
  ]

  const complianceAlerts = [
    {
      id: 1,
      severity: "high",
      message: "New MAS regulation update requires policy review",
      action: "Review Policies",
    },
    {
      id: 2,
      severity: "medium",
      message: "3 transactions pending KYC verification",
      action: "Review KYC",
    },
    {
      id: 3,
      severity: "low",
      message: "Monthly compliance report ready for export",
      action: "Download Report",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-card-foreground">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">
            Monitor your compliant payment infrastructure and regulatory status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-accent/20 text-accent">
            Live Demo Mode
          </Badge>
          <Button className="bg-primary hover:bg-primary/90">Generate Report</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-accent flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest transactions and compliance events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      activity.status === "completed"
                        ? "bg-green-500"
                        : activity.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{activity.type}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && <p className="text-sm font-medium text-card-foreground">{activity.amount}</p>}
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Compliance Alerts */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Compliance Alerts</CardTitle>
            <CardDescription>Regulatory updates and action items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {alert.severity === "high" ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : alert.severity === "medium" ? (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <p className="text-sm text-card-foreground">{alert.message}</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  {alert.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Compliance Score Breakdown */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Compliance Score Breakdown</CardTitle>
          <CardDescription>Real-time regulatory compliance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-card-foreground">KYC Verification</span>
                <span className="text-card-foreground font-medium">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-card-foreground">AML Screening</span>
                <span className="text-card-foreground font-medium">99%</span>
              </div>
              <Progress value={99} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-card-foreground">Transaction Monitoring</span>
                <span className="text-card-foreground font-medium">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
