import {
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Input, Progress, Select, Space, Table, Tabs, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Panel, StatCard } from '../components/ui'
import '../styles/customers.css'

type Customer = {
  key: string
  name: string
  slogan: string
  industry: string
  owner: string
  ownerAvatar: string
  contract: string
  contractTone: 'ok' | 'warn' | 'muted'
  projects: number
  updated: string
}

type Acceptance = {
  key: string
  project: string
  customer: string
  progress: number
  due: string
  owner: string
  status: 'pending' | 'doing' | 'done'
}

const customers: Customer[] = [
  {
    key: '1',
    name: '华夏科技有限公司',
    slogan: '技术创造更大价值',
    industry: '互联网',
    owner: '张三',
    ownerAvatar: '张',
    contract: '已签约',
    contractTone: 'ok',
    projects: 3,
    updated: '2 小时前',
  },
  {
    key: '2',
    name: '星河零售集团',
    slogan: '智慧零售全链路',
    industry: '零售',
    owner: '李四',
    ownerAvatar: '李',
    contract: '洽谈中',
    contractTone: 'warn',
    projects: 1,
    updated: '昨天',
  },
  {
    key: '3',
    name: '云启制造股份',
    slogan: '工业数字化升级',
    industry: '制造',
    owner: '王五',
    ownerAvatar: '王',
    contract: '已签约',
    contractTone: 'ok',
    projects: 2,
    updated: '3 天前',
  },
  {
    key: '4',
    name: '青橙金融科技',
    slogan: '可信支付与风控',
    industry: '金融',
    owner: '陈六',
    ownerAvatar: '陈',
    contract: '已签约',
    contractTone: 'ok',
    projects: 4,
    updated: '今天 09:20',
  },
  {
    key: '5',
    name: '远航物流集团',
    slogan: '履约可视化',
    industry: '物流',
    owner: '张三',
    ownerAvatar: '张',
    contract: '待续约',
    contractTone: 'muted',
    projects: 2,
    updated: '上周',
  },
]

const acceptances: Acceptance[] = [
  {
    key: 'a1',
    project: '电商中台 v2.1',
    customer: '华夏科技有限公司',
    progress: 80,
    due: '03-28',
    owner: '张三',
    status: 'pending',
  },
  {
    key: 'a2',
    project: '会员运营系统',
    customer: '星河零售集团',
    progress: 60,
    due: '04-02',
    owner: '李四',
    status: 'pending',
  },
  {
    key: 'a3',
    project: '产线数据采集',
    customer: '云启制造股份',
    progress: 40,
    due: '04-10',
    owner: '王五',
    status: 'pending',
  },
  {
    key: 'a4',
    project: '风控规则引擎',
    customer: '青橙金融科技',
    progress: 55,
    due: '04-05',
    owner: '陈六',
    status: 'doing',
  },
  {
    key: 'a5',
    project: '运单轨迹服务',
    customer: '远航物流集团',
    progress: 100,
    due: '03-12',
    owner: '张三',
    status: 'done',
  },
]

const communications = [
  { company: '华夏科技有限公司', text: '希望下周完成验收演示环境联调', time: '10 分钟前', color: '#2563eb' },
  { company: '星河零售集团', text: '合同附件已补充，请安排法务复核', time: '1 小时前', color: '#0d9488' },
  { company: '青橙金融科技', text: '本月回款计划调整到月底前', time: '今天 11:20', color: '#d97706' },
  { company: '云启制造股份', text: '新增 2 个产线接入需求', time: '昨天', color: '#7c3aed' },
]

const payments = [
  { company: '华夏科技', project: '电商中台二期', amount: '¥120,000', due: '距到期 3 天', urgent: true },
  { company: '星河零售', project: '会员系统首期', amount: '¥86,000', due: '距到期 7 天', urgent: false },
  { company: '青橙金融', project: '风控引擎维护', amount: '¥45,000', due: '距到期 12 天', urgent: false },
  { company: '远航物流', project: '轨迹服务续费', amount: '¥32,000', due: '距到期 18 天', urgent: false },
]

const contractColor = {
  ok: 'success',
  warn: 'warning',
  muted: 'default',
} as const

