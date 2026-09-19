import {
  BugOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CloudServerOutlined,
  DeploymentUnitOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  InfoCircleFilled,
  PlayCircleOutlined,
  PullRequestOutlined,
  RocketOutlined,
  ToolOutlined,
  WarningFilled,
} from '@ant-design/icons'
import { Button, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { Panel, StatCard, StatusTag } from '../components/ui'
import '../styles/overview-v2.css'

const spark = (points: number[], color: string) => {
  const max = Math.max(...points, 1)
  const w = 64
  const h = 28
  const step = w / Math.max(points.length - 1, 1)
  const d = points
    .map((p, i) => {
      const x = i * step
      const y = h - (p / max) * (h - 4) - 2
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg className="ov2-spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const bars = (values: number[], color: string) => (
  <div className="ov2-bars" aria-hidden>
    {values.map((v, i) => (
      <span key={i} style={{ height: `${Math.max(18, v)}%`, background: color }} />
    ))}
  </div>
)

const stages = [
  {
    key: 'agent',
    title: 'Cursor Agent',
    desc: 'AI 代码审查与修复',
    time: '2m 12s',
    color: '#2563eb',
    steps: ['AI 审查', '自动修复', '补充测试', '维护 PR'],
  },
  {
    key: 'ci',
    title: 'GitHub Actions',
    desc: '构建与测试',
    time: '6m 28s',
    color: '#7c3aed',
    steps: ['Maven', 'Next.js', 'Tests', 'Docker 构建', '推送镜像'],
  },
  {
    key: 'deploy',
    title: 'Coolify',
    desc: '部署与运维',
    time: '3m 15s',
    color: '#0891b2',
    steps: ['拉取镜像', '部署', '健康检查', 'HTTPS', '回滚预案'],
  },
]

const agentMetrics = [
  { label: '发现问题', value: '2', icon: <BugOutlined />, tone: 'danger' },
  { label: '已修复', value: '2', icon: <ToolOutlined />, tone: 'ok' },
  { label: '新增测试', value: '6', icon: <FileTextOutlined />, tone: 'info' },
  { label: 'PR 编号', value: '#128', icon: <PullRequestOutlined />, tone: 'info' },
]

const pipelineRows = [
  {
    key: '1',
    project: 'mall-frontend',
    branch: 'main',
    commit: 'a91c2e',
    trigger: 'Push',
    stage: 'Deploy',
    status: '运行中',
    duration: '4m 12s',
  },
  {
    key: '2',
    project: 'order-service',
    branch: 'release/2.1',
    commit: '77bf01',
    trigger: '手动',
    stage: 'Test',
    status: '成功',
    duration: '8m 03s',
  },
  {
    key: '3',
    project: 'pay-service',
    branch: 'fix/timeout',
    commit: 'c3d910',
    trigger: 'PR',
    stage: 'Build',
    status: '失败',
    duration: '2m 41s',
  },
  {
    key: '4',
    project: 'user-service',
    branch: 'main',
    commit: '12af88',
    trigger: '定时',
    stage: 'Agent',
    status: '成功',
    duration: '5m 20s',
  },
  {
    key: '5',
    project: 'admin-web',
    branch: 'develop',
    commit: '9e0b44',
    trigger: 'Push',
    stage: 'Deploy',
    status: '成功',
    duration: '7m 55s',
  },
]

const envs = [
  { name: 'Dev', version: 'v1.2.0-dev.6', instances: '4 / 4', health: '健康', time: '10 分钟前' },
  { name: 'Test', version: 'v1.2.0-rc.2', instances: '3 / 3', health: '健康', time: '1 小时前' },
  { name: 'Staging', version: 'v1.1.9', instances: '2 / 2', health: '健康', time: '昨天 21:10' },
  { name: 'Production', version: 'v1.1.8', instances: '6 / 6', health: '健康', time: '3 天前' },
]

const events = [
  {
    time: '10:28:12',
    level: 'success' as const,
    event: '部署成功',
    detail: 'mall-frontend → Staging',
    icon: <CheckCircleFilled />,
  },
  {
    time: '10:21:05',
    level: 'info' as const,
    event: '健康检查通过',
    detail: 'order-service · 3/3 ready',
    icon: <InfoCircleFilled />,
  },
  {
    time: '10:12:44',
    level: 'warn' as const,
    event: '发现代码问题',
    detail: 'Agent 标记 2 处可修复项',
    icon: <WarningFilled />,
  },
  {
    time: '09:58:01',
    level: 'success' as const,
    event: 'PR 已创建',
    detail: '#128 feat/order-export',
    icon: <CheckCircleFilled />,
  },
  {
    time: '09:40:18',
    level: 'info' as const,
    event: '流水线触发',
    detail: 'push · main · mall-frontend',
    icon: <InfoCircleFilled />,
  },
]

const statusTone = (s: string) =>
  s === '成功' ? 'ok' : s === '失败' ? 'danger' : s === '运行中' ? 'running' : 'muted'

export default function OverviewV2Page() {
  const nav = useNavigate()

  const columns: ColumnsType<(typeof pipelineRows)[number]> = [
    { title: '项目', dataIndex: 'project', width: 120, ellipsis: true },
    { title: '分支', dataIndex: 'branch', width: 110, ellipsis: true },
    { title: 'Commit', dataIndex: 'commit', width: 80 },
    { title: '触发', dataIndex: 'trigger', width: 64 },
    { title: '阶段', dataIndex: 'stage', width: 72 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 88,
      render: (v: string) => <StatusTag text={v} tone={statusTone(v)} />,
    },
    { title: '耗时', dataIndex: 'duration', width: 80 },
    {
      title: '操作',
      width: 64,
      render: () => (
        <Button type="link" size="small" onClick={() => nav('/pipelines')}>
          查看
        </Button>
      ),
    },
  ]

  return (
    <div className="ov2-page">
      <div className="ov2-stats">
        <StatCard
          title="今日部署"
          value={12}
          suffix="次"
          delta="33% 较昨日"
          icon={
            <span className="ov2-stat-extra">
              {spark([4, 6, 5, 8, 7, 10, 12], '#2563eb')}
              <RocketOutlined />
            </span>
          }
        />
        <StatCard
          title="成功率"
          value="91.7"
          suffix="%"
          delta="2.1% 较昨日"
          icon={
            <span className="ov2-stat-extra">
              {spark([80, 84, 82, 88, 90, 91, 92], '#16a34a')}
              <CheckCircleFilled style={{ color: '#16a34a' }} />
            </span>
          }
        />
        <StatCard
          title="运行中流水线"
          value={3}
          suffix="个"
          delta="1 较昨日"
          icon={
            <span className="ov2-stat-extra">
              {bars([40, 55, 35, 70, 50, 65], '#7c3aed')}
              <DeploymentUnitOutlined style={{ color: '#7c3aed' }} />
            </span>
          }
        />
        <StatCard
          title="待审批"
          value={2}
          suffix="个"
          delta="1 较昨日"
          deltaUp={false}
          icon={
            <span className="ov2-stat-extra">
              {bars([60, 45, 50, 40, 35, 30], '#d97706')}
              <ClockCircleOutlined style={{ color: '#d97706' }} />
            </span>
          }
        />
        <StatCard
          title="健康实例"
          value="24 / 26"
          delta="92.3% 健康率"
          icon={
            <span className="ov2-stat-extra">
              {spark([22, 23, 24, 24, 25, 24, 24], '#16a34a')}
              <CloudServerOutlined style={{ color: '#16a34a' }} />
            </span>
          }
        />
      </div>

      <Panel
        title="可视化交付流水线"
        extra={
          <div className="ov2-pipe-extra">
            <Button type="link" size="small" onClick={() => nav('/pipelines')}>
              查看详情
            </Button>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => message.success('已手动触发流水线（演示）')}
            >
              手动触发流水线
            </Button>
          </div>
        }
      >
        <p className="ov2-pipe-desc">从 Agent 修复到 CI 构建再到 Coolify 发布，一条链路可观测可回放。</p>
        <div className="ov2-pipeline">
          {stages.map((s, i) => (
            <div key={s.key} className="ov2-stage-wrap">
              <div className="ov2-stage">
                <div className="ov2-stage-head">
                  <div>
                    <strong>{s.title}</strong>
                    <em>{s.desc}</em>
                  </div>
                  <span style={{ color: s.color }}>{s.time}</span>
                </div>
                <div className="ov2-steps">
                  {s.steps.map((step) => (
                    <div key={step} className="ov2-step">
                      <CheckCircleFilled style={{ color: '#16a34a' }} />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              {i < stages.length - 1 ? <div className="ov2-arrow" aria-hidden /> : null}
            </div>
          ))}
        </div>
      </Panel>

      <div className="ov2-mid">
        <Panel
          title="AI Agent 执行详情"
          extra={<StatusTag text="执行完成" tone="ok" />}
        >
          <div className="ov2-agent-grid">
            {agentMetrics.map((m) => (
              <div key={m.label} className={`ov2-agent-metric is-${m.tone}`}>
                <span className="ov2-agent-icon">{m.icon}</span>
                <strong>{m.value}</strong>
                <em>{m.label}</em>
              </div>
            ))}
          </div>
          <div className="ov2-agent-summary">
            Agent 已完成审查与修复，PR #128 等待人工复核后合入。最近一次执行：今天 10:05。
          </div>
        </Panel>

        <Panel
          title="最近流水线记录"
          extra={
            <Button type="link" size="small" onClick={() => nav('/pipelines')}>
              查看全部 →
            </Button>
          }
        >
          <Table
            size="small"
            rowKey="key"
            pagination={false}
            columns={columns}
            dataSource={pipelineRows}
            scroll={{ x: 720 }}
          />
        </Panel>
      </div>

      <div className="ov2-bottom">
        <Panel
          title="环境与版本"
          extra={
            <Button type="link" size="small" onClick={() => nav('/environments-v2')}>
              环境管理 →
            </Button>
          }
        >
          <p className="ov2-env-desc">四套环境版本、实例与健康状态一览。</p>
          <div className="ov2-envs">
            {envs.map((e) => (
              <div key={e.name} className="ov2-env-card">
                <div className="ov2-env-top">
                  <strong>{e.name}</strong>
                  <StatusTag text="运行中" tone="ok" />
                </div>
                <div className="ov2-env-ver">{e.version}</div>
                <div className="ov2-env-meta">
                  <span>实例 {e.instances}</span>
                  <span>{e.health}</span>
                </div>
                <div className="ov2-env-time">最近部署 · {e.time}</div>
                <div className="ov2-env-actions">
                  <Button size="small" onClick={() => message.info(`访问 ${e.name}（演示）`)}>
                    访问
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    ghost
                    icon={<ExperimentOutlined />}
                    onClick={() => message.info(`部署到 ${e.name}（演示）`)}
                  >
                    部署
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="统一日志 / 事件"
          extra={
            <Button type="link" size="small" onClick={() => nav('/logs-v2')}>
              日志中心 →
            </Button>
          }
        >
          <ul className="ov2-events">
            {events.map((e) => (
              <li key={`${e.time}-${e.event}`} className={`is-${e.level}`}>
                <span className="ov2-event-time">{e.time}</span>
                <span className="ov2-event-level">{e.icon}</span>
                <div>
                  <strong>{e.event}</strong>
                  <em>{e.detail}</em>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
