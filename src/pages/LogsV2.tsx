import {
  BugOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
  WarningFilled,
} from '@ant-design/icons'
import { Column } from '@ant-design/charts'
import { Button, Checkbox, Input, Select, Space, Switch, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { Panel, StatCard } from '../components/ui'
import '../styles/logs-v2.css'

type Level = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

type LogRow = {
  key: string
  time: string
  level: Level
  service: string
  content: string
  detail: Record<string, string>
}

const levelTone: Record<Level, string> = {
  INFO: 'blue',
  WARN: 'gold',
  ERROR: 'red',
  DEBUG: 'purple',
}

const services = [
  { name: 'mall-frontend', count: 3240, checked: true },
  { name: 'pay-service', count: 2180, checked: true },
  { name: 'user-service', count: 1860, checked: true },
  { name: 'order-service', count: 2540, checked: true },
  { name: 'product-service', count: 1420, checked: false },
  { name: 'notify-service', count: 980, checked: false },
]

const events = [
  {
    type: 'error' as const,
    title: 'order-service 数据库连接超时',
    time: '2 分钟前',
    icon: <CloseCircleFilled />,
  },
  {
    type: 'ok' as const,
    title: 'mall-frontend v2.1.0 部署成功',
    time: '8 分钟前',
    icon: <CheckCircleFilled />,
  },
  {
    type: 'warn' as const,
    title: 'pay-service 慢查询增多',
    time: '15 分钟前',
    icon: <WarningFilled />,
  },
  {
    type: 'info' as const,
    title: 'user-service 扩容完成',
    time: '32 分钟前',
    icon: <InfoCircleFilled />,
  },
]

const seedLogs: LogRow[] = [
  {
    key: '1',
    time: '09:58:12.421',
    level: 'ERROR',
    service: 'order-service',
    content: 'Database connection timeout after 3000ms',
    detail: {
      timestamp: '2024-04-22T09:58:12.421Z',
      level: 'ERROR',
      service: 'order-service',
      traceId: 'tr_9812af',
      spanId: 'sp_22ac',
      orderId: 'ORD-88421',
      message: 'Database connection timeout after 3000ms',
      exception: 'java.sql.SQLTimeoutException',
      env: 'prod',
      host: 'order-2',
      thread: 'http-nio-8080',
    },
  },
  {
    key: '2',
    time: '09:57:48.110',
    level: 'WARN',
    service: 'pay-service',
    content: 'Slow query detected · 1.8s · payments.findById',
    detail: {
      timestamp: '2024-04-22T09:57:48.110Z',
      level: 'WARN',
      service: 'pay-service',
      traceId: 'tr_77c1',
      message: 'Slow query detected · 1.8s',
      env: 'prod',
      host: 'pay-1',
    },
  },
  {
    key: '3',
    time: '09:57:21.002',
    level: 'INFO',
    service: 'mall-frontend',
    content: 'Asset prefetch completed · chunks=14',
    detail: {
      timestamp: '2024-04-22T09:57:21.002Z',
      level: 'INFO',
      service: 'mall-frontend',
      message: 'Asset prefetch completed',
      env: 'prod',
      host: 'fe-cdn',
    },
  },
  {
    key: '4',
    time: '09:56:55.884',
    level: 'DEBUG',
    service: 'user-service',
    content: 'cache hit · user:profile:10086',
    detail: {
      timestamp: '2024-04-22T09:56:55.884Z',
      level: 'DEBUG',
      service: 'user-service',
      message: 'cache hit',
      env: 'prod',
      host: 'user-3',
    },
  },
  {
    key: '5',
    time: '09:56:10.220',
    level: 'INFO',
    service: 'order-service',
    content: 'Order created successfully · ORD-88420',
    detail: {
      timestamp: '2024-04-22T09:56:10.220Z',
      level: 'INFO',
      service: 'order-service',
      orderId: 'ORD-88420',
      message: 'Order created successfully',
      env: 'prod',
      host: 'order-1',
    },
  },
]

const trendHours = ['09:00', '09:15', '09:30', '09:45', '10:00']
const trendData = trendHours.flatMap((h) => [
  { time: h, level: 'INFO', count: 40 + Math.round(Math.random() * 30) },
  { time: h, level: 'WARN', count: 8 + Math.round(Math.random() * 12) },
  { time: h, level: 'ERROR', count: 2 + Math.round(Math.random() * 8) },
  { time: h, level: 'DEBUG', count: 5 + Math.round(Math.random() * 10) },
])

export default function LogsV2Page() {
  const [live, setLive] = useState(true)
  const [autoScroll, setAutoScroll] = useState(true)
  const [levelFilter, setLevelFilter] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [svcQuery, setSvcQuery] = useState('')
  const [checked, setChecked] = useState(services.map((s) => s.checked))
  const [lines, setLines] = useState(seedLogs)
  const [selectedKey, setSelectedKey] = useState(seedLogs[0].key)

  useEffect(() => {
    if (!live) return
    const t = setInterval(() => {
      const now = new Date()
      const stamp = `${now.toTimeString().slice(0, 8)}.${String(now.getMilliseconds()).padStart(3, '0')}`
      const levels: Level[] = ['INFO', 'WARN', 'ERROR', 'DEBUG']
      const level = levels[Math.floor(Math.random() * levels.length)]
      const service = services[Math.floor(Math.random() * services.length)].name
      const row: LogRow = {
        key: `${Date.now()}`,
        time: stamp,
        level,
        service,
        content: `mock stream event · ${level.toLowerCase()} · heartbeat`,
        detail: {
          timestamp: now.toISOString(),
          level,
          service,
          message: 'mock stream event',
          env: 'prod',
          host: `${service}-1`,
          thread: 'worker',
        },
      }
      setLines((prev) => [row, ...prev].slice(0, 60))
      if (autoScroll) setSelectedKey(row.key)
    }, 2500)
    return () => clearInterval(t)
  }, [live, autoScroll])

  const filtered = useMemo(() => {
    const enabled = services.filter((_, i) => checked[i]).map((s) => s.name)
    return lines.filter((l) => {
      if (enabled.length && !enabled.includes(l.service)) return false
      if (levelFilter !== 'all' && l.level !== levelFilter) return false
      if (keyword && !`${l.content}${l.service}${l.level}`.toLowerCase().includes(keyword.toLowerCase()))
        return false
      return true
    })
  }, [lines, checked, levelFilter, keyword])

  const selected = filtered.find((l) => l.key === selectedKey) ?? filtered[0]

  const columns: ColumnsType<LogRow> = [
    { title: '时间', dataIndex: 'time', width: 120 },
    {
      title: '级别',
      dataIndex: 'level',
      width: 90,
      render: (v: Level) => <Tag color={levelTone[v]}>{v}</Tag>,
    },
    { title: '服务', dataIndex: 'service', width: 140 },
    { title: '内容', dataIndex: 'content', ellipsis: true },
  ]

  const chartConfig = {
    data: trendData,
    xField: 'time',
    yField: 'count',
    colorField: 'level',
    stack: true,
    height: 220,
    legend: { position: 'top-right' as const },
    axis: { y: { title: false }, x: { title: false } },
    style: { maxWidth: 28 },
    scale: {
      color: {
        domain: ['INFO', 'WARN', 'ERROR', 'DEBUG'],
        range: ['#2563eb', '#d97706', '#dc2626', '#7c3aed'],
      },
    },
  }

  return (
    <div className="logs2-page">
      <div className="logs2-stats">
        <StatCard title="全部日志" value="12,568" delta="12% 近 1 小时" deltaUp={false} />
        <StatCard title="INFO" value="8,421" delta="8% 近 1 小时" deltaUp={false} icon={<InfoCircleFilled />} />
        <StatCard title="WARN" value="2,341" delta="12% 近 1 小时" icon={<WarningFilled />} />
        <StatCard title="ERROR" value="1,240" delta="18% 近 1 小时" deltaUp={false} icon={<CloseCircleFilled />} />
        <StatCard title="DEBUG" value={566} delta="24% 近 1 小时" deltaUp={false} icon={<BugOutlined />} />
      </div>

      <div className="logs2-mid">
        <Panel
          title="日志趋势"
          extra={
            <Select
              defaultValue="1h"
              style={{ width: 120 }}
              options={[
                { value: '1h', label: '近 1 小时' },
                { value: '6h', label: '近 6 小时' },
                { value: '24h', label: '近 24 小时' },
              ]}
            />
          }
        >
          <Column {...chartConfig} />
        </Panel>

        <Panel
          title="服务列表"
          extra={
            <Button type="link" size="small" onClick={() => message.info('管理服务（演示）')}>
              管理服务 →
            </Button>
          }
        >
          <Input.Search
            allowClear
            placeholder="搜索服务名称..."
            value={svcQuery}
            onChange={(e) => setSvcQuery(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <ul className="logs2-svc-list">
            {services.map((s, i) => {
              if (svcQuery && !s.name.includes(svcQuery)) return null
              return (
                <li key={s.name}>
                  <Checkbox
                    checked={checked[i]}
                    onChange={(e) => {
                      const next = [...checked]
                      next[i] = e.target.checked
                      setChecked(next)
                    }}
                  >
                    {s.name}
                  </Checkbox>
                  <span>{s.count.toLocaleString()}</span>
                </li>
              )
            })}
          </ul>
        </Panel>

        <Panel title="最近事件">
          <ul className="logs2-events">
            {events.map((e) => (
              <li key={e.title} className={`is-${e.type}`}>
                <span className="logs2-event-icon">{e.icon}</span>
                <div>
                  <strong>{e.title}</strong>
                  <em>{e.time}</em>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="logs2-bottom">
        <Panel title="实时日志流">
          <div className="logs2-stream-bar">
            <span className="logs2-switch">
              实时模式 <Switch size="small" checked={live} onChange={setLive} />
            </span>
            <span className="logs2-switch">
              自动滚动 <Switch size="small" checked={autoScroll} onChange={setAutoScroll} />
            </span>
            <Select
              value={levelFilter}
              onChange={setLevelFilter}
              style={{ width: 120 }}
              options={[
                { value: 'all', label: '全部级别' },
                { value: 'INFO', label: 'INFO' },
                { value: 'WARN', label: 'WARN' },
                { value: 'ERROR', label: 'ERROR' },
                { value: 'DEBUG', label: 'DEBUG' },
              ]}
            />
            <Input.Search
              allowClear
              placeholder="关键词"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: 180 }}
            />
          </div>
          <Table
            size="small"
            pagination={false}
            rowKey="key"
            columns={columns}
            dataSource={filtered}
            rowClassName={(row) => (row.key === selected?.key ? 'logs2-row-active' : '')}
            onRow={(row) => ({
              onClick: () => setSelectedKey(row.key),
            })}
            scroll={{ y: 320 }}
          />
        </Panel>

        <Panel
          title="日志详情"
          extra={
            <Space>
              <Button
                size="small"
                onClick={() => {
                  setLines(seedLogs)
                  setSelectedKey(seedLogs[0].key)
                  message.success('已清空实时追加')
                }}
              >
                清空
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  if (!selected) return
                  navigator.clipboard?.writeText(JSON.stringify(selected.detail, null, 2))
                  message.success('已复制详情 JSON')
                }}
              >
                复制
              </Button>
            </Space>
          }
        >
          {selected ? (
            <pre className="logs2-json">{JSON.stringify(selected.detail, null, 2)}</pre>
          ) : (
            <div className="logs2-empty">选择一条日志查看详情</div>
          )}
        </Panel>
      </div>
    </div>
  )
}
