import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileProtectOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Checkbox,
  Dropdown,
  Input,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { MenuProps } from 'antd'
import { useMemo, useState } from 'react'
import { Panel, StatCard, StatusTag } from '../components/ui'
import '../styles/acceptance.css'

type AccStatus = '待验收' | '测试中' | '已通过' | '已驳回'

type AccRow = {
  key: string
  name: string
  subtitle: string
  customer: string
  env: string
  envTone: 'blue' | 'gold'
  owner: string
  deadline: string
  status: AccStatus
  submitAt: string
  planAt: string
  lead: string
  reqs: string[]
  checklist: { title: string; desc: string; done: boolean }[]
}

const seed: AccRow[] = [
  {
    key: '1',
    name: 'mall-电商平台 v2.1.0',
    subtitle: '订单导出与支付结果页优化',
    customer: '星河零售',
    env: '测试环境',
    envTone: 'blue',
    owner: '张三',
    deadline: '今天 18:00',
    status: '待验收',
    submitAt: '今天 09:20',
    planAt: '明天 14:00',
    lead: '李四',
    reqs: ['#428', '#429'],
    checklist: [
      { title: '核心流程验证', desc: '下单 / 支付 / 导出主路径通过', done: true },
      { title: '权限验证', desc: '角色与数据权限核对完成', done: true },
      { title: '性能验证', desc: 'P95 < 800ms', done: true },
      { title: 'UI 验证', desc: '关键页面对齐设计稿', done: true },
    ],
  },
  {
    key: '2',
    name: 'pay-支付服务 v1.4.2',
    subtitle: '回调超时重试与对账修复',
    customer: '云启科技',
    env: '预发布环境',
    envTone: 'gold',
    owner: '王五',
    deadline: '明天 12:00',
    status: '测试中',
    submitAt: '昨天 16:40',
    planAt: '周五 10:00',
    lead: '赵六',
    reqs: ['#401'],
    checklist: [
      { title: '回调重试', desc: '失败重试策略验证', done: true },
      { title: '对账脚本', desc: '日终对账抽样通过', done: false },
      { title: '告警联动', desc: '超时告警可达值班群', done: true },
      { title: '回滚预案', desc: '一键回滚演练完成', done: false },
    ],
  },
  {
    key: '3',
    name: 'user-用户中心 v3.0.1',
    subtitle: '登录风控与会话治理',
    customer: '华信银行',
    env: '测试环境',
    envTone: 'blue',
    owner: '陈七',
    deadline: '本周三',
    status: '已通过',
    submitAt: '周一 11:00',
    planAt: '周三 09:00',
    lead: '张三',
    reqs: ['#390', '#391'],
    checklist: [
      { title: '风控规则', desc: '异常登录拦截正确', done: true },
      { title: '会话续期', desc: '多端会话策略符合预期', done: true },
      { title: '审计日志', desc: '关键操作可追溯', done: true },
      { title: '兼容性', desc: '主流浏览器通过', done: true },
    ],
  },
  {
    key: '4',
    name: 'order-订单服务 v2.0.5',
    subtitle: '导出任务异步化',
    customer: '星河零售',
    env: '预发布环境',
    envTone: 'gold',
    owner: '李四',
    deadline: '上周三',
    status: '已驳回',
    submitAt: '上周一',
    planAt: '上周三',
    lead: '王五',
    reqs: ['#377'],
    checklist: [
      { title: '异步队列', desc: '高峰堆积未达预期', done: false },
      { title: '进度回传', desc: '前端进度条偶发丢失', done: false },
      { title: '权限校验', desc: '已通过', done: true },
      { title: '监控埋点', desc: '缺失关键指标', done: false },
    ],
  },
]

const recent = [
  {
    time: '今天 09:40',
    project: 'user-用户中心 v3.0.1',
    note: '风控与会话验收通过，可安排预发。',
    who: '张三',
    tone: 'ok' as const,
  },
  {
    time: '昨天 17:12',
    project: 'order-订单服务 v2.0.5',
    note: '异步导出高峰堆积，驳回并要求补监控。',
    who: '王五',
    tone: 'danger' as const,
  },
  {
    time: '昨天 11:05',
    project: 'mall-电商平台 v2.0.9',
    note: '支付结果页文案微调后复验通过。',
    who: '李四',
    tone: 'ok' as const,
  },
]

const statusTone = (s: AccStatus) =>
  s === '已通过' ? 'ok' : s === '已驳回' ? 'danger' : s === '测试中' ? 'running' : 'warn'

