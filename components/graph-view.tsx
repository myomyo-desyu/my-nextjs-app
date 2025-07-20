"use client"

import { useState, useEffect } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  addEdge,
  type Connection,
} from "reactflow"
import "reactflow/dist/style.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Database, GitBranch, Users, Calendar, Search, Zap, RefreshCw } from "lucide-react"

// カスタムノードタイプ
function TaskGraphNode({ data }: { data: any }) {
  const getNodeColor = (type: string, isHighlighted = false) => {
    if (isHighlighted) {
      return "bg-yellow-200 border-yellow-500 shadow-lg"
    }
    switch (type) {
      case "task":
        return "bg-blue-100 border-blue-300"
      case "resource":
        return "bg-green-100 border-green-300"
      case "milestone":
        return "bg-purple-100 border-purple-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "task":
        return <Calendar className="w-4 h-4" />
      case "resource":
        return <Users className="w-4 h-4" />
      case "milestone":
        return <GitBranch className="w-4 h-4" />
      default:
        return <Database className="w-4 h-4" />
    }
  }

  return (
    <div
      className={`${getNodeColor(data.type, data.isHighlighted)} border-2 rounded-lg p-3 min-w-[120px] shadow-sm hover:shadow-md transition-all`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {getIcon(data.type)}
          <span className="font-semibold text-sm">{data.label}</span>
        </div>
        {data.properties && (
          <div className="text-xs text-muted-foreground">
            {Object.entries(data.properties).map(([key, value]) => (
              <div key={key}>
                {key}: {value as string}
              </div>
            ))}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

const nodeTypes = {
  graphNode: TaskGraphNode,
}

const initialNodes: Node[] = [
  {
    id: "t1",
    type: "graphNode",
    data: {
      label: "要件定義",
      type: "task",
      properties: { status: "完了", priority: "High", id: "TASK-001" },
      isHighlighted: false,
    },
    position: { x: 250, y: 50 },
  },
  {
    id: "r1",
    type: "graphNode",
    data: {
      label: "田中",
      type: "resource",
      properties: { capacity: "8h/day", utilization: "80%", id: "RES-001" },
      isHighlighted: false,
    },
    position: { x: 100, y: 150 },
  },
  {
    id: "t2",
    type: "graphNode",
    data: {
      label: "UI設計",
      type: "task",
      properties: { status: "進行中", priority: "High", id: "TASK-002" },
      isHighlighted: false,
    },
    position: { x: 250, y: 200 },
  },
  {
    id: "t3",
    type: "graphNode",
    data: {
      label: "API実装",
      type: "task",
      properties: { status: "未開始", priority: "Critical", id: "TASK-003" },
      isHighlighted: false,
    },
    position: { x: 400, y: 200 },
  },
  {
    id: "r2",
    type: "graphNode",
    data: {
      label: "佐藤",
      type: "resource",
      properties: { capacity: "8h/day", utilization: "60%", id: "RES-002" },
      isHighlighted: false,
    },
    position: { x: 250, y: 350 },
  },
  {
    id: "m1",
    type: "graphNode",
    data: {
      label: "Phase 1完了",
      type: "milestone",
      properties: { date: "2024-01-20", id: "MILE-001" },
      isHighlighted: false,
    },
    position: { x: 550, y: 200 },
  },
]

const initialEdges: Edge[] = [
  { id: "e1", source: "t1", target: "t2", label: "depends_on", animated: false },
  { id: "e2", source: "t1", target: "t3", label: "depends_on", animated: false },
  { id: "e3", source: "r1", target: "t1", label: "assigned_to", animated: false },
  { id: "e4", source: "r2", target: "t2", label: "assigned_to", animated: false },
  { id: "e5", source: "t2", target: "m1", label: "contributes_to", animated: false },
  { id: "e6", source: "t3", target: "m1", label: "contributes_to", animated: false },
]

export default function GraphView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [searchQuery, setSearchQuery] = useState("")
  const [cypherQuery, setCypherQuery] = useState("")
  const [queryResult, setQueryResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Neo4jからデータを動的取得（モック）
  const fetchFromNeo4j = async () => {
    setIsLoading(true)
    // モックAPI呼び出し
    setTimeout(() => {
      setQueryResult("Successfully fetched 6 nodes and 6 relationships from Neo4j")
      setIsLoading(false)
    }, 1500)
  }

  // クリティカルパスハイライト
  const highlightCriticalPath = () => {
    const criticalNodeIds = ["t1", "t3", "m1"] // クリティカルパス上のノード
    const criticalEdgeIds = ["e2", "e6"] // クリティカルパス上のエッジ

    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: criticalNodeIds.includes(node.id),
        },
      })),
    )

    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: criticalEdgeIds.includes(edge.id),
        style: criticalEdgeIds.includes(edge.id)
          ? { stroke: "#ef4444", strokeWidth: 3 }
          : { stroke: "#6b7280", strokeWidth: 1 },
      })),
    )
  }

  // ノード検索
  const searchNodes = (query: string) => {
    if (!query) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, isHighlighted: false },
        })),
      )
      return
    }

    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: node.data.label.toLowerCase().includes(query.toLowerCase()),
        },
      })),
    )
  }

  // Cypherクエリ実行（モック）
  const executeCypherQuery = async () => {
    if (!cypherQuery) return

    setIsLoading(true)
    setTimeout(() => {
      setQueryResult(`Query executed: ${cypherQuery}\nReturned 3 records`)
      setIsLoading(false)
    }, 1000)
  }

  // ドラッグ&ドロップで依存関係追加
  const onConnect = (params: Edge | Connection) => {
    const newEdge = {
      ...params,
      label: "new_dependency",
      animated: true,
      style: { stroke: "#10b981", strokeWidth: 2 },
    }
    setEdges((eds) => addEdge(newEdge, eds))

    // Neo4jに書き込み（モック）
    console.log("Writing new dependency to Neo4j:", params)
  }

  useEffect(() => {
    searchNodes(searchQuery)
  }, [searchQuery])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>強化されたタスク依存グラフ (Neo4j)</CardTitle>
              <CardDescription>動的取得・クリティカルパス・検索・依存関係編集機能</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchFromNeo4j} size="sm" variant="outline" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Neo4j同期
              </Button>
              <Button onClick={highlightCriticalPath} size="sm" variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                クリティカルパス
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 検索バー */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ノードを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="h-[500px] border rounded-lg">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      {/* Cypherクエリ実行パネル */}
      <Card>
        <CardHeader>
          <CardTitle>Neo4j Cypherクエリ実行</CardTitle>
          <CardDescription>リアルタイムでGraphDBにクエリを実行</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="MATCH (n:Task) RETURN n LIMIT 10"
                value={cypherQuery}
                onChange={(e) => setCypherQuery(e.target.value)}
                className="flex-1"
                rows={3}
              />
              <Button onClick={executeCypherQuery} disabled={isLoading || !cypherQuery}>
                <Database className="w-4 h-4 mr-2" />
                実行
              </Button>
            </div>

            {queryResult && (
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-semibold mb-2">実行結果:</h4>
                <pre className="text-sm whitespace-pre-wrap">{queryResult}</pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* グラフ統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">ノード数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nodes.length}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">タスク: {nodes.filter((n) => n.data.type === "task").length}</Badge>
              <Badge variant="outline">リソース: {nodes.filter((n) => n.data.type === "resource").length}</Badge>
              <Badge variant="outline">マイルストーン: {nodes.filter((n) => n.data.type === "milestone").length}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">依存関係</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{edges.length}</div>
            <div className="text-sm text-muted-foreground mt-2">平均依存度: 1.2</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">クリティカルパス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground mt-2">最長: 9日間</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">検索結果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {searchQuery ? nodes.filter((n) => n.data.isHighlighted).length : 0}
            </div>
            <div className="text-sm text-muted-foreground mt-2">マッチしたノード</div>
          </CardContent>
        </Card>
      </div>

      {/* Cypher クエリ例 */}
      <Card>
        <CardHeader>
          <CardTitle>Neo4j Cypher クエリ例</CardTitle>
          <CardDescription>よく使用されるグラフクエリパターン</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-semibold mb-2">クリティカルパス抽出</h4>
              <code className="text-sm">
                {"MATCH path = (start:Task)-[:DEPENDS_ON*]->(end:Task)"}
                <br />
                {"WHERE NOT (start)<-[:DEPENDS_ON]-()"}
                <br />
                {"RETURN path ORDER BY length(path) DESC LIMIT 1"}
              </code>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 bg-transparent"
                onClick={() =>
                  setCypherQuery(
                    "MATCH path = (start:Task)-[:DEPENDS_ON*]->(end:Task)\nWHERE NOT (start)<-[:DEPENDS_ON]-()\nRETURN path ORDER BY length(path) DESC LIMIT 1",
                  )
                }
              >
                使用
              </Button>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-semibold mb-2">リソース過負荷検出</h4>
              <code className="text-sm">
                {"MATCH (r:Resource)-[:ASSIGNED_TO]->(t:Task)"}
                <br />
                {"WITH r, sum(t.duration) as totalLoad"}
                <br />
                {"WHERE totalLoad > r.capacity"}
                <br />
                {"RETURN r.name, totalLoad, r.capacity"}
              </code>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 bg-transparent"
                onClick={() =>
                  setCypherQuery(
                    "MATCH (r:Resource)-[:ASSIGNED_TO]->(t:Task)\nWITH r, sum(t.duration) as totalLoad\nWHERE totalLoad > r.capacity\nRETURN r.name, totalLoad, r.capacity",
                  )
                }
              >
                使用
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
