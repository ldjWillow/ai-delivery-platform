import type { ReactNode } from 'react'
import {
  CheckCircleFilled,
  CloudServerOutlined,
  ExperimentOutlined,
  MoreOutlined,
  RocketOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Progress, Table, Tabs, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Panel, StatusTag } from '../components/ui'
import { environments, services } from '../mock/data'
import '../styles/environment-v2.css'

const envMeta: Record<string, { icon: ReactNode; tone: string; accent: string }> = {
  dev: { icon: <ExperimentOutlined />, tone: '#16a34a', accent: '#dcfce7' },
  test: { icon: <ExperimentOutlined />, tone: '#2563eb', accent: '#dbeafe' },
  staging: { icon: <CloudServerOutlined />, tone: '#d97706', accent: '#fef3c7' },
  prod: { icon: <RocketOutlined />, tone: '#dc2626', accent: '#fee2e2' },
}

const resources = [
  { key: 'cpu', label: 'CPU 使用率', percent: 42, detail: '8.4 / 20 cores', color: '#2563eb' },
  { key: 'mem', label: '内存使用率', percent: 68, detail: '13.6 / 20 GB', color: '#7c3aed' },
  { key: 'disk', label: '存储使用率', percent: 36, detail: '180 / 500 GB', color: '#0d9488' },
  { key: 'bw', label: '带宽使用率', percent: 52, detail: '52 / 100 Mbps', color: '#ea580c' },
]

const varsByEnv: Record<
  string,
  { key: string; value: string; desc: string; updatedAt: string; secret?: boolean }[]
> = {
  dev: [
    { key: 'APP_ENV', value: 'development', desc: '应用运行环境', updatedAt: '2024-04-22 10:12' },
    { key: 'API_BASE_URL', value: 'https://dev-api.example.com', desc: '后端服务地址', updatedAt: '2024-04-22 09:40' },
    { key: 'REDIS_URL', value: 'redis://10.0.1.3:6379', desc: '缓存连接地址', updatedAt: '2024-04-21 16:20', secret: true },
    { key: 'DB_HOST', value: '10.0.1.8', desc: '数据库主机', updatedAt: '2024-04-20 11:05' },
    { key: 'LOG_LEVEL', value: 'debug', desc: '日志级别', updatedAt: '2024-04-18 14:33' },
  ],
  test: [
    { key: 'APP_ENV', value: 'test', desc: '应用运行环境', updatedAt: '2024-04-21 10:00' },
    { key: 'API_BASE_URL', value: 'https://test-api.example.com', desc: '后端服务地址', updatedAt: '2024-04-21 10:00' },
    { key: 'LOG_LEVEL', value: 'info', desc: '日志级别', updatedAt: '2024-04-20 09:12' },
  ],
  staging: [
    { key: 'APP_ENV', value: 'staging', desc: '应用运行环境', updatedAt: '2024-04-22 07:30' },
    { key: 'API_BASE_URL', value: 'https://staging-api.example.com', desc: '后端服务地址', updatedAt: '2024-04-22 07:30' },
  ],
  prod: [
    { key: 'APP_ENV', value: 'production', desc: '应用运行环境', updatedAt: '2024-04-22 08:00' },
    { key: 'API_BASE_URL', value: 'https://api.example.com', desc: '后端服务地址', updatedAt: '2024-04-22 08:00' },
    { key: 'REDIS_URL', value: 'redis://****:6379', desc: '缓存连接地址', updatedAt: '2024-04-19 12:10', secret: true },
  ],
}

const domains = [
  { domain: 'dev.example.com', env: '开发', status: '正常', cert: '320 天' },
  { domain: 'test.example.com', env: '测试', status: '正常', cert: '301 天' },
  { domain: 'staging.example.com', env: '预发', status: '正常', cert: '269 天' },
]

