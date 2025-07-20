"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Clock, CheckCircle, Circle } from "lucide-react"

const mockTasks = [
  {
    id: 1,
    name: "UI設計レビュー",
    priority: "High",
    duration: "2h",
    deadline: "2024-01-12",
    assignee: "田中",
    status: "進行中",
    progress: 60,
    bucket: "午前",
  },
  {
    id: 2,
    name: "API実装",
    priority: "Critical",
    duration: "1d",
    deadline: "2024-01-15",
    assignee: "佐藤",
    status: "未開始",
    progress: 0,
    bucket: "終日",
  },
  {
    id: 3,
    name: "テストケース作成",
    priority: "Medium",
    duration: "4h",
    deadline: "2024-01-18",
    assignee: "鈴木",
    status: "完了",
    progress: 100,
    bucket: "午後",
  },
  {
    id: 4,
    name: "ドキュメント更新",
    priority: "Low",
    duration: "1h",
    deadline: "2024-01-20",
    assignee: "山田",
    status: "未開始",
    progress: 0,
    bucket: "午前",
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "destructive"
    case "High":
      return "default"
    case "Medium":
      return "secondary"
    case "Low":
      return "outline"
    default:
      return "secondary"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "完了":
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case "進行中":
      return <Clock className="w-4 h-4 text-blue-500" />
    case "未開始":
      return <Circle className="w-4 h-4 text-gray-400" />
    default:
      return <Circle className="w-4 h-4 text-gray-400" />
  }
}

export default function TaskDashboard() {
  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総タスク数</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">進行中</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">33% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">完了</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">50% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">遅延リスク</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* フィルター */}
      <Card>
        <CardHeader>
          <CardTitle>タスク一覧</CardTitle>
          <CardDescription>最新のタスク状況とスケジュール</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input placeholder="タスク名で検索..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="優先度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="担当者" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="tanaka">田中</SelectItem>
                <SelectItem value="sato">佐藤</SelectItem>
                <SelectItem value="suzuki">鈴木</SelectItem>
                <SelectItem value="yamada">山田</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>タスク名</TableHead>
                <TableHead>優先度</TableHead>
                <TableHead>期間</TableHead>
                <TableHead>締切</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead>バケット</TableHead>
                <TableHead>進捗</TableHead>
                <TableHead>状態</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>{task.duration}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{task.bucket}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={task.progress} className="w-16" />
                      <span className="text-sm text-muted-foreground">{task.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      {task.status}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
