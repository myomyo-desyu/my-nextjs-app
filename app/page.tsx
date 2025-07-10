"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Database,
  MessageSquare,
  Settings,
  BarChart3,
  RefreshCw,
  Download,
  FolderSyncIcon as Sync,
} from "lucide-react"
import TaskDashboard from "@/components/task-dashboard"
import GanttChart from "@/components/gantt-chart"
import GraphView from "@/components/graph-view"
import RAGChat from "@/components/rag-chat"
import RuleSettings from "@/components/rule-settings"
import NotionSync from "@/components/notion-sync"

export default function TaskManagementPlatform() {
  const [lastSync, setLastSync] = useState("2024-01-10 14:30:00")
  const [solverStatus, setSolverStatus] = useState("OPTIMAL")
  const [makespan, setMakespan] = useState("5.2 days")

  const handleRecalculate = () => {
    setSolverStatus("RUNNING")
    setTimeout(() => {
      setSolverStatus("OPTIMAL")
      setMakespan("4.8 days")
      setLastSync(new Date().toLocaleString())
    }, 2000)
  }

  const handleSync = () => {
    setLastSync(new Date().toLocaleString())
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">TaskFlow AI</h1>
              <p className="text-muted-foreground">次世代タスク管理プラットフォーム</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">最終同期: {lastSync}</div>
              <Badge variant={solverStatus === "OPTIMAL" ? "default" : "secondary"}>{solverStatus}</Badge>
              <div className="text-sm">
                Makespan: <span className="font-mono">{makespan}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRecalculate} size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  再計算
                </Button>
                <Button onClick={handleSync} variant="outline" size="sm">
                  <Sync className="w-4 h-4 mr-2" />
                  同期
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              ダッシュボード
            </TabsTrigger>
            <TabsTrigger value="gantt" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              ガント
            </TabsTrigger>
            <TabsTrigger value="graph" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              グラフ
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              RAG Chat
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              ルール設定
            </TabsTrigger>
            <TabsTrigger value="notion" className="flex items-center gap-2">
              <Sync className="w-4 h-4" />
              Notion連携
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <TaskDashboard />
          </TabsContent>

          <TabsContent value="gantt">
            <GanttChart />
          </TabsContent>

          <TabsContent value="graph">
            <GraphView />
          </TabsContent>

          <TabsContent value="chat">
            <RAGChat />
          </TabsContent>

          <TabsContent value="settings">
            <RuleSettings />
          </TabsContent>

          <TabsContent value="notion">
            <NotionSync />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
