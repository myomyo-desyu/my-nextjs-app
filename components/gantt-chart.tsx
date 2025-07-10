"use client"

import { useCallback, useState } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  Background,
  type Connection,
  ConnectionMode,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow"
import "reactflow/dist/style.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, Clock, User, GitBranch, Circle } from "lucide-react"

// カスタムタスクノード
function TaskNode({ data }: { data: any }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-3 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
            <Handle type="target" position={Position.Left} />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{data.name}</h3>
                <Badge variant={data.priority === "Critical" ? "destructive" : "default"} className="text-xs">
                  {data.priority}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                {data.assignee}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {data.duration}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {data.startDate} - {data.endDate}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${data.progress}%` }}></div>
              </div>
            </div>
            <Handle type="source" position={Position.Right} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <div>
              <strong>ID:</strong> {data.id}
            </div>
            <div>
              <strong>開始:</strong> {data.startDate}
            </div>
            <div>
              <strong>終了:</strong> {data.endDate}
            </div>
            <div>
              <strong>説明:</strong> {data.description}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// 時間軸付きガントチャート
function TimelineGanttView() {
  const tasks = [
    {
      id: 1,
      name: "要件定義",
      assignee: "田中",
      startDate: "2024-01-10",
      endDate: "2024-01-12",
      duration: 3,
      priority: "High",
      progress: 100,
      color: "#3b82f6",
    },
    {
      id: 2,
      name: "UI設計",
      assignee: "佐藤",
      startDate: "2024-01-13",
      endDate: "2024-01-15",
      duration: 3,
      priority: "High",
      progress: 80,
      color: "#10b981",
    },
    {
      id: 3,
      name: "API実装",
      assignee: "鈴木",
      startDate: "2024-01-13",
      endDate: "2024-01-18",
      duration: 6,
      priority: "Critical",
      progress: 30,
      color: "#ef4444",
    },
    {
      id: 4,
      name: "フロントエンド実装",
      assignee: "山田",
      startDate: "2024-01-16",
      endDate: "2024-01-19",
      duration: 4,
      priority: "High",
      progress: 0,
      color: "#f59e0b",
    },
    {
      id: 5,
      name: "統合テスト",
      assignee: "田中",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      duration: 3,
      priority: "Medium",
      progress: 0,
      color: "#8b5cf6",
    },
    {
      id: 6,
      name: "デプロイ準備",
      assignee: "佐藤",
      startDate: "2024-01-23",
      endDate: "2024-01-24",
      duration: 2,
      priority: "Medium",
      progress: 0,
      color: "#06b6d4",
    },
  ]

  const assignees = ["田中", "佐藤", "鈴木", "山田"]

  // 日付範囲を生成
  const startDate = new Date("2024-01-10")
  const endDate = new Date("2024-01-25")
  const dateRange = []
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dateRange.push(new Date(d))
  }

  // 日付からピクセル位置を計算
  const getDatePosition = (date: string) => {
    const targetDate = new Date(date)
    const daysDiff = Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff * 60 // 1日 = 60px
  }

  // タスクバーの幅を計算
  const getTaskWidth = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return daysDiff * 60 // 1日 = 60px
  }

  return (
    <div className="p-4 overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* ヘッダー（日付） */}
        <div className="flex mb-4">
          <div className="w-32 flex-shrink-0"></div> {/* 担当者列の幅 */}
          <div className="flex">
            {dateRange.map((date, index) => (
              <div key={index} className="w-[60px] text-center border-r border-gray-200">
                <div className="text-xs font-medium">
                  {date.getMonth() + 1}/{date.getDate()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {["日", "月", "火", "水", "木", "金", "土"][date.getDay()]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ガントチャート本体 */}
        <div className="space-y-2">
          {assignees.map((assignee, assigneeIndex) => (
            <div key={assignee} className="flex items-center">
              {/* 担当者名 */}
              <div className="w-32 flex-shrink-0 text-sm font-medium py-4 pr-4">{assignee}</div>

              {/* タイムライン */}
              <div className="relative flex-1 h-16 border-t border-gray-200">
                {/* 日付グリッド */}
                {dateRange.map((date, index) => (
                  <div
                    key={index}
                    className="absolute top-0 bottom-0 border-r border-gray-100"
                    style={{ left: `${index * 60}px`, width: "60px" }}
                  />
                ))}

                {/* タスクバー */}
                {tasks
                  .filter((task) => task.assignee === assignee)
                  .map((task) => (
                    <TooltipProvider key={task.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="absolute top-2 bottom-2 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow flex items-center px-2"
                            style={{
                              left: `${getDatePosition(task.startDate)}px`,
                              width: `${getTaskWidth(task.startDate, task.endDate)}px`,
                              backgroundColor: task.color,
                              opacity: 0.8,
                            }}
                          >
                            <div className="text-white text-xs font-medium truncate">{task.name}</div>
                            {/* 進捗バー */}
                            <div className="absolute bottom-1 left-1 right-1 h-1 bg-white/30 rounded-full overflow-hidden">
                              <div className="h-full bg-white rounded-full" style={{ width: `${task.progress}%` }} />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <div>
                              <strong>{task.name}</strong>
                            </div>
                            <div>
                              期間: {task.startDate} - {task.endDate}
                            </div>
                            <div>所要日数: {task.duration}日</div>
                            <div>優先度: {task.priority}</div>
                            <div>進捗: {task.progress}%</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* 今日の線 */}
        <div
          className="absolute top-16 bottom-0 w-0.5 bg-red-500 z-10"
          style={{ left: `${132 + getDatePosition("2024-01-15")}px` }}
        >
          <div className="absolute -top-2 -left-8 text-xs text-red-500 font-medium">今日</div>
        </div>
      </div>
    </div>
  )
}

// バブルタイムライン（時間軸付き）
function BubbleTimelineView() {
  const tasks = [
    {
      id: 1,
      name: "要件定義",
      assignee: "田中",
      duration: 3,
      priority: "High",
      startHour: 9,
      date: "1/10",
      progress: 100,
    },
    {
      id: 2,
      name: "UI設計",
      assignee: "佐藤",
      duration: 2,
      priority: "High",
      startHour: 10,
      date: "1/13",
      progress: 80,
    },
    {
      id: 3,
      name: "API実装",
      assignee: "鈴木",
      duration: 4,
      priority: "Critical",
      startHour: 13,
      date: "1/13",
      progress: 30,
    },
    {
      id: 4,
      name: "テスト",
      assignee: "山田",
      duration: 1,
      priority: "Medium",
      startHour: 15,
      date: "1/16",
      progress: 0,
    },
  ]

  const assignees = ["田中", "佐藤", "鈴木", "山田"]
  const hours = Array.from({ length: 9 }, (_, i) => i + 9) // 9-17時

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">日別時間配分ビュー</h3>
        <div className="text-sm text-muted-foreground">円の大きさ：所要時間、色：優先度</div>
      </div>

      <div className="grid grid-cols-10 gap-2">
        {/* ヘッダー */}
        <div className="font-semibold text-sm">担当者</div>
        {hours.map((hour) => (
          <div key={hour} className="text-center text-xs font-medium">
            {hour}:00
          </div>
        ))}

        {/* バブル表示 */}
        {assignees.map((assignee) => (
          <div key={assignee} className="contents">
            <div className="text-sm py-4 flex items-center">{assignee}</div>
            {hours.map((hour) => {
              const task = tasks.find((t) => t.assignee === assignee && t.startHour === hour)
              return (
                <div key={hour} className="h-16 flex items-center justify-center">
                  {task && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`rounded-full ${getPriorityColor(task.priority)} opacity-80 hover:opacity-100 cursor-pointer transition-all flex items-center justify-center text-white text-xs font-bold`}
                            style={{
                              width: `${Math.max(task.duration * 8, 24)}px`,
                              height: `${Math.max(task.duration * 8, 24)}px`,
                            }}
                          >
                            {task.duration}h
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <div>
                              <strong>{task.name}</strong>
                            </div>
                            <div>日付: {task.date}</div>
                            <div>
                              時間: {task.startHour}:00-{task.startHour + task.duration}:00
                            </div>
                            <div>期間: {task.duration}時間</div>
                            <div>優先度: {task.priority}</div>
                            <div>進捗: {task.progress}%</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ラジアルタイムライン（日付情報付き）
function RadialTimelineView() {
  const tasks = [
    { id: 1, name: "要件定義", startHour: 9, duration: 3, priority: "High", assignee: "田中", date: "1/10" },
    { id: 2, name: "UI設計", startHour: 13, duration: 2, priority: "High", assignee: "佐藤", date: "1/13" },
    { id: 3, name: "API実装", startHour: 10, duration: 4, priority: "Critical", assignee: "鈴木", date: "1/13" },
    { id: 4, name: "テスト", startHour: 15, duration: 1, priority: "Medium", assignee: "山田", date: "1/16" },
  ]

  const centerX = 200
  const centerY = 200
  const radius = 150

  const getTaskPosition = (startHour: number, duration: number, index: number) => {
    const startAngle = (startHour - 6) * 15 * (Math.PI / 180) // 6時を上に
    const endAngle = (startHour + duration - 6) * 15 * (Math.PI / 180)
    const taskRadius = radius + (index % 3) * 20 // 複数レイヤー

    return {
      startX: centerX + Math.cos(startAngle) * taskRadius,
      startY: centerY + Math.sin(startAngle) * taskRadius,
      endX: centerX + Math.cos(endAngle) * taskRadius,
      endY: centerY + Math.sin(endAngle) * taskRadius,
      midX: centerX + Math.cos((startAngle + endAngle) / 2) * taskRadius,
      midY: centerY + Math.sin((startAngle + endAngle) / 2) * taskRadius,
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "#ef4444"
      case "High":
        return "#f97316"
      case "Medium":
        return "#eab308"
      case "Low":
        return "#22c55e"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="flex justify-center p-4">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">24時間ラジアルビュー</h3>
          <div className="text-sm text-muted-foreground">円環上にタスクスケジュールを表示</div>
        </div>

        <svg width="400" height="400" className="border rounded-lg">
          {/* 時間円環 */}
          <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="2" />

          {/* 時間マーカー */}
          {Array.from({ length: 24 }, (_, i) => {
            const angle = i * 15 * (Math.PI / 180)
            const x1 = centerX + Math.cos(angle) * (radius - 10)
            const y1 = centerY + Math.sin(angle) * (radius - 10)
            const x2 = centerX + Math.cos(angle) * (radius + 10)
            const y2 = centerY + Math.sin(angle) * (radius + 10)
            const textX = centerX + Math.cos(angle) * (radius + 25)
            const textY = centerY + Math.sin(angle) * (radius + 25)

            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9ca3af" strokeWidth="1" />
                <text x={textX} y={textY} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#6b7280">
                  {(i + 6) % 24}
                </text>
              </g>
            )
          })}

          {/* タスクバー */}
          {tasks.map((task, index) => {
            const pos = getTaskPosition(task.startHour, task.duration, index)
            const color = getPriorityColor(task.priority)

            return (
              <g key={task.id}>
                <line
                  x1={pos.startX}
                  y1={pos.startY}
                  x2={pos.endX}
                  y2={pos.endY}
                  stroke={color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="hover:stroke-width-12 cursor-pointer"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <circle cx={pos.midX} cy={pos.midY} r="6" fill={color} className="cursor-pointer hover:r-8" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <div>
                          <strong>{task.name}</strong>
                        </div>
                        <div>日付: {task.date}</div>
                        <div>担当: {task.assignee}</div>
                        <div>
                          時間: {task.startHour}:00 - {task.startHour + task.duration}:00
                        </div>
                        <div>優先度: {task.priority}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </g>
            )
          })}

          {/* 中央ラベル */}
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#374151"
          >
            24H Timeline
          </text>
          <text x={centerX} y={centerY + 10} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#6b7280">
            2024/01/10-16
          </text>
        </svg>
      </div>
    </div>
  )
}

const nodeTypes = {
  taskNode: TaskNode,
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "taskNode",
    data: {
      id: "TASK-001",
      name: "要件定義",
      assignee: "田中",
      duration: "3d",
      deadline: "2024-01-15",
      priority: "High",
      progress: 100,
      startDate: "2024-01-10",
      endDate: "2024-01-12",
      description: "プロジェクトの要件を明確化し、仕様書を作成する",
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "2",
    type: "taskNode",
    data: {
      id: "TASK-002",
      name: "UI設計",
      assignee: "佐藤",
      duration: "2d",
      deadline: "2024-01-18",
      priority: "High",
      progress: 80,
      startDate: "2024-01-13",
      endDate: "2024-01-15",
      description: "ユーザーインターフェースの設計とプロトタイプ作成",
    },
    position: { x: 400, y: 100 },
  },
  {
    id: "3",
    type: "taskNode",
    data: {
      id: "TASK-003",
      name: "API実装",
      assignee: "鈴木",
      duration: "4d",
      deadline: "2024-01-22",
      priority: "Critical",
      progress: 30,
      startDate: "2024-01-13",
      endDate: "2024-01-18",
      description: "バックエンドAPIの実装とテスト",
    },
    position: { x: 400, y: 250 },
  },
  {
    id: "4",
    type: "taskNode",
    data: {
      id: "TASK-004",
      name: "フロントエンド実装",
      assignee: "山田",
      duration: "3d",
      deadline: "2024-01-25",
      priority: "High",
      progress: 0,
      startDate: "2024-01-16",
      endDate: "2024-01-19",
      description: "フロントエンドの実装とUI統合",
    },
    position: { x: 700, y: 100 },
  },
  {
    id: "5",
    type: "taskNode",
    data: {
      id: "TASK-005",
      name: "統合テスト",
      assignee: "田中",
      duration: "2d",
      deadline: "2024-01-28",
      priority: "Medium",
      progress: 0,
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      description: "システム全体の統合テストと品質確認",
    },
    position: { x: 1000, y: 175 },
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4", animated: true },
  { id: "e3-5", source: "3", target: "5", animated: true },
  { id: "e4-5", source: "4", target: "5", animated: true },
]

export default function GanttChart() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [viewMode, setViewMode] = useState<"timeline" | "dependency" | "bubble" | "radial">("timeline")

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>時間軸対応ガントチャート</CardTitle>
              <CardDescription>実際のスケジュール・時間軸・依存関係を可視化</CardDescription>
            </div>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  タイムライン
                </TabsTrigger>
                <TabsTrigger value="dependency" className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  依存関係
                </TabsTrigger>
                <TabsTrigger value="bubble" className="flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  バブル
                </TabsTrigger>
                <TabsTrigger value="radial" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  ラジアル
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            {viewMode === "timeline" && (
              <div className="h-[600px] overflow-auto">
                <TimelineGanttView />
              </div>
            )}

            {viewMode === "dependency" && (
              <div className="h-[600px]">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  connectionMode={ConnectionMode.Loose}
                  fitView
                  fitViewOptions={{ padding: 0.2 }}
                >
                  <Background />
                  <Controls />
                </ReactFlow>
              </div>
            )}

            {viewMode === "bubble" && (
              <div className="h-[600px] overflow-auto">
                <BubbleTimelineView />
              </div>
            )}

            {viewMode === "radial" && (
              <div className="h-[600px] flex items-center justify-center">
                <RadialTimelineView />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* スケジュール統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">プロジェクト期間</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15日</div>
            <div className="text-sm text-muted-foreground">2024/01/10 - 01/24</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">並行タスク数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">最大同時実行</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">クリティカルパス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12日</div>
            <div className="text-sm text-muted-foreground">要件定義→API実装→テスト</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">リソース効率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-muted-foreground">平均使用率</div>
          </CardContent>
        </Card>
      </div>

      {/* ビュー説明 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              タイムラインビュー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              実際の日付軸でタスクスケジュールを表示。担当者別の時間配分が一目瞭然。
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              依存関係ビュー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              タスク間の依存関係を可視化。ドラッグ&ドロップで再配置可能。
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Circle className="w-4 h-4" />
              バブルタイムライン
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              円の大きさで期間、色で優先度を表現。日別・時間別の詳細ビュー。
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              ラジアルタイムライン
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              24時間を円環で表現。タスクを外周に配置した革新的ビュー。
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
