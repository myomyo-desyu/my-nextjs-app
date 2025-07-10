"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Save, RotateCcw, Plus, Trash2, Download, Upload, Eye, Zap } from "lucide-react"

interface Bucket {
  id: string
  name: string
  startTime: string
  endTime: string
  capacity: number
  enabled: boolean
}

export default function RuleSettings() {
  const [buckets, setBuckets] = useState<Bucket[]>([
    { id: "1", name: "午前", startTime: "09:00", endTime: "12:00", capacity: 80, enabled: true },
    { id: "2", name: "午後", startTime: "13:00", endTime: "17:00", capacity: 90, enabled: true },
    { id: "3", name: "夜間", startTime: "18:00", endTime: "21:00", capacity: 50, enabled: false },
  ])

  const [optimizationSettings, setOptimizationSettings] = useState({
    priorityWeight: 70,
    deadlineWeight: 80,
    resourceWeight: 60,
    dependencyWeight: 90,
    enableParallelization: true,
    maxIterations: 1000,
    timeLimit: 300,
  })

  const [yamlConfig, setYamlConfig] = useState(`# TaskFlow AI 制約設定テンプレート
constraints:
  buckets:
    - name: "午前"
      start: "09:00"
      end: "12:00"
      capacity: 80
    - name: "午後"
      start: "13:00"
      end: "17:00"
      capacity: 90
  
  optimization:
    priority_weight: 70
    deadline_weight: 80
    resource_weight: 60
    dependency_weight: 90
    
  solver:
    max_iterations: 1000
    time_limit: 300
    enable_parallel: true`)

  const [previewSchedule, setPreviewSchedule] = useState<any[]>([
    { task: "要件定義", start: "09:00", end: "12:00", bucket: "午前", assignee: "田中" },
    { task: "UI設計", start: "13:00", end: "15:00", bucket: "午後", assignee: "佐藤" },
    { task: "API実装", start: "15:00", end: "17:00", bucket: "午後", assignee: "鈴木" },
  ])
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  const addBucket = () => {
    const newBucket: Bucket = {
      id: Date.now().toString(),
      name: "新しいバケット",
      startTime: "09:00",
      endTime: "17:00",
      capacity: 100,
      enabled: true,
    }
    setBuckets([...buckets, newBucket])
  }

  const removeBucket = (id: string) => {
    setBuckets(buckets.filter((bucket) => bucket.id !== id))
  }

  const updateBucket = (id: string, updates: Partial<Bucket>) => {
    setBuckets(buckets.map((bucket) => (bucket.id === id ? { ...bucket, ...updates } : bucket)))
  }

  const handleSave = () => {
    console.log("Settings saved:", { buckets, optimizationSettings })
  }

  const handleReset = () => {
    setBuckets([
      { id: "1", name: "午前", startTime: "09:00", endTime: "12:00", capacity: 80, enabled: true },
      { id: "2", name: "午後", startTime: "13:00", endTime: "17:00", capacity: 90, enabled: true },
    ])
    setOptimizationSettings({
      priorityWeight: 70,
      deadlineWeight: 80,
      resourceWeight: 60,
      dependencyWeight: 90,
      enableParallelization: true,
      maxIterations: 1000,
      timeLimit: 300,
    })
  }

  const handleYamlImport = () => {
    try {
      // YAML解析のモック
      console.log("YAML imported:", yamlConfig)
    } catch (error) {
      console.error("YAML import error:", error)
    }
  }

  const handleYamlExport = () => {
    const yamlData = `# TaskFlow AI 制約設定
constraints:
  buckets:
${buckets
  .map(
    (bucket) => `    - name: "${bucket.name}"
      start: "${bucket.startTime}"
      end: "${bucket.endTime}"
      capacity: ${bucket.capacity}
      enabled: ${bucket.enabled}`,
  )
  .join("\n")}
  
  optimization:
    priority_weight: ${optimizationSettings.priorityWeight}
    deadline_weight: ${optimizationSettings.deadlineWeight}
    resource_weight: ${optimizationSettings.resourceWeight}
    dependency_weight: ${optimizationSettings.dependencyWeight}
    
  solver:
    max_iterations: ${optimizationSettings.maxIterations}
    time_limit: ${optimizationSettings.timeLimit}
    enable_parallel: ${optimizationSettings.enableParallelization}`

    setYamlConfig(yamlData)
  }

  const handlePreviewUpdate = () => {
    setIsPreviewLoading(true)
    setTimeout(() => {
      // モックプレビュー更新
      setPreviewSchedule([
        { task: "要件定義", start: "09:00", end: "11:30", bucket: "午前", assignee: "田中" },
        { task: "UI設計", start: "13:00", end: "15:30", bucket: "午後", assignee: "佐藤" },
        { task: "API実装", start: "15:30", end: "17:00", bucket: "午後", assignee: "鈴木" },
        { task: "テスト", start: "09:00", end: "10:00", bucket: "午前", assignee: "山田" },
      ])
      setIsPreviewLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>拡張スケジューラ設定</CardTitle>
              <CardDescription>OR-Tools最適化エンジン、YAML設定、リアルタイムプレビュー</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                リセット
              </Button>
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buckets" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="buckets">バケット設定</TabsTrigger>
              <TabsTrigger value="optimization">最適化パラメータ</TabsTrigger>
              <TabsTrigger value="yaml">YAML設定</TabsTrigger>
              <TabsTrigger value="preview">リアルタイムプレビュー</TabsTrigger>
            </TabsList>

            <TabsContent value="buckets" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">時間バケット定義</h3>
                <Button onClick={addBucket} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  バケット追加
                </Button>
              </div>

              <div className="space-y-4">
                {buckets.map((bucket) => (
                  <Card key={bucket.id}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div className="space-y-2">
                          <Label>名前</Label>
                          <Input
                            value={bucket.name}
                            onChange={(e) => updateBucket(bucket.id, { name: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>開始時刻</Label>
                          <Input
                            type="time"
                            value={bucket.startTime}
                            onChange={(e) => updateBucket(bucket.id, { startTime: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>終了時刻</Label>
                          <Input
                            type="time"
                            value={bucket.endTime}
                            onChange={(e) => updateBucket(bucket.id, { endTime: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>容量 ({bucket.capacity}%)</Label>
                          <Slider
                            value={[bucket.capacity]}
                            onValueChange={(value) => updateBucket(bucket.id, { capacity: value[0] })}
                            max={150}
                            min={0}
                            step={10}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>有効</Label>
                          <Switch
                            checked={bucket.enabled}
                            onCheckedChange={(enabled) => updateBucket(bucket.id, { enabled })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>操作</Label>
                          <Button onClick={() => removeBucket(bucket.id)} variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-6">
              <h3 className="text-lg font-semibold">最適化重み設定</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>優先度重み ({optimizationSettings.priorityWeight}%)</Label>
                    <Slider
                      value={[optimizationSettings.priorityWeight]}
                      onValueChange={(value) =>
                        setOptimizationSettings((prev) => ({ ...prev, priorityWeight: value[0] }))
                      }
                      max={100}
                      min={0}
                      step={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>締切重み ({optimizationSettings.deadlineWeight}%)</Label>
                    <Slider
                      value={[optimizationSettings.deadlineWeight]}
                      onValueChange={(value) =>
                        setOptimizationSettings((prev) => ({ ...prev, deadlineWeight: value[0] }))
                      }
                      max={100}
                      min={0}
                      step={5}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>リソース重み ({optimizationSettings.resourceWeight}%)</Label>
                    <Slider
                      value={[optimizationSettings.resourceWeight]}
                      onValueChange={(value) =>
                        setOptimizationSettings((prev) => ({ ...prev, resourceWeight: value[0] }))
                      }
                      max={100}
                      min={0}
                      step={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>依存関係重み ({optimizationSettings.dependencyWeight}%)</Label>
                    <Slider
                      value={[optimizationSettings.dependencyWeight]}
                      onValueChange={(value) =>
                        setOptimizationSettings((prev) => ({ ...prev, dependencyWeight: value[0] }))
                      }
                      max={100}
                      min={0}
                      step={5}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <h3 className="text-lg font-semibold">ソルバー設定</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>最大反復回数</Label>
                  <Input
                    type="number"
                    value={optimizationSettings.maxIterations}
                    onChange={(e) =>
                      setOptimizationSettings((prev) => ({ ...prev, maxIterations: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>時間制限 (秒)</Label>
                  <Input
                    type="number"
                    value={optimizationSettings.timeLimit}
                    onChange={(e) =>
                      setOptimizationSettings((prev) => ({ ...prev, timeLimit: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>並列化有効</Label>
                  <Switch
                    checked={optimizationSettings.enableParallelization}
                    onCheckedChange={(enabled) =>
                      setOptimizationSettings((prev) => ({ ...prev, enableParallelization: enabled }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="yaml" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">YAML制約テンプレート</h3>
                <div className="flex gap-2">
                  <Button onClick={handleYamlExport} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    エクスポート
                  </Button>
                  <Button onClick={handleYamlImport} variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    インポート
                  </Button>
                </div>
              </div>

              <Textarea
                value={yamlConfig}
                onChange={(e) => setYamlConfig(e.target.value)}
                className="font-mono text-sm"
                rows={20}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">テンプレート</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">標準制約設定</div>
                    <Badge variant="outline" className="mt-2">
                      Default
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">カスタム設定</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">プロジェクト固有</div>
                    <Badge variant="outline" className="mt-2">
                      Custom
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">バリデーション</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">設定検証</div>
                    <Badge variant="default" className="mt-2">
                      Valid
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">リアルタイムプレビュー</h3>
                <Button onClick={handlePreviewUpdate} disabled={isPreviewLoading} size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreviewLoading ? "更新中..." : "プレビュー更新"}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">サンプルスケジュール</CardTitle>
                  <CardDescription>現在の設定に基づく最適化結果</CardDescription>
                </CardHeader>
                <CardContent>
                  {isPreviewLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      <span className="ml-2">最適化計算中...</span>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>タスク</TableHead>
                          <TableHead>開始時刻</TableHead>
                          <TableHead>終了時刻</TableHead>
                          <TableHead>バケット</TableHead>
                          <TableHead>担当者</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewSchedule.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.task}</TableCell>
                            <TableCell>{item.start}</TableCell>
                            <TableCell>{item.end}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.bucket}</Badge>
                            </TableCell>
                            <TableCell>{item.assignee}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      最適化スコア
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87.5</div>
                    <div className="text-sm text-muted-foreground">100点満点</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">リソース効率</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92%</div>
                    <div className="text-sm text-muted-foreground">使用率</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">制約違反</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">件</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
