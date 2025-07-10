"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Bot, User, Search, Database, Brain, ExternalLink, Zap } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: string[]
  vectorResults?: Array<{ task: string; similarity: number; description: string }>
  links?: Array<{ title: string; url: string }>
}

const mockResponses: {
  [key: string]: {
    content: string
    sources: string[]
    vectorResults?: Array<{ task: string; similarity: number; description: string }>
    links?: Array<{ title: string; url: string }>
  }
} = {
  クリティカルパス: {
    content:
      "現在のクリティカルパスは「要件定義 → API実装 → 統合テスト」で、総期間は9日間です。このパス上のAPI実装タスクが2日遅延するリスクがあり、プロジェクト全体の完了が遅れる可能性があります。",
    sources: ["Neo4j Graph DB", "OR-Tools Solver"],
    links: [
      { title: "クリティカルパス詳細", url: "/critical-path/analysis" },
      { title: "リスク軽減策", url: "/risk-mitigation" },
    ],
  },
  最重要タスク: {
    content:
      "現在最も重要なタスクは「API実装」です。優先度がCriticalで、クリティカルパス上にあり、他の3つのタスクがこれに依存しています。担当者の鈴木さんの現在の進捗は30%です。",
    sources: ["Task Priority Vector", "Dependency Graph"],
    links: [{ title: "API実装タスク詳細", url: "/tasks/api-implementation" }],
  },
  締切が近い: {
    content:
      "締切が近いタスクは以下の通りです：\n1. UI設計レビュー (2024-01-12, 残り2日)\n2. API実装 (2024-01-15, 残り5日)\n3. テストケース作成 (2024-01-18, 残り8日)",
    sources: ["Notion Task DB", "Schedule Optimizer"],
  },
  リソース過負荷: {
    content:
      "リソース過負荷の時間帯：\n- 鈴木さん: 1月15-20日 (120%使用率)\n- 田中さん: 1月22-25日 (110%使用率)\n\n推奨対策：API実装タスクの一部を他メンバーに分散、または期限の調整を検討してください。",
    sources: ["Resource Allocation Model", "Capacity Planning"],
  },
  似たタスク: {
    content:
      "Vector DBから類似タスクを検索しました。過去の類似プロジェクトでは、API実装に平均3.5日、UI設計に2.1日かかっています。現在のタスクと類似度の高い事例を参考に、より正確な見積もりが可能です。",
    sources: ["Pinecone Vector DB", "Historical Task Data"],
    vectorResults: [
      { task: "ECサイトAPI実装", similarity: 0.89, description: "RESTful API開発、認証機能含む" },
      { task: "管理画面UI設計", similarity: 0.82, description: "React + TypeScript、レスポンシブ対応" },
      { task: "データベース設計", similarity: 0.76, description: "PostgreSQL、マイグレーション含む" },
    ],
    links: [
      { title: "類似プロジェクト分析", url: "/similar-projects" },
      { title: "ベンチマーク データ", url: "/benchmarks" },
    ],
  },
}

