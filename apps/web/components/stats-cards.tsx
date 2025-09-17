import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, DollarSign, Shield, Clock, CheckCircle } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Total Links",
      value: "1,247",
      change: "+12.5%",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: "3,891",
      change: "+8.2%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Volume Processed",
      value: "$2.4M",
      change: "+23.1%",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Compliance Rate",
      value: "99.7%",
      change: "+0.3%",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentActivity = [
    {
      type: "Payment Link Created",
      user: "Alice Johnson",
      time: "2 minutes ago",
      status: "success",
    },
    {
      type: "KYC Approved",
      user: "Bob Smith",
      time: "5 minutes ago",
      status: "success",
    },
    {
      type: "Sanctions Check Failed",
      user: "Charlie Brown",
      time: "8 minutes ago",
      status: "warning",
    },
    {
      type: "Payroll Batch Processed",
      user: "Diana Prince",
      time: "12 minutes ago",
      status: "success",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
      
      {/* Recent Activity Card */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.type}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                </div>
                <Badge variant={activity.status === 'success' ? 'success' : 'warning'}>
                  {activity.time}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
