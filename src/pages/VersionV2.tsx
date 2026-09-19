import {
  BranchesOutlined,
  CloudDownloadOutlined,
  CopyOutlined,
  PlusOutlined,
  SearchOutlined,
  TagOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Input,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Panel, StatCard, StatusTag } from '../components/ui'
import '../styles/version-v2.css'

type VerRow = {
  key: string
  ver: string
  tags: { text: string; color: string }[]
  desc: string
  commit: string
  who: string
  avatar: string
  time: string
  status: string
}

const tabs = [
  { key: 'overview', label: '版本概览' },
  { key: 'list', label: '版本列表' },
  { key: 'diff', label: '版本对比' },
  { key: 'releases', label: '发布记录' },
  { key: 'artifacts', label: '制品管理' },
  { key: 'branches', label: '分支管理' },
  { key: 'tags', label: '标签管理' },
]

const versionRows: VerRow[] = [
  {
    key: '1',
    ver: 'v2.1.0',
    tags: [
      { text: 'latest', color: 'blue' },
      { text: 'stable', color: 'green' },
    ],
    desc: '订单导出与支付结果页优化',
    commit: 'a91c2e1',
    who: '张三',
    avatar: '张',
    time: '2024-04-22 10:24',
    status: '已发布',
  },
  {
    key: '2',
    ver: 'v2.0.9',
    tags: [{ text: 'hotfix', color: 'red' }],
    desc: '修复 Staging Redis 连接泄漏',
    commit: '77bf01c',
    who: '李四',
    avatar: '李',
    time: '2024-04-18 18:32',
    status: '已发布',
  },
  {
    key: '3',
    ver: 'v2.0.8',
    tags: [
      { text: 'major', color: 'purple' },
      { text: 'stable', color: 'green' },
    ],
    desc: '用户中心会话治理与风控',
    commit: 'c3d910a',
    who: '王五',
    avatar: '王',
    time: '2024-04-10 09:15',
    status: '已发布',
  },
  {
    key: '4',
    ver: 'v2.0.5',
    tags: [{ text: 'patch', color: 'gold' }],
    desc: '构建缓存与镜像体积优化',
    commit: '12af88d',
    who: '陈六',
    avatar: '陈',
    time: '2024-03-28 14:02',
    status: '已发布',
  },
  {
    key: '5',
    ver: 'v1.4.0',
    tags: [{ text: 'feature', color: 'cyan' }],
    desc: '支付回调重试与对账',
    commit: '9e0b44f',
    who: '张三',
    avatar: '张',
    time: '2024-03-12 11:40',
    status: '已发布',
  },
]

const artifacts = [
  { name: 'mall-frontend-2.1.0.tar.gz', size: '12.4 MB', time: '今天 10:20' },
  { name: 'order-service-2.1.0.jar', size: '48.2 MB', time: '今天 10:18' },
  { name: 'pay-service-1.4.2.zip', size: '22.1 MB', time: '昨天 17:05' },
  { name: 'user-center-3.0.1.tar.gz', size: '18.6 MB', time: '周一 11:12' },
]

const branches = [
  { name: 'main', role: '生产分支', ver: 'v2.1.0' },
  { name: 'develop', role: '集成分支', ver: 'v2.1.0-rc.2' },
  { name: 'release/2.1', role: '发布分支', ver: 'v2.1.0' },
  { name: 'hotfix/redis', role: '热修分支', ver: 'v2.0.9' },
]

const hotTags = [
  { name: 'latest', count: 6 },
  { name: 'stable', count: 11 },
  { name: 'hotfix', count: 4 },
  { name: 'rc', count: 8 },
  { name: 'beta', count: 3 },
  { name: 'feature', count: 7 },
]