export default function CustomersPage() {
  const [q, setQ] = useState('')
  const [industry, setIndustry] = useState('all')
  const [status, setStatus] = useState('all')
  const [owner, setOwner] = useState('all')
  const [acceptTab, setAcceptTab] = useState('pending')
  const [payTab, setPayTab] = useState('due')

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (q && !`${c.name}${c.slogan}${c.industry}`.includes(q)) return false
      if (industry !== 'all' && c.industry !== industry) return false
      if (status !== 'all' && c.contract !== status) return false
      if (owner !== 'all' && c.owner !== owner) return false
      return true
    })
  }, [q, industry, status, owner])

  const filteredAccept = useMemo(
    () => acceptances.filter((a) => a.status === acceptTab),
    [acceptTab],
  )

  const customerColumns: ColumnsType<Customer> = [
    {
      title: '客户名称',
      dataIndex: 'name',
      render: (_, row) => (
        <div className="cust-name-cell">
          <strong>{row.name}</strong>
          <span>{row.slogan}</span>
        </div>
      ),
    },
    { title: '行业', dataIndex: 'industry', width: 90 },
    {
      title: '负责人',
      dataIndex: 'owner',
      width: 120,
      render: (_, row) => (
        <Space size={8}>
          <Avatar size={24} style={{ background: '#2563eb', fontSize: 12 }}>
            {row.ownerAvatar}
          </Avatar>
          {row.owner}
        </Space>
      ),
    },
    {
      title: '合同状态',
      dataIndex: 'contract',
      width: 100,
      render: (v: string, row) => <Tag color={contractColor[row.contractTone]}>{v}</Tag>,
    },
    { title: '项目数', dataIndex: 'projects', width: 80 },
    { title: '最近更新', dataIndex: 'updated', width: 110 },
    {
      title: '操作',
      width: 90,
      render: () => (
        <Button type="link" size="small" onClick={() => message.info('打开客户详情（演示）')}>
          查看
        </Button>
      ),
    },
  ]

  const acceptColumns: ColumnsType<Acceptance> = [
    { title: '项目', dataIndex: 'project' },
    { title: '客户', dataIndex: 'customer', width: 160 },
    {
      title: '进度',
      dataIndex: 'progress',
      width: 160,
      render: (v: number) => <Progress percent={v} size="small" strokeColor="#2563eb" />,
    },
    { title: '预计完成', dataIndex: 'due', width: 100 },
    { title: '负责人', dataIndex: 'owner', width: 90 },
  ]

  return (
    <div className="customers-page">
      <div className="customers-toolbar">
        <div className="customers-stats">
          <StatCard title="客户总数" value={36} delta="4 较上月" icon={<TeamOutlined />} />
          <StatCard title="活跃客户" value={28} delta="6 较上月" icon={<UserOutlined />} />
          <StatCard
            title="待验收项目"
            value={8}
            delta="2 较上月"
            deltaUp={false}
            icon={<CheckCircleOutlined />}
          />
          <StatCard title="本月回款" value="286.5" suffix="万" delta="18% 较上月" icon={<BankOutlined />} />
        </div>
        <Button
          className="customers-new-btn"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => message.info('新建客户（演示）')}
        >
          新建客户
        </Button>
      </div>

      <div className="customers-layout">
        <div className="customers-main">
          <Panel
            title="客户列表"
            extra={
              <Button type="link" size="small" onClick={() => message.info('查看全部客户（演示）')}>
                查看全部
              </Button>
            }
          >
            <div className="customers-filters">
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="搜索客户名称、标语..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ maxWidth: 240 }}
              />
              <Select
                value={industry}
                onChange={setIndustry}
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: '全部行业' },
                  { value: '互联网', label: '互联网' },
                  { value: '零售', label: '零售' },
                  { value: '制造', label: '制造' },
                  { value: '金融', label: '金融' },
                  { value: '物流', label: '物流' },
                ]}
              />
              <Select
                value={status}
                onChange={setStatus}
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: '全部状态' },
                  { value: '已签约', label: '已签约' },
                  { value: '洽谈中', label: '洽谈中' },
                  { value: '待续约', label: '待续约' },
                ]}
              />
              <Select
                value={owner}
                onChange={setOwner}
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: '全部负责人' },
                  { value: '张三', label: '张三' },
                  { value: '李四', label: '李四' },
                  { value: '王五', label: '王五' },
                  { value: '陈六', label: '陈六' },
                ]}
              />
            </div>
            <Table
              rowKey="key"
              size="middle"
              pagination={false}
              columns={customerColumns}
              dataSource={filteredCustomers}
            />
          </Panel>

          <Panel
            title="验收进度"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('发起验收（演示）')}>
                发起验收
              </Button>
            }
          >
            <Tabs
              activeKey={acceptTab}
              onChange={setAcceptTab}
              items={[
                { key: 'pending', label: '待验收 (8)' },
                { key: 'doing', label: '进行中 (3)' },
                { key: 'done', label: '已完成 (24)' },
              ]}
            />
            <Table
              rowKey="key"
              size="middle"
              pagination={false}
              columns={acceptColumns}
              dataSource={filteredAccept}
            />
          </Panel>
        </div>

        <aside className="customers-side">
          <Panel title="近期沟通">
            <ul className="customers-comm-list">
              {communications.map((c) => (
                <li key={c.company + c.time}>
                  <span className="customers-comm-icon" style={{ background: `${c.color}18`, color: c.color }}>
                    <MessageOutlined />
                  </span>
                  <div>
                    <strong>{c.company}</strong>
                    <p>{c.text}</p>
                    <em>{c.time}</em>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="合同与回款">
            <Tabs
              size="small"
              activeKey={payTab}
              onChange={setPayTab}
              items={[
                { key: 'due', label: '待回款 (4)' },
                { key: 'signed', label: '已签合同' },
                { key: 'records', label: '回款记录' },
              ]}
            />
            {payTab === 'due' ? (
              <ul className="customers-pay-list">
                {payments.map((p) => (
                  <li key={p.project}>
                    <span className="customers-pay-avatar">{p.company.slice(0, 1)}</span>
                    <div className="customers-pay-body">
                      <strong>{p.project}</strong>
                      <span>{p.company}</span>
                    </div>
                    <div className="customers-pay-meta">
                      <strong>{p.amount}</strong>
                      <em className={p.urgent ? 'is-urgent' : ''}>{p.due}</em>
                      <Button size="small" onClick={() => message.success('已发送催款提醒（演示）')}>
                        催款
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="customers-empty">
                <ClockCircleOutlined />
                <p>{payTab === 'signed' ? '已签合同列表（演示占位）' : '回款记录列表（演示占位）'}</p>
              </div>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  )
}
