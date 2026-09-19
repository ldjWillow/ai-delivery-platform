import {
  AlertOutlined,
  CheckCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
  PlusOutlined,
  WarningFilled,
} from '@ant-design/icons'
import { Column } from '@ant-design/charts'
import { Avatar, Button, Segmented, Select, Switch, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Panel, StatCard } from '../components/ui'
import '../styles/alert.css'

type Level = '严重' | '重要' | '一般'
type AlertStatus = '未确认' | '处理中' | '已确认'

type ActiveAlert = {
  key: string
  time: string
  level: Level
  title: string
  target: string
  duration: string
  status: AlertStatus
}

const activeAlerts: ActiveAlert[] = [
  {
    key: '1',
    time: '10:28',
    level: '严重',
    title: 'Staging Redis 连接数接近上限',
    target: 'mall / redis',
    duration: '8m',
    status: '未确认',
  },
  {
    key: '2',
    time: '10:12',
    level: '重要',
    title: 'user-service 实例 1/2 异常',
    target: 'user / k8s',
    duration: '32m',
    status: '处理中',
  },
  {
    key: '3',
    time: '09:55',
    level: '一般',
    title: '构建失败：admin-管理后台',
    target: 'admin / ci',
    duration: '1h',
    status: '未确认',
  },
  {
    key: '4',
    time: '09:40',
    level: '重要',
    title: 'Production 部署失败 #425',
    target: 'order / deploy',
    duration: '1.5h',
    status: '处理中',
  },
  {
    key: '5',
    time: '09:18',
    level: '严重',
    title: '支付回调超时率升高',
    target: 'pay / gateway',
    duration: '2h',
    status: '未确认',
  },
  {
    key: '6',
    time: '08:52',
    level: '一般',
    title: '磁盘使用率超过 80%',
    target: 'infra / node-3',
    duration: '3h',
    status: '已确认',
  },
]

const rulesSeed = [
  { key: 'r1', name: 'Redis 连接水位', target: 'mall-redis', cond: '> 90%', on: true },
  { key: 'r2', name: '服务实例健康检查', target: 'user-service', cond: '连续失败 ≥3', on: true },
  { key: 'r3', name: '构建失败通知', target: 'CI Pipeline', cond: 'job failed', on: true },
  { key: 'r4', name: '生产部署失败', target: 'Coolify', cond: 'deploy error', on: true },
  { key: 'r5', name: 'API 错误率', target: 'order-api', cond: '5xx > 2%', on: false },
]

const channelsSeed = [
  { key: 'c1', name: '钉钉运维群', type: '钉钉', receiver: '运维值班群', on: true },
  { key: 'c2', name: '企微交付群', type: '企业微信', receiver: '交付协作群', on: true },
  { key: 'c3', name: '值班邮箱', type: '邮件', receiver: 'oncall@acme.io', on: true },
  { key: 'c4', name: '短信网关', type: '短信', receiver: '值班手机', on: false },
]

const recentEvents = [
  {
    time: '10:28:12',
    state: 'FIRING' as const,
    text: 'Staging Redis 连接数接近上限',
    svc: 'mall-redis',
  },
  {
    time: '10:15:03',
    state: 'RESOLVED' as const,
    text: 'order-service 延迟恢复正常',
    svc: 'order-service',
  },
  {
    time: '10:12:41',
    state: 'FIRING' as const,
    text: 'user-service 实例异常',
    svc: 'user-service',
  },
  {
    time: '09:58:20',
    state: 'RESOLVED' as const,
    text: 'CI 队列积压已清空',
    svc: 'actions',
  },
  {
    time: '09:40:08',
    state: 'FIRING' as const,
    text: 'Production 部署失败 #425',
    svc: 'coolify',
  },
]

const levelColor: Record<Level, string> = {
  严重: 'red',
  重要: 'gold',
  一般: 'blue',
}

