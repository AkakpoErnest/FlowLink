"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Shield,
  Plus,
  Settings,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Globe,
  DollarSign,
  Clock,
  BarChart3,
  Filter,
  Download,
} from "lucide-react"

interface ComplianceVault {
  id: string
  name: string
  status: "active" | "paused" | "draft"
  policies: number
  blocked: number
  allowed: number
  riskScore: number
  created: string
}

interface PolicyRule {
  id: string
  type: "geofencing" | "sanctions" | "transaction-limit" | "time-restriction"
  name: string
  enabled: boolean
  config: any
}

export function ComplianceVaultsModule() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedVault, setSelectedVault] = useState<ComplianceVault | null>(null)
  const [showSimulator, setShowSimulator] = useState(false)

  const vaults: ComplianceVault[] = [
    {
      id: "cv_001",
      name: "Institutional Trading Vault",
      status: "active",
      policies: 8,
      blocked: 23,
      allowed: 1247,
      riskScore: 92,
      created: "2024-01-10",
    },
    {
      id: "cv_002",
      name: "Cross-border Payments",
      status: "active",
      policies: 5,
      blocked: 7,
      allowed: 456,
      riskScore: 88,
      created: "2024-01-08",
    },
    {
      id: "cv_003",
      name: "SME Subscription Vault",
      status: "paused",
      policies: 3,
      blocked: 2,
      allowed: 89,
      riskScore: 95,
      created: "2024-01-05",
    },
  ]

  const policyRules: PolicyRule[] = [
    {
      id: "pr_001",
      type: "geofencing",
      name: "Geographic Restrictions",
      enabled: true,
      config: { allowedCountries: ["SG", "HK", "US"], blockedCountries: ["KP", "IR"] },
    },
    {
      id: "pr_002",
      type: "sanctions",
      name: "OFAC Sanctions List",
      enabled: true,
      config: { lists: ["OFAC", "UN", "EU"], autoUpdate: true },
    },
    {
      id: "pr_003",
      type: "transaction-limit",
      name: "Daily Transaction Limits",
      enabled: true,
      config: { dailyLimit: 100000, perTxLimit: 50000, currency: "USD" },
    },
    {
      id: "pr_004",
      type: "time-restriction",
      name: "Business Hours Only",
      enabled: false,
      config: { startTime: "09:00", endTime: "17:00", timezone: "Asia/Singapore" },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-card-foreground">Compliance Vaults</h2>
          <p className="text-muted-foreground mt-1">Smart-account factories with programmable compliance policies</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowSimulator(true)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Policy Simulator
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Vault
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Compliance Vault</DialogTitle>
                <DialogDescription>Set up a new smart-account factory with custom policies</DialogDescription>
              </DialogHeader>
              <CreateVaultForm onClose={() => setShowCreateDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Vaults Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {vaults.map((vault) => (
          <VaultCard key={vault.id} vault={vault} onSelect={setSelectedVault} />
        ))}
      </div>

      {/* Policy Rules Management */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Policy Rules Library</CardTitle>
          <CardDescription>Drag and drop rules to configure vault policies</CardDescription>
        </CardHeader>
        <CardContent>
          <PolicyRulesManager rules={policyRules} />
        </CardContent>
      </Card>

      {/* Vault Details Dialog */}
      {selectedVault && (
        <Dialog open={!!selectedVault} onOpenChange={() => setSelectedVault(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedVault.name}</DialogTitle>
              <DialogDescription>Vault configuration and policy management</DialogDescription>
            </DialogHeader>
            <VaultDetails vault={selectedVault} />
          </DialogContent>
        </Dialog>
      )}

      {/* Policy Simulator Dialog */}
      {showSimulator && (
        <Dialog open={showSimulator} onOpenChange={setShowSimulator}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Policy Simulator</DialogTitle>
              <DialogDescription>Test policy configurations against historical transaction data</DialogDescription>
            </DialogHeader>
            <PolicySimulator />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function VaultCard({ vault, onSelect }: { vault: ComplianceVault; onSelect: (vault: ComplianceVault) => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card
      className="bg-card border-border hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(vault)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-card-foreground">{vault.name}</h3>
            <Badge className={getStatusColor(vault.status)}>{vault.status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Policies</p>
              <p className="font-medium text-card-foreground">{vault.policies}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Risk Score</p>
              <p className={`font-medium ${getRiskScoreColor(vault.riskScore)}`}>{vault.riskScore}%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Blocked</p>
              <p className="font-medium text-red-600">{vault.blocked}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Allowed</p>
              <p className="font-medium text-green-600">{vault.allowed}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              {vault.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PolicyRulesManager({ rules }: { rules: PolicyRule[] }) {
  const getPolicyIcon = (type: string) => {
    switch (type) {
      case "geofencing":
        return <Globe className="h-4 w-4" />
      case "sanctions":
        return <Shield className="h-4 w-4" />
      case "transaction-limit":
        return <DollarSign className="h-4 w-4" />
      case "time-restriction":
        return <Clock className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-move"
            draggable
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getPolicyIcon(rule.type)}
                <span className="font-medium text-card-foreground">{rule.name}</span>
              </div>
              <Switch checked={rule.enabled} />
            </div>
            <p className="text-xs text-muted-foreground capitalize">{rule.type.replace("-", " ")}</p>
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Drag rules to vault configurations or use the Policy Simulator to test combinations
      </div>
    </div>
  )
}

function CreateVaultForm({ onClose }: { onClose: () => void }) {
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vault-name">Vault Name</Label>
          <Input id="vault-name" placeholder="e.g., Institutional Trading Vault" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vault-description">Description</Label>
          <Input id="vault-description" placeholder="Brief description of vault purpose" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vault-type">Vault Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="institutional">Institutional Trading</SelectItem>
                <SelectItem value="retail">Retail Payments</SelectItem>
                <SelectItem value="cross-border">Cross-border</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Default Policy Templates</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "geo", name: "Geographic Restrictions", icon: Globe },
            { id: "sanctions", name: "Sanctions Screening", icon: Shield },
            { id: "limits", name: "Transaction Limits", icon: DollarSign },
            { id: "time", name: "Time Restrictions", icon: Clock },
          ].map((policy) => {
            const Icon = policy.icon
            return (
              <div
                key={policy.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedPolicies.includes(policy.id)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => {
                  setSelectedPolicies((prev) =>
                    prev.includes(policy.id) ? prev.filter((p) => p !== policy.id) : [...prev, policy.id],
                  )
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{policy.name}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-primary hover:bg-primary/90">Create Vault</Button>
      </div>
    </div>
  )
}

function VaultDetails({ vault }: { vault: ComplianceVault }) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Allowed Transactions</span>
                </div>
                <p className="text-2xl font-bold text-card-foreground">{vault.allowed}</p>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Blocked Transactions</span>
                </div>
                <p className="text-2xl font-bold text-card-foreground">{vault.blocked}</p>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Risk Score</span>
                </div>
                <p className="text-2xl font-bold text-card-foreground">{vault.riskScore}%</p>
                <p className="text-xs text-muted-foreground">Compliance rating</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-card-foreground">Active Policies</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Policy
              </Button>
            </div>
            <PolicyConfigurationPanel />
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionHistory vaultId={vault.id} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <VaultAnalytics vault={vault} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PolicyConfigurationPanel() {
  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Geographic Restrictions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Enable geofencing</span>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Allowed Countries</Label>
            <div className="flex flex-wrap gap-2">
              {["Singapore", "Hong Kong", "United States"].map((country) => (
                <Badge key={country} variant="secondary">
                  {country}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Transaction Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Daily Limit (USD)</Label>
            <div className="px-3">
              <Slider defaultValue={[100000]} max={1000000} step={10000} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$0</span>
                <span>$100,000</span>
                <span>$1,000,000</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Per Transaction Limit (USD)</Label>
            <Input defaultValue="50000" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PolicySimulator() {
  const [simulationResults, setSimulationResults] = useState<any>(null)

  const runSimulation = () => {
    // Mock simulation results
    setSimulationResults({
      totalTransactions: 1500,
      blocked: 45,
      allowed: 1455,
      riskReduction: 23,
      falsePositives: 3,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Simulation Configuration</CardTitle>
            <CardDescription>Configure policies to test against historical data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Time Period</Label>
              <Select defaultValue="30days">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Transaction Volume</Label>
              <Input defaultValue="1500" />
            </div>
            <Button onClick={runSimulation} className="w-full bg-primary hover:bg-primary/90">
              <Play className="h-4 w-4 mr-2" />
              Run Simulation
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Policy Rules</CardTitle>
            <CardDescription>Drag and drop to configure simulation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Geographic Restrictions", enabled: true },
                { name: "Sanctions Screening", enabled: true },
                { name: "Transaction Limits", enabled: false },
                { name: "Time Restrictions", enabled: false },
              ].map((rule) => (
                <div key={rule.name} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{rule.name}</span>
                  <Switch defaultChecked={rule.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {simulationResults && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Simulation Results</CardTitle>
            <CardDescription>Impact analysis of policy configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-card-foreground">{simulationResults.totalTransactions}</p>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{simulationResults.allowed}</p>
                <p className="text-sm text-muted-foreground">Allowed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{simulationResults.blocked}</p>
                <p className="text-sm text-muted-foreground">Blocked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{simulationResults.riskReduction}%</p>
                <p className="text-sm text-muted-foreground">Risk Reduction</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{simulationResults.falsePositives}</p>
                <p className="text-sm text-muted-foreground">False Positives</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TransactionHistory({ vaultId }: { vaultId: string }) {
  const transactions = [
    {
      id: "tx_001",
      amount: "$45,000",
      status: "blocked",
      reason: "Geographic restriction",
      timestamp: "2024-01-15 14:30",
    },
    {
      id: "tx_002",
      amount: "$12,500",
      status: "allowed",
      reason: "All checks passed",
      timestamp: "2024-01-15 14:25",
    },
    {
      id: "tx_003",
      amount: "$75,000",
      status: "blocked",
      reason: "Transaction limit exceeded",
      timestamp: "2024-01-15 14:20",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">Recent Transactions</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${tx.status === "allowed" ? "bg-green-500" : "bg-red-500"}`} />
              <div>
                <p className="font-medium text-card-foreground">{tx.amount}</p>
                <p className="text-sm text-muted-foreground">{tx.reason}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={tx.status === "allowed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {tx.status}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">{tx.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VaultAnalytics({ vault }: { vault: ComplianceVault }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Policy Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Geographic Restrictions</span>
                <span className="text-sm font-medium">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sanctions Screening</span>
                <span className="text-sm font-medium">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Transaction Limits</span>
                <span className="text-sm font-medium">87%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Overall Risk Score</span>
                <span className="text-sm font-medium text-green-600">{vault.riskScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">False Positive Rate</span>
                <span className="text-sm font-medium">2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Compliance Rating</span>
                <span className="text-sm font-medium text-green-600">Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