const history = [
  { env: '生产环境', ver: 'v2.1.0', who: '张三', time: '10 分钟前', ok: true },
  { env: '预发环境', ver: 'v2.1.0-rc.1', who: '李四', time: '1 小时前', ok: true },
  { env: '测试环境', ver: 'v2.1.0-rc.1', who: '王五', time: '昨天', ok: true },
  { env: '生产环境', ver: 'v2.0.9', who: '张三', time: '3 天前', ok: true },
]

export default function VersionV2Page() {
  const [tab, setTab] = useState('overview')
  const [project, setProject] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('newest')
  const [q, setQ] = useState('')
  const [leftVer, setLeftVer] = useState('v2.0.9')
  const [rightVer, setRightVer] = useState('v2.1.0')

  const list = useMemo(() => {
    return versionRows.filter((r) => {
      if (status !== 'all' && r.status !== status) return false
      if (q && !`${r.ver}${r.desc}${r.tags.map((t) => t.text).join('')}`.includes(q)) return false
      return true
    })
  }, [q, status])

  const columns: ColumnsType<VerRow> = [
    {
      title: '版本号',
      dataIndex: 'ver',
      width: 100,
      render: (v: string) => <strong>{v}</strong>,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 160,
      render: (tags: VerRow['tags']) => (
        <Space size={4} wrap>
          {tags.map((t) => (
            <Tag key={t.text} color={t.color}>
              {t.text}
            </Tag>
          ))}
        </Space>
      ),
    },
    { title: '说明', dataIndex: 'desc', ellipsis: true },
    {
      title: 'Commit',
      dataIndex: 'commit',
      width: 110,
      render: (v: string) => (
        <button
          type="button"
          className="ver2-commit"
          onClick={(e) => {
            e.stopPropagation()
            navigator.clipboard?.writeText(v)
            message.success('已复制 Commit')
          }}
        >
          {v}
          <CopyOutlined />
        </button>
      ),
    },
    {
      title: '发布人',
      dataIndex: 'who',
      width: 110,
      render: (_, row) => (
        <span className="ver2-who">
          <Avatar size={22} style={{ background: '#2563eb', fontSize: 11 }}>
            {row.avatar}
          </Avatar>
          {row.who}
        </span>
      ),
    },
    { title: '发布时间', dataIndex: 'time', width: 150 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 88,
      render: (v: string) => <StatusTag text={v} tone="ok" />,
    },
    {
      title: '操作',
      width: 88,
      render: () => (
        <Space size={0}>
          <Button
            type="link"
            size="small"
            icon={<CloudDownloadOutlined />}
            onClick={() => message.success('开始下载制品（演示）')}
          />
          <Button type="link" size="small" onClick={() => message.info('更多操作（演示）')}>
            ···
          </Button>
        </Space>
      ),
    },
  ]

  const verOptions = versionRows.map((v) => ({ value: v.ver, label: v.ver }))

  return (
    <div className="ver2-page">
      <div className="ver2-toolbar">
        <div className="ver2-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`ver2-tab ${tab === t.key ? 'is-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => message.success('已打开发布新版本向导（演示）')}
        >
          发布新版本
        </Button>
      </div>

      {tab === 'overview' ? (
        <>
          <div className="ver2-stats">
            <StatCard title="版本总数" value={42} delta="6 较上月" deltaUp={false} icon={<TagOutlined />} />
            <StatCard title="标签总数" value={18} delta="3 较上月" icon={<TagOutlined />} />
            <StatCard title="关联分支" value={12} delta="2 较上月" icon={<BranchesOutlined />} />
            <StatCard title="制品文件" value={86} delta="12 较上月" icon={<CloudDownloadOutlined />} />
            <StatCard title="本月发布" value={8} delta="4 较上月" />
          </div>

          <div className="ver2-body">
            <Panel title="版本列表">
              <div className="ver2-filters">
                <Select
                  value={project}
                  onChange={setProject}
                  style={{ width: 130 }}
                  options={[
                    { value: 'all', label: '全部项目' },
                    { value: 'mall', label: 'mall-电商平台' },
                    { value: 'pay', label: 'pay-支付服务' },
                  ]}
                />
                <Input
                  allowClear
                  prefix={<SearchOutlined />}
                  placeholder="搜索版本号、标签或说明..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  style={{ width: 220 }}
                />
                <Select
                  value={status}
                  onChange={setStatus}
                  style={{ width: 120 }}
                  options={[
                    { value: 'all', label: '全部状态' },
                    { value: '已发布', label: '已发布' },
                    { value: '草稿', label: '草稿' },
                  ]}
                />
                <Select
                  value={sort}
                  onChange={setSort}
                  style={{ width: 120 }}
                  options={[
                    { value: 'newest', label: '最新优先' },
                    { value: 'oldest', label: '最早优先' },
                  ]}
                />
              </div>
              <Table
                size="small"
                rowKey="key"
                pagination={false}
                columns={columns}
                dataSource={list}
                scroll={{ x: 900, y: 320 }}
              />
            </Panel>

            <div className="ver2-right">
              <Panel title="版本对比">
                <div className="ver2-diff">
                  <div className="ver2-diff-pick">
                    <Select value={leftVer} onChange={setLeftVer} options={verOptions} style={{ width: '100%' }} />
                    <span>vs</span>
                    <Select value={rightVer} onChange={setRightVer} options={verOptions} style={{ width: '100%' }} />
                  </div>
                  <div className="ver2-diff-stats">
                    <div>
                      <strong>128</strong>
                      <em>新增</em>
                    </div>
                    <div>
                      <strong>36</strong>
                      <em>删除</em>
                    </div>
                    <div>
                      <strong>72</strong>
                      <em>修改</em>
                    </div>
                    <div>
                      <strong>18</strong>
                      <em>文件</em>
                    </div>
                  </div>
                  <Button type="primary" block onClick={() => message.info('打开详细对比（演示）')}>
                    查看详细对比
                  </Button>
                </div>
              </Panel>

              <Panel title="发布历史">
                <ul className="ver2-history">
                  {history.map((h) => (
                    <li key={`${h.ver}-${h.env}-${h.time}`}>
                      <i className={`status-dot ${h.ok ? 'ok' : 'danger'}`} />
                      <div>
                        <strong>
                          {h.ver} → {h.env}
                        </strong>
                        <em>
                          {h.who} · {h.time}
                        </em>
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>

          <div className="ver2-bottom">
            <Panel title="制品文件">
              <ul className="ver2-artifacts">
                {artifacts.map((a) => (
                  <li key={a.name}>
                    <div>
                      <strong>{a.name}</strong>
                      <em>
                        {a.size} · {a.time}
                      </em>
                    </div>
                    <Button
                      type="link"
                      size="small"
                      icon={<CloudDownloadOutlined />}
                      onClick={() => message.success(`下载 ${a.name}（演示）`)}
                    />
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="分支与版本关系">
              <ul className="ver2-branches">
                {branches.map((b) => (
                  <li key={b.name}>
                    <div>
                      <strong>{b.name}</strong>
                      <em>{b.role}</em>
                    </div>
                    <Tag color="blue">{b.ver}</Tag>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="热门标签">
              <div className="ver2-tags">
                {hotTags.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    className="ver2-tag-chip"
                    onClick={() => {
                      setQ(t.name)
                      message.info(`已按标签筛选：${t.name}`)
                    }}
                  >
                    <span>{t.name}</span>
                    <em>{t.count}</em>
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        </>
      ) : (
        <Panel
          title={tabs.find((t) => t.key === tab)?.label}
          extra={
            <Button type="link" size="small" onClick={() => setTab('overview')}>
              返回概览
            </Button>
          }
        >
          <div className="ver2-placeholder">
            「{tabs.find((t) => t.key === tab)?.label}」完整视图可在此扩展。当前演示请先使用版本概览中的列表、对比与制品模块。
          </div>
        </Panel>
      )}
    </div>
  )
}
