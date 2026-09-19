import {
  AlertOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CloudServerOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import { Line } from '@ant-design/charts'
import { Button, Progress, Segmented, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Panel, StatCard } from '../components/ui'
import '../styles/monitor.css'

const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']

const latencyData = hours.flatMap((h) => {
  const base = h === '08:00' ? 420 : 180 + Math.round(Math.random() * 40)
  return [
    { time: h, metric: '平均响应', value: base },
    { time: h, metric: 'P95', value: base + 80 + Math.round(Math.random() * 30) },
    { time: h, metric: 'P99', value: base + 140 + Math.round(Math.random() * 40) },
  ]
})

const resourceData = hours.flatMap((h) => [
  { time: h, metric: 'CPU', value: 35 + Math.round(Math.random() * 25) },
  { time: h, metric: '内存', value: 48 + Math.round(Math.random() * 20) },
  { time: h, metric: '磁盘', value: 55 + Math.round(Math.random() * 10) },
])

const topology = [
  { name: 'mall-frontend', status: '正常', instances: '2/2', root: true },
  { name: 'mall-backend', status: '正常', instances: '3/3' },
  { name: 'pay-service', status: '正常', instances: '2/2' },
  { name: 'user-service', status: '正常', instances: '3/3' },
  { name: 'order-service', status: '告警', instances: '5/6' },
]

const events = [
  {
    time: '10:24:31',
    level: '严重',
    text: 'order-service 实例异常重启',
    svc: 'order-2',
  },
  {
    time: '09:18:22',
    level: '警告',
    text: 'mall-backend 数据库连接偏高',
    svc: 'mall-backend',
  },
  {
    time: '08:45:17',
    level: '警告',
    text: '/api/pay 响应超时阈值触发',
    svc: 'pay-service',
  },
  {
    time: '06:21:33',
    level: '恢复',
    text: 'user-service 实例恢复正常',
    svc: 'user-3',
  },
]

type InstRow = {
  key: string
  service: string
  instances: string
  cpu: number
  mem: number
  status: '正常' | '告警'
  last: string
}

const instances: InstRow[] = [
  {
    key: '1',
    service: 'mall-frontend',
    instances: '2/2',
    cpu: 28,
    mem: 42,
    status: '正常',
    last: '—',
  },
  {
    key: '2',
    service: 'mall-backend',
    instances: '3/3',
    cpu: 51,
    mem: 63,
    status: '正常',
    last: '昨天 21:10 · 重启',
  },
  {
    key: '3',
    service: 'pay-service',
    instances: '2/2',
    cpu: 44,
    mem: 55,
    status: '正常',
    last: '—',
  },
  {
    key: '4',
    service: 'user-service',
    instances: '3/3',
    cpu: 36,
    mem: 48,
    status: '正常',
    last: '06:21 · 已恢复',
  },
  {
    key: '5',
    service: 'order-service',
    instances: '5/6',
    cpu: 78,
    mem: 81,
    status: '告警',
    last: '10:24 · 实例重启',
  },
]

const slowApis = [
  { key: '1', rank: 1, path: '/api/order/create', avg: 892, count: 1240, err: '1.8%' },
  { key: '2', rank: 2, path: '/api/pay/callback', avg: 764, count: 980, err: '0.9%' },
  { key: '3', rank: 3, path: '/api/export/orders', avg: 651, count: 320, err: '0.4%' },
  { key: '4', rank: 4, path: '/api/user/profile', avg: 428, count: 5600, err: '0.1%' },
  { key: '5', rank: 5, path: '/api/search/sku', avg: 386, count: 2100, err: '0.2%' },
]

const levelColor = (lv: string) => (lv === '严重' ? 'red' : lv === '警告' ? 'gold' : 'green')

export default function MonitorPage() {
  const [latencyRange, setLatencyRange] = useState('24h')
  const [resourceRange, setResourceRange] = useState('24h')

  const latencyConfig = useMemo(
    () => ({
      data: latencyData,
      xField: 'time',
      yField: 'value',
      colorField: 'metric',
      height: 240,
      legend: { position: 'top-right' as const },
      axis: { y: { title: false }, x: { title: false } },
      style: { lineWidth: 2 },
      scale: {
        color: {
          domain: ['平均响应', 'P95', 'P99'],
          range: ['#2563eb', '#d97706', '#dc2626'],
        },
      },
    }),
    [],
  )

  const resourceConfig = useMemo(
    () => ({
      data: resourceData,
      xField: 'time',
      yField: 'value',
      colorField: 'metric',
      height: 240,
      legend: { position: 'top-right' as const },
      axis: { y: { title: false }, x: { title: false } },
      style: { lineWidth: 2 },
      scale: {
        color: {
          domain: ['CPU', '内存', '磁盘'],
          range: ['#2563eb', '#7c3aed', '#0891b2'],
        },
      },
    }),
    [],
  )

  const instCols: ColumnsType<InstRow> = [
    { title: '服务', dataIndex: 'service', width: 130 },
    { title: '实例', dataIndex: 'instances', width: 72 },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      width: 120,
      render: (v: number) => <Progress percent={v} size="small" status={v > 70 ? 'exception' : 'active'} />,
    },
    {
      title: '内存',
      dataIndex: 'mem',
      width: 120,
      render: (v: number) => <Progress percent={v} size="small" status={v > 75 ? 'exception' : 'active'} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (v: string) => (
        <span className="mon-status">
          <i className={`status-dot ${v === '正常' ? 'ok' : 'warn'}`} />
          {v}
        </span>
      ),
    },
    { title: '最近异常', dataIndex: 'last', ellipsis: true },
  ]

  const slowCols: ColumnsType<(typeof slowApis)[number]> = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 56,
      render: (v: number) => <span className={`mon-rank is-${v}`}>{v}</span>,
    },
    { title: 'API', dataIndex: 'path', ellipsis: true },
    {
      title: '平均耗时',
      dataIndex: 'avg',
      width: 100,
      render: (v: number) => <span className={v >= 650 ? 'mon-slow' : ''}>{v}ms</span>,
    },
    { title: '请求量', dataIndex: 'count', width: 80 },
    { title: '错误率', dataIndex: 'err', width: 72 },
  ]

  const link = (label: string) => (
    <Button type="link" size="small" onClick={() => message.info(`${label}（演示）`)}>
      {label}
    </Button>
  )

  return (
    <div className="mon-page">
      <div className="mon-stats">
        <StatCard
          title="服务可用率"
          value="99.96"
          suffix="%"
          delta="0.02% 较上周"
          icon={<CheckCircleFilled style={{ color: '#16a34a' }} />}
        />
        <StatCard
          title="在线实例"
          value="24 / 25"
          delta="1 较上周"
          icon={<CloudServerOutlined />}
        />
        <StatCard
          title="今日告警"
          value={6}
          delta="40% 较昨日"
          icon={<AlertOutlined style={{ color: '#dc2626' }} />}
        />
        <StatCard
          title="平均响应时间"
          value={218}
          suffix="ms"
          delta="12% 较上周"
          icon={<ClockCircleOutlined style={{ color: '#7c3aed' }} />}
        />
        <StatCard
          title="错误率"
          value="0.32"
          suffix="%"
          delta="0.08% 较上周"
          icon={<ExclamationCircleFilled style={{ color: '#dc2626' }} />}
        />
      </div>

      <div className="mon-charts">
        <Panel
          title="服务响应趋势"
          extra={
            <Segmented
              size="small"
              value={latencyRange}
              onChange={(v) => setLatencyRange(String(v))}
              options={[
                { value: '24h', label: '近24小时' },
                { value: '7d', label: '近7天' },
                { value: '30d', label: '近30天' },
              ]}
            />
          }
        >
          <Line {...latencyConfig} />
        </Panel>
        <Panel
          title="资源使用情况"
          extra={
            <Segmented
              size="small"
              value={resourceRange}
              onChange={(v) => setResourceRange(String(v))}
              options={[
                { value: '24h', label: '近24小时' },
                { value: '7d', label: '近7天' },
                { value: '30d', label: '近30天' },
              ]}
            />
          }
        >
          <Line {...resourceConfig} />
        </Panel>
      </div>

      <div className="mon-mid">
        <Panel title="服务拓扑与健康状态" extra={link('查看详情 →')}>
          <div className="mon-topo">
            <div className="mon-topo-root">
              <div className={`mon-node is-ok`}>
                <strong>mall-frontend</strong>
                <em>正常 · 2/2</em>
              </div>
            </div>
            <div className="mon-topo-branch" aria-hidden />
            <div className="mon-topo-children">
              {topology
                .filter((n) => !n.root)
                .map((n) => (
                  <div key={n.name} className={`mon-node ${n.status === '正常' ? 'is-ok' : 'is-warn'}`}>
                    <strong>{n.name}</strong>
                    <em>
                      {n.status === '正常' ? '正常' : '存在告警'} · {n.instances}
                    </em>
                  </div>
                ))}
            </div>
          </div>
        </Panel>

        <Panel title="最近事件" extra={link('查看全部 →')}>
          <ul className="mon-events">
            {events.map((e) => (
              <li key={`${e.time}-${e.text}`}>
                <span className="mon-event-time">{e.time}</span>
                <Tag color={levelColor(e.level)}>{e.level}</Tag>
                <div>
                  <strong>{e.text}</strong>
                  <em>{e.svc}</em>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="SLA / SLO 概览" extra={link('查看详情 →')}>
          <div className="mon-slo">
            <div className="mon-slo-item">
              <Progress
                type="dashboard"
                percent={99.9}
                strokeColor="#16a34a"
                size={110}
                format={() => '99.9%'}
              />
              <strong>可用性目标</strong>
              <em>SLO 99.9%</em>
            </div>
            <div className="mon-slo-item">
              <Progress
                type="dashboard"
                percent={99.6}
                strokeColor="#2563eb"
                size={110}
                format={() => '99.6%'}
              />
              <strong>响应时间目标</strong>
              <em>SLO 99.5%</em>
            </div>
          </div>
          <div className="mon-slo-tip">整体服务状态良好，当前指标均在目标范围内。</div>
        </Panel>
      </div>

      <div className="mon-bottom">
        <Panel title="服务实例状态" extra={link('查看全部 →')}>
          <Table
            size="small"
            rowKey="key"
            pagination={false}
            columns={instCols}
            dataSource={instances}
            scroll={{ x: 640 }}
          />
        </Panel>
        <Panel title="慢 API 排行" extra={link('查看全部 →')}>
          <Table
            size="small"
            rowKey="key"
            pagination={false}
            columns={slowCols}
            dataSource={slowApis}
          />
        </Panel>
      </div>
    </div>
  )
}