export default function RAGChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "こんにちは！拡張されたRAGシステムです。タスク管理、Vector DB検索、類似タスク分析などについてお聞かせください。Pinecone連携により、より精度の高い回答が可能になりました。",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [vectorSearchQuery, setVectorSearchQuery] = useState("")
  const [vectorResults, setVectorResults] = useState<Array<{ task: string; similarity: number; description: string }>>(
    [],
  )

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // モックレスポンス生成
    setTimeout(() => {
      const key = Object.keys(mockResponses).find((k) => input.includes(k))
      const response = key
        ? mockResponses[key]
        : {
            content:
              "申し訳ございませんが、その質問については現在対応できません。クリティカルパス、最重要タスク、締切、リソース過負荷、似たタスクなどについてお聞きください。",
            sources: [],
          }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        sources: response.sources,
        vectorResults: response.vectorResults,
        links: response.links,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleVectorSearch = async () => {
    if (!vectorSearchQuery.trim()) return

    // モックVector DB検索
    const mockResults = [
      { task: "API実装プロジェクトA", similarity: 0.92, description: "Node.js + Express、JWT認証" },
      { task: "UI設計プロジェクトB", similarity: 0.87, description: "React + Material-UI、ダッシュボード" },
      { task: "データベース設計C", similarity: 0.81, description: "MongoDB、スキーマ設計" },
      { task: "テスト自動化D", similarity: 0.76, description: "Jest + Cypress、E2Eテスト" },
    ]

    setVectorResults(mockResults)
  }

  const quickQuestions = [
    "クリティカルパスを教えて",
    "最重要タスクは？",
    "締切が近いタスクは？",
    "リソース過負荷時間帯は？",
    "似たタスク事例は？",
    "ベンチマーク データを見せて",
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            拡張RAG チャットアシスタント
          </CardTitle>
          <CardDescription>
            Vector DB (Pinecone) + Neo4j + OR-Tools統合。類似タスク検索、ベンチマーク分析、情報源リンク付き回答。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chat" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chat">チャット</TabsTrigger>
              <TabsTrigger value="vector">Vector検索</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              {/* クイック質問 */}
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button key={index} variant="outline" size="sm" onClick={() => setInput(question)}>
                    {question}
                  </Button>
                ))}
              </div>

              {/* チャット履歴 */}
              <ScrollArea className="h-[500px] border rounded-lg p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === "user" ? "bg-blue-500" : "bg-green-500"
                          }`}
                        >
                          {message.type === "user" ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg p-3 ${message.type === "user" ? "bg-blue-500 text-white" : "bg-muted"}`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>

                          {/* Vector検索結果 */}
                          {message.vectorResults && message.vectorResults.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-300">
                              <div className="text-xs font-semibold mb-2 flex items-center gap-1">
                                <Search className="w-3 h-3" />
                                類似タスク検索結果:
                              </div>
                              <div className="space-y-2">
                                {message.vectorResults.map((result, index) => (
                                  <div key={index} className="bg-white/10 rounded p-2">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-sm">{result.task}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        {(result.similarity * 100).toFixed(1)}%
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">{result.description}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 情報源 */}
                          {message.sources && message.sources.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-300">
                              <div className="text-xs text-muted-foreground mb-1">情報源:</div>
                              <div className="flex flex-wrap gap-1">
                                {message.sources.map((source, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    <Database className="w-3 h-3 mr-1" />
                                    {source}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* リンク */}
                          {message.links && message.links.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-300">
                              <div className="text-xs text-muted-foreground mb-1">関連リンク:</div>
                              <div className="space-y-1">
                                {message.links.map((link, index) => (
                                  <Button key={index} variant="ghost" size="sm" className="h-auto p-1 text-xs" asChild>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      {link.title}
                                    </a>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                          RAG処理中... Vector DB検索 + LLM生成
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* 入力エリア */}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="タスク管理について質問してください..."
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="vector" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={vectorSearchQuery}
                  onChange={(e) => setVectorSearchQuery(e.target.value)}
                  placeholder="類似タスクを検索... (例: API実装, UI設計)"
                />
                <Button onClick={handleVectorSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  検索
                </Button>
              </div>

              {vectorResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Vector DB検索結果</CardTitle>
                    <CardDescription>類似度順にソートされたタスク事例</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {vectorResults.map((result, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{result.task}</h4>
                            <Badge variant="outline">類似度: {(result.similarity * 100).toFixed(1)}%</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{result.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* RAG システム情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="w-4 h-4" />
              Vector DB
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">埋め込み検索・類似タスク発見</div>
            <Badge variant="outline" className="mt-2">
              Pinecone Connected
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="w-4 h-4" />
              Graph DB
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">依存関係・構造クエリ</div>
            <Badge variant="outline" className="mt-2">
              Neo4j Active
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="w-4 h-4" />
              LLM + RAG
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">コンテキスト統合・回答生成</div>
            <Badge variant="outline" className="mt-2">
              GPT-4 Enhanced
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              リアルタイム
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">動的データ取得・更新</div>
            <Badge variant="outline" className="mt-2">
              WebSocket Ready
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
