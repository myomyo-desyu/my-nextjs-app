"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Database, FolderSyncIcon as Sync, CheckCircle, AlertCircle, Clock, ExternalLink } from "lucide-react"

const mockInputTasks = [
  {
    id: "1",
    name: "UI設計レビュー",
    priority: "High",
    duration: "2h",
    deadline: "2024-01-12",
    assignee: "田中",
    scheduleFlag: true,
    lastSync: "2024-01-10 14:30",
  },
  {
    id: "2",
    name: "API実装",
    priority: "Critical",
    duration: "1d",
    deadline: "2024-01-15",
    assignee: "佐藤",
    scheduleFlag: true,
    lastSync: "2024-01-10 14:30",
  },
  {
    id: "3",
    name: "ドキュメント更新",
    priority: "Low",
    duration: "1h",
    deadline: "2024-01-20",
    assignee: "山田",
    scheduleFlag: false,
    lastSync: "2024-01-10 14:30",
  },
]

const mockOutputTasks = [
  {
    id: "1",
    name: "UI設計レビュー",
    startTime: "2024-01-11 09:00",
    endTime: "2024-01-11 11:00",
    bucket: "午前",
    status: "scheduled",
    ganttUrl: "https://taskflow.ai/gantt/1",
  },
  {
    id: "2",
    name: "API実装",
    startTime: "2024-01-12 09:00",
    endTime: "2024-01-12 17:00",
    bucket: "終日",
    status: "scheduled",
    ganttUrl: "https://taskflow.ai/gantt/2",
  },
]

export default function NotionSync() {
  const [apiKey, setApiKey] = useState("")
  const [inputDbId, setInputDbId] = useState("")
  const [outputDbId, setOutputDbId] = useState("")
  const [isConnected, setIsConnected] = useState(true)
  const [syncProgress, setSyncProgress] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleConnect = () => {
    setIsConnected(true)
  }

  const handleSync = () => {
    setIsSyncing(true)
    setSyncProgress(0)

    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSyncing(false)
          return 100
        }
        return prev + 20
      })
    }, 500)
  }

  const toggleScheduleFlag = (taskId: string) => {
    // スケジュールフラグの切り替えロジック
    console.log(`Toggle schedule flag for task ${taskId}`)
  }

  return (
    <div className="space-y-6">
      {/* 接続設定 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Notion 連携設定
              </CardTitle>
              <CardDescription>Notion APIを使用してタスクデータベースと双方向同期</CardDescription>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"}>{isConnected ? "接続済み" : "未接続"}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Notion API Key</Label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="secret_..."
              />
            </div>
            <div className="space-y-2">
              <Label>Input Database ID</Label>
              <Input value={inputDbId} onChange={(e) => setInputDbId(e.target.value)} placeholder="タスク入力DB ID" />
            </div>
            <div className="space-y-2">
              <Label>Output Database ID</Label>
              <Input
                value={outputDbId}
                onChange={(e) => setOutputDbId(e.target.value)}
                placeholder="スケジュール出力DB ID"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleConnect} disabled={isConnected}>
              <Database className="w-4 h-4 mr-2" />
              接続テスト
            </Button>
            <Button onClick={handleSync} disabled={!isConnected || isSyncing}>
              <Sync className="w-4 h-4 mr-2" />
              {isSyncing ? "同期中..." : "データ同期"}
            </Button>
          </div>
          {isSyncing && (
            <div className="mt-4">
              <Progress value={syncProgress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">同期進行中: {syncProgress}%</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="input" className="space-y-4">
        <TabsList>
          <TabsTrigger value="input">Input Database</TabsTrigger>
          <TabsTrigger value="output">Output Database</TabsTrigger>
          <TabsTrigger value="mapping">フィールドマッピング</TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>タスク入力データベース</CardTitle>
              <CardDescription>Notionから取得したタスクデータ。ScheduleFlagがONのタスクが最適化対象</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>タスク名</TableHead>
                    <TableHead>優先度</TableHead>
                    <TableHead>期間</TableHead>
                    <TableHead>締切</TableHead>
                    <TableHead>担当者</TableHead>
                    <TableHead>スケジュール対象</TableHead>
                    <TableHead>最終同期</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInputTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>
                        <Badge variant={task.priority === "Critical" ? "destructive" : "default"}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.duration}</TableCell>
                      <TableCell>{task.deadline}</TableCell>
                      <TableCell>{task.assignee}</TableCell>
                      <TableCell>
                        <Switch checked={task.scheduleFlag} onCheckedChange={() => toggleScheduleFlag(task.id)} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{task.lastSync}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="output">
          <Card>
            <CardHeader>
              <CardTitle>スケジュール出力データベース</CardTitle>
              <CardDescription>OR-Toolsで最適化されたスケジュール結果をNotionに書き戻し</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>タスク名</TableHead>
                    <TableHead>開始日時</TableHead>
                    <TableHead>終了日時</TableHead>
                    <TableHead>バケット</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>ガントURL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOutputTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>{task.startTime}</TableCell>
                      <TableCell>{task.endTime}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.bucket}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {task.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" asChild>
                          <a href={task.ganttUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping">
          <Card>
            <CardHeader>
              <CardTitle>フィールドマッピング設定</CardTitle>
              <CardDescription>NotionデータベースのプロパティとTaskFlowフィールドの対応関係</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Input Database Mapping</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>タスク名</span>
                        <Badge variant="outline">Name (title)</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>優先度</span>
                        <Badge variant="outline">Priority (select)</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>期間</span>
                        <Badge variant="outline">Duration (text)</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>締切</span>
                        <Badge variant="outline">Deadline (date)</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>担当者</span>
                        <Badge variant="outline">Assignee (person)</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>スケジュール対象</span>
                        <Badge variant="outline">ScheduleFlag (checkbox)</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Output Database Mapping</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>開始日時</span>
                        <Badge variant="outline">StartTime (datetime)</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>終了日時</span>
                        <Badge variant="outline">EndTime (datetime)</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>バケット</span>
                        <Badge variant="outline">Bucket (select)</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>ステータス</span>
                        <Badge variant="outline">Status (select)</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>ガントURL</span>
                        <Badge variant="outline">GanttURL (url)</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 同期統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sync className="w-4 h-4" />
              同期済みタスク
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <div className="text-sm text-muted-foreground">最終同期: 14:30</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              スケジュール済み
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">67% 完了率</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              同期エラー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">要確認</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              次回同期
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15:00</div>
            <div className="text-sm text-muted-foreground">30分後</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