export default function AcceptancePage() {
  const [rows, setRows] = useState(seed)
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')
  const [selectedKey, setSelectedKey] = useState(seed[0].key)
  const [detailTab, setDetailTab] = useState('basic')
  const [checked, setChecked] = useState<string[]>([])

  const list = useMemo(() => {
    return rows.filter((r) => {
      if (status !== 'all' && r.status !== status) return false
      if (q && !`${r.name}${r.customer}${r.owner}`.includes(q)) return false
      return true
    })
  }, [rows, status, q])

  const current = rows.find((r) => r.key === selectedKey) ?? list[0] ?? rows[0]

  const act = (key: string, next: AccStatus) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, status: next } : r)))
    message.success(`已更新为「${next}」`)
  }

  const moreMenu: MenuProps['items'] = [
    { key: 'copy', label: '复制链接' },
    { key: 'export', label: '导出报告' },
  ]

  const columns: ColumnsType<AccRow> = [
    {
      title: '',
      width: 40,
      render: (_, row) => (
        <Checkbox
          checked={checked.includes(row.key)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            setChecked((prev) =>
              e.target.checked ? [...prev, row.key] : prev.filter((k) => k !== row.key),
            )
          }}
        />
      ),
    },
    {
      title: '项目 / 版本',
      dataIndex: 'name',
      render: (_, row) => (
        <div className="acc-cell-title">
          <strong>{row.name}</strong>
          <em>{row.subtitle}</em>
        </div>
      ),
    },
    { title: '客户', dataIndex: 'customer', width: 100 },
    {
      title: '测试环境',
      dataIndex: 'env',
      width: 110,
      render: (v: string, row) => <Tag color={row.envTone}>{v}</Tag>,
    },
    { title: '验收负责人', dataIndex: 'owner', width: 100 },
    { title: '截止时间', dataIndex: 'deadline', width: 110 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 96,
      render: (v: AccStatus) => <StatusTag text={v} tone={statusTone(v)} />,
    },
    {
      title: '操作',
      width: 100,
      render: (_, row) => (
        <Space size={0} onClick={(e) => e.stopPropagation()}>
          <Button type="link" size="small" onClick={() => setSelectedKey(row.key)}>
            查看
          </Button>
          <Dropdown
            menu={{
              items: moreMenu,
              onClick: ({ key }) => message.info(`${key}（演示）`),
            }}
          >
            <Button type="link" size="small">
              ···
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ]

  const doneCount = current.checklist.filter((c) => c.done).length

  return (
    <div className="acc-page">
      <div className="acc-stats">
        <StatCard title="待验收项目" value={8} delta="2 较上周" deltaUp={false} icon={<FileProtectOutlined />} />
        <StatCard
          title="已通过验收"
          value={24}
          delta="6 较上周"
          icon={<CheckCircleOutlined style={{ color: '#16a34a' }} />}
        />
        <StatCard
          title="驳回次数"
          value={3}
          delta="2 较上周"
          icon={<CloseCircleOutlined style={{ color: '#dc2626' }} />}
        />
        <StatCard
          title="平均验收时长"
          value="1.8"
          suffix="天"
          delta="0.6 较上周"
          icon={<ClockCircleOutlined />}
        />
      </div>

      <div className="acc-body">
        <div className="acc-left">
          <Panel
            title="验收项目列表"
            extra={
              <div className="acc-list-tools">
                <Select
                  value={status}
                  onChange={setStatus}
                  style={{ width: 120 }}
                  options={[
                    { value: 'all', label: '全部状态' },
                    { value: '待验收', label: '待验收' },
                    { value: '测试中', label: '测试中' },
                    { value: '已通过', label: '已通过' },
                    { value: '已驳回', label: '已驳回' },
                  ]}
                />
                <Input
                  allowClear
                  prefix={<SearchOutlined />}
                  placeholder="搜索项目名称..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  style={{ width: 180 }}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => message.info('新增验收（演示）')}
                >
                  新增验收
                </Button>
              </div>
            }
          >
            <Table
              size="small"
              rowKey="key"
              pagination={false}
              columns={columns}
              dataSource={list}
              rowClassName={(row) => (row.key === current.key ? 'acc-row-active' : '')}
              onRow={(row) => ({
                onClick: () => setSelectedKey(row.key),
              })}
              scroll={{ x: 860, y: 320 }}
            />
          </Panel>

          <Panel
            title="最近验收记录"
            extra={
              <Button type="link" size="small" onClick={() => message.info('查看更多（演示）')}>
                查看更多
              </Button>
            }
          >
            <ul className="acc-recent">
              {recent.map((r) => (
                <li key={`${r.time}-${r.project}`}>
                  <i className={`status-dot ${r.tone === 'ok' ? 'ok' : 'danger'}`} />
                  <span className="acc-recent-time">{r.time}</span>
                  <div className="acc-recent-main">
                    <strong>{r.project}</strong>
                    <em>{r.note}</em>
                  </div>
                  <span className="acc-recent-who">{r.who}</span>
                  <Button type="link" size="small">
                    查看
                  </Button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          className="acc-detail-panel"
          title={
            <span className="acc-detail-title">
              验收详情
              <StatusTag text={current.status} tone={statusTone(current.status)} />
            </span>
          }
        >
          <div className="acc-detail">
            <Tabs
              size="small"
              activeKey={detailTab}
              onChange={setDetailTab}
              items={[
                { key: 'basic', label: '基本信息' },
                { key: 'change', label: '变更说明' },
                { key: 'url', label: '测试地址' },
                { key: 'checklist', label: '验收清单' },
                { key: 'feedback', label: '反馈记录' },
              ]}
            />

            <div className="acc-detail-hero">
              <Avatar size={40} style={{ background: '#2563eb' }}>
                {current.name.slice(0, 1).toUpperCase()}
              </Avatar>
              <div>
                <strong>{current.name}</strong>
                <em>{current.subtitle}</em>
              </div>
            </div>

            {detailTab === 'basic' && (
              <>
                <dl className="acc-kv">
                  <div>
                    <dt>客户名称</dt>
                    <dd>{current.customer}</dd>
                  </div>
                  <div>
                    <dt>提交时间</dt>
                    <dd>{current.submitAt}</dd>
                  </div>
                  <div>
                    <dt>项目负责人</dt>
                    <dd>{current.lead}</dd>
                  </div>
                  <div>
                    <dt>计划发布时间</dt>
                    <dd>{current.planAt}</dd>
                  </div>
                  <div>
                    <dt>验收负责人</dt>
                    <dd>{current.owner}</dd>
                  </div>
                  <div>
                    <dt>关联需求</dt>
                    <dd>
                      <Space size={4} wrap>
                        {current.reqs.map((r) => (
                          <Tag key={r} color="blue">
                            {r}
                          </Tag>
                        ))}
                      </Space>
                    </dd>
                  </div>
                </dl>

                <div className="acc-check-block">
                  <div className="acc-check-head">
                    <strong>
                      验收清单 {doneCount}/{current.checklist.length}
                    </strong>
                    <Button type="link" size="small" onClick={() => setDetailTab('checklist')}>
                      查看完整清单
                    </Button>
                  </div>
                  <ul className="acc-check-list">
                    {current.checklist.map((c) => (
                      <li key={c.title} className={c.done ? 'is-done' : ''}>
                        <CheckCircleOutlined />
                        <div>
                          <strong>{c.title}</strong>
                          <em>{c.desc}</em>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {detailTab === 'change' && (
              <ul className="acc-plain">
                <li>支付结果页文案与状态映射调整</li>
                <li>订单导出改为异步任务，支持进度查询</li>
                <li>补充导出失败重试与审计日志</li>
              </ul>
            )}

            {detailTab === 'url' && (
              <ul className="acc-plain">
                <li>测试：https://test.mall.example.com</li>
                <li>预发：https://staging.mall.example.com</li>
                <li>账号：demo / 演示密码见值班手册</li>
              </ul>
            )}

            {detailTab === 'checklist' && (
              <ul className="acc-check-list">
                {current.checklist.map((c) => (
                  <li key={c.title} className={c.done ? 'is-done' : ''}>
                    <CheckCircleOutlined />
                    <div>
                      <strong>{c.title}</strong>
                      <em>{c.desc}</em>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {detailTab === 'feedback' && (
              <div className="acc-plain">暂无历史反馈，可通过「补充说明」添加。</div>
            )}

            {(current.status === '待验收' || current.status === '测试中') && (
              <div className="acc-detail-foot">
                <Button danger onClick={() => act(current.key, '已驳回')}>
                  驳回
                </Button>
                <Button onClick={() => message.info('补充说明（演示）')}>补充说明</Button>
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => act(current.key, '已通过')}>
                  通过验收
                </Button>
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}