export default function EnvironmentV2Page() {
  const [active, setActive] = useState('dev')
  const current = environments.find((e) => e.key === active)!
  const vars = varsByEnv[active] ?? varsByEnv.dev

  const serviceColumns: ColumnsType<(typeof services)[number]> = useMemo(
    () => [
      { title: '服务名称', dataIndex: 'name' },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: (v: string) => <StatusTag text={v} tone={v === '运行中' ? 'ok' : 'danger'} />,
      },
      { title: '镜像版本', dataIndex: 'version', width: 100 },
      { title: '实例数', dataIndex: 'instances', width: 90 },
      {
        title: 'CPU / 内存',
        width: 140,
        render: (_, row) => `${row.cpu} / ${row.mem}`,
      },
      {
        title: '操作',
        width: 120,
        render: () => (
          <>
            <Button type="link" size="small" onClick={() => message.info('重启中（演示）')}>
              重启
            </Button>
            <Button type="link" size="small">
              日志
            </Button>
          </>
        ),
      },
    ],
    [],
  )

  const varColumns: ColumnsType<(typeof vars)[number]> = [
    {
      title: '变量名',
      dataIndex: 'key',
      render: (v: string) => <code className="env2-code">{v}</code>,
    },
    {
      title: '值',
      dataIndex: 'value',
      render: (v: string, row) =>
        row.secret ? (
          <Tag>••••••••</Tag>
        ) : row.key === 'APP_ENV' ? (
          <Tag color="success">{v}</Tag>
        ) : (
          <span className="env2-mono">{v}</span>
        ),
    },
    { title: '描述', dataIndex: 'desc', ellipsis: true },
    { title: '更新时间', dataIndex: 'updatedAt', width: 150 },
    {
      title: '操作',
      width: 64,
      render: (_, row) => (
        <Dropdown
          menu={{
            items: [
              { key: 'e', label: '编辑', onClick: () => message.info(`编辑 ${row.key}`) },
              { key: 'c', label: '复制', onClick: () => message.success('已复制') },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ]

  return (
    <div className="env2-page">
      <div className="env2-cards">
        {environments.map((e) => {
          const meta = envMeta[e.key]
          return (
            <button
              key={e.key}
              type="button"
              className={`env2-card ${active === e.key ? 'is-active' : ''}`}
              onClick={() => setActive(e.key)}
            >
              <div className="env2-card-top">
                <span className="env2-card-icon" style={{ color: meta.tone, background: meta.accent }}>
                  {meta.icon}
                </span>
                <StatusTag text={e.status} tone={e.tone} />
              </div>
              <strong>{e.name}</strong>
              <span>
                {e.services} 服务 · {e.instances} 实例
              </span>
            </button>
          )
        })}
      </div>

      <div className="env2-mid">
        <Panel title="资源使用情况">
          <Tabs
            size="small"
            activeKey={active}
            onChange={setActive}
            items={environments.map((e) => ({ key: e.key, label: e.name }))}
          />
          <div className="env2-gauges">
            {resources.map((r) => (
              <div key={r.key} className="env2-gauge">
                <Progress
                  type="circle"
                  percent={r.percent}
                  size={96}
                  strokeColor={r.color}
                  format={(p) => <span className="env2-gauge-pct">{p}%</span>}
                />
                <div className="env2-gauge-label">{r.label}</div>
                <div className="env2-gauge-detail">{r.detail}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="环境变量"
          extra={
            <Button type="link" size="small" onClick={() => message.info('管理变量（演示）')}>
              管理变量 →
            </Button>
          }
        >
          <Tabs
            size="small"
            activeKey={active}
            onChange={setActive}
            items={environments.map((e) => ({ key: e.key, label: e.name }))}
          />
          <Table
            size="small"
            pagination={false}
            rowKey="key"
            columns={varColumns}
            dataSource={vars}
          />
        </Panel>
      </div>

      <div className="env2-bottom">
        <Panel title={`服务清单 · ${current.name}`}>
          <Table
            size="small"
            pagination={false}
            rowKey="name"
            columns={serviceColumns}
            dataSource={services}
          />
        </Panel>

        <div className="env2-side">
          <Panel title="域名绑定">
            <Table
              size="small"
              pagination={false}
              rowKey="domain"
              dataSource={domains}
              columns={[
                { title: '域名', dataIndex: 'domain' },
                { title: '环境', dataIndex: 'env', width: 64 },
                {
                  title: '状态',
                  dataIndex: 'status',
                  width: 72,
                  render: (v: string) => <StatusTag text={v} tone="ok" />,
                },
                { title: '证书到期', dataIndex: 'cert', width: 80 },
              ]}
            />
          </Panel>

          <div className="env2-mini-row">
            <div className="env2-mini">
              <div className="env2-mini-title">数据库</div>
              <strong>MySQL 8.0.32</strong>
              <StatusTag text="运行中" tone="ok" />
              <div className="env2-mini-meta">连接 12/100 · 存储 42/200 GB</div>
            </div>
            <div className="env2-mini">
              <div className="env2-mini-title">Redis</div>
              <strong>Redis 7.0.11</strong>
              <StatusTag text="运行中" tone="ok" />
              <div className="env2-mini-meta">内存 1.2/4 GB · 连接 36/200</div>
            </div>
          </div>

          <div className="env2-health">
            <CheckCircleFilled className="env2-health-icon" />
            <div>
              <strong>环境健康状态</strong>
              <span>健康</span>
              <p>正常服务 12 · 异常 2 · 告警 0 · 可用性 99.9%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