const statusDot: Record<AlertStatus, string> = {
  未确认: 'danger',
  处理中: 'running',
  已确认: 'ok',
}

const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
const trendData = hours.flatMap((h) => [
  { time: h, level: '严重', count: 1 + Math.round(Math.random() * 3) },
  { time: h, level: '重要', count: 2 + Math.round(Math.random() * 5) },
  { time: h, level: '一般', count: 3 + Math.round(Math.random() * 6) },
])

const linkExtra = (label: string, onClick: () => void) => (
  <Button type="link" size="small" onClick={onClick}>
    {label}
  </Button>
)

export default function AlertPage() {
  const [range, setRange] = useState('24h')
  const [project, setProject] = useState('all')
  const [rows, setRows] = useState(activeAlerts)
  const [rules, setRules] = useState(rulesSeed)
  const [channels, setChannels] = useState(channelsSeed)

  const columns: ColumnsType<ActiveAlert> = useMemo(
    () => [
      { title: '时间', dataIndex: 'time', width: 72 },
      {
        title: '级别',
        dataIndex: 'level',
        width: 80,
        render: (v: Level) => <Tag color={levelColor[v]}>{v}</Tag>,
      },
      { title: '标题', dataIndex: 'title', ellipsis: true },
      { title: '项目/服务', dataIndex: 'target', width: 120, ellipsis: true },
      { title: '持续', dataIndex: 'duration', width: 64 },
      {
        title: '状态',
        dataIndex: 'status',
        width: 88,
        render: (v: AlertStatus) => (
          <span className="alert-status">
            <i className={`status-dot ${statusDot[v]}`} />
            {v}
          </span>
        ),
      },
      {
        title: '操作',
        width: 72,
        render: (_, row) => (
          <Button
            type="link"
            size="small"
            onClick={() => {
              setRows((prev) =>
                prev.map((a) => (a.key === row.key ? { ...a, status: '处理中' } : a)),
              )
              message.success(`已开始处理 ${row.title}`)
            }}
          >
            处理
          </Button>
        ),
      },
    ],
    [],
  )

  const chartConfig = {
    data: trendData,
    xField: 'time',
    yField: 'count',
    colorField: 'level',
    stack: true,
    height: 220,
    legend: { position: 'top-right' as const },
    axis: { y: { title: false }, x: { title: false } },
    style: { maxWidth: 36 },
    scale: {
      color: {
        domain: ['严重', '重要', '一般'],
        range: ['#dc2626', '#d97706', '#2563eb'],
      },
    },
  }

  return (
    <div className="alert-page">
      <div className="alert-toolbar">
        <div className="alert-toolbar-left">
          <span>全部项目</span>
          <Select
            value={project}
            onChange={setProject}
            style={{ width: 140 }}
            options={[
              { value: 'all', label: 'all' },
              { value: 'mall', label: 'mall-电商平台' },
              { value: 'pay', label: 'pay-支付服务' },
              { value: 'user', label: 'user-用户中心' },
            ]}
          />
        </div>
        <Segmented
          value={range}
          onChange={(v) => setRange(String(v))}
          options={[
            { value: '1h', label: '近1小时' },
            { value: '24h', label: '近24小时' },
            { value: '7d', label: '近7天' },
            { value: '30d', label: '近30天' },
          ]}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => message.info('新建告警规则（演示）')}
        >
          新建告警规则
        </Button>
      </div>

      <div className="alert-stats">
        <StatCard
          title="当前告警总数"
          value={18}
          delta="6 较上期"
          deltaUp={false}
          icon={<AlertOutlined />}
        />
        <StatCard
          title="严重告警"
          value={3}
          delta="2 较上期"
          deltaUp={false}
          icon={<ExclamationCircleFilled style={{ color: '#dc2626' }} />}
        />
        <StatCard
          title="重要告警"
          value={7}
          delta="1 较上期"
          deltaUp={false}
          icon={<WarningFilled style={{ color: '#d97706' }} />}
        />
        <StatCard
          title="一般告警"
          value={5}
          delta="2 较上期"
          icon={<InfoCircleFilled style={{ color: '#2563eb' }} />}
        />
        <StatCard
          title="已恢复告警"
          value={23}
          delta="8 较上期"
          deltaUp={false}
          icon={<CheckCircleFilled style={{ color: '#16a34a' }} />}
        />
      </div>

      <div className="alert-body">
        <div className="alert-col">
          <Panel
            title={`当前活跃告警（${rows.length}）`}
            extra={linkExtra('查看全部 →', () => message.info('查看全部活跃告警（演示）'))}
          >
            <Table
              size="small"
              rowKey="key"
              pagination={false}
              columns={columns}
              dataSource={rows}
              scroll={{ x: 720 }}
            />
          </Panel>

          <Panel
            title="值班人员"
            extra={linkExtra('轮班规则 →', () => message.info('轮班规则（演示）'))}
          >
            <div className="alert-duty">
              <div className="alert-duty-card">
                <div className="alert-duty-label">当前值班</div>
                <div className="alert-duty-person">
                  <Avatar size={40} style={{ background: '#2563eb' }}>
                    李
                  </Avatar>
                  <div>
                    <strong>李四</strong>
                    <em>运维工程师</em>
                    <span>138****1024</span>
                  </div>
                </div>
                <Button size="small" type="primary" onClick={() => message.success('已发送通知（演示）')}>
                  发送通知
                </Button>
              </div>
              <div className="alert-duty-card is-next">
                <div className="alert-duty-label">下一个值班</div>
                <div className="alert-duty-person">
                  <Avatar size={40} style={{ background: '#0ea5e9' }}>
                    王
                  </Avatar>
                  <div>
                    <strong>王五</strong>
                    <em>后端开发</em>
                    <span>18:00 接班</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="告警趋势">
            <Column {...chartConfig} />
          </Panel>
        </div>

        <div className="alert-col">
          <Panel
            title={`告警规则（${rules.length}）`}
            extra={linkExtra('查看全部 →', () => message.info('查看全部规则（演示）'))}
          >
            <ul className="alert-rule-list">
              {rules.map((r) => (
                <li key={r.key}>
                  <div className="alert-rule-main">
                    <strong>{r.name}</strong>
                    <em>
                      {r.target} · {r.cond}
                    </em>
                  </div>
                  <Switch
                    size="small"
                    checked={r.on}
                    onChange={(on) => {
                      setRules((prev) => prev.map((x) => (x.key === r.key ? { ...x, on } : x)))
                      message.success(`${r.name} 已${on ? '启用' : '停用'}`)
                    }}
                  />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title={`通知渠道（${channels.length}）`}
            extra={linkExtra('添加渠道 →', () => message.info('添加渠道（演示）'))}
          >
            <ul className="alert-channel-list">
              {channels.map((c) => (
                <li key={c.key}>
                  <div className="alert-channel-main">
                    <strong>{c.name}</strong>
                    <em>
                      {c.type} · {c.receiver}
                    </em>
                  </div>
                  <Switch
                    size="small"
                    checked={c.on}
                    onChange={(on) => {
                      setChannels((prev) => prev.map((x) => (x.key === c.key ? { ...x, on } : x)))
                      message.success(`${c.name} 已${on ? '启用' : '停用'}`)
                    }}
                  />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="最近事件"
            extra={linkExtra('查看全部 →', () => message.info('查看全部事件（演示）'))}
          >
            <ul className="alert-events">
              {recentEvents.map((e) => (
                <li key={`${e.time}-${e.text}`}>
                  <span className="alert-event-time">{e.time}</span>
                  <span className={`alert-event-state is-${e.state.toLowerCase()}`}>[{e.state}]</span>
                  <div className="alert-event-body">
                    <strong>{e.text}</strong>
                    <em>{e.svc}</em>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}
