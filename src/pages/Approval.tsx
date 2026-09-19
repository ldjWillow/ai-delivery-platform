import {
  AuditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  RocketOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Pie } from '@ant-design/charts'
import { Avatar, Button, Input, Segmented, Select, Space, Tabs, Tag, message } from 'antd'
import { useMemo, useState } from 'react'
import { Panel, StatCard, StatusTag } from '../components/ui'
import { approvals as seed } from '../mock/data'
import '../styles/approval.css'

type Row = (typeof seed)[number]
type TabKey = '待我审批' | '审批中' | '已通过' | '已拒绝' | '全部'

const riskTone = (risk: string) => (risk === '高' ? 'danger' : risk === '中' ? 'warn' : 'ok')
const riskColor = (risk: string) => (risk === '高' ? 'red' : risk === '中' ? 'gold' : 'green')

const recentRecords = [
  { title: 'mall-frontend 热修发布', result: '已通过', who: '张三', time: '2 小时前' },
  { title: 'order 扩容申请', result: '已通过', who: '李四', time: '昨天' },
  { title: '开放导出 API', result: '已拒绝', who: '王五', time: '前天' },
]

const approvers = [
  { name: '张三', role: '技术负责人', count: 18, avatar: '张' },
  { name: '李四', role: '前端开发', count: 12, avatar: '李' },
  { name: '王五', role: '后端开发', count: 9, avatar: '王' },
  { name: '陈六', role: '运维', count: 7, avatar: '陈' },
]

export default function ApprovalPage() {
  const [data, setData] = useState(seed)
  const [tab, setTab] = useState<TabKey>('待我审批')
  const [project, setProject] = useState('all')
  const [env, setEnv] = useState('all')
  const [type, setType] = useState('all')
  const [q, setQ] = useState('')
  const [currentId, setCurrentId] = useState(seed.find((a) => a.status === '待我审批')?.id ?? seed[0].id)
  const [detailTab, setDetailTab] = useState('basic')
  const [comment, setComment] = useState('')

  const counts = useMemo(
    () => ({
      mine: data.filter((a) => a.status === '待我审批').length,
      doing: data.filter((a) => a.status === '审批中').length,
      ok: data.filter((a) => a.status === '已通过').length,
      reject: data.filter((a) => a.status === '已拒绝').length,
    }),
    [data],
  )

  const list = useMemo(() => {
    return data.filter((a) => {
      if (tab !== '全部' && a.status !== tab) return false
      if (project !== 'all' && a.project !== project) return false
      if (env !== 'all' && a.env !== env) return false
      if (type !== 'all' && a.type !== type) return false
      if (q && !`${a.title}${a.version}${a.applicant}${a.id}`.includes(q)) return false
      return true
    })
  }, [data, tab, project, env, type, q])

  const current = data.find((a) => a.id === currentId) ?? list[0] ?? data[0]

  const act = (id: string, status: Row['status']) => {
    setData((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    message.success(`已${status} ${id}`)
    setComment('')
  }

  return (
    <div className="appr-page">
      <div className="appr-stats">
        <StatCard title="待我审批" value={counts.mine} delta="1 较上周" icon={<ClockCircleOutlined />} />
        <StatCard title="审批中" value={counts.doing} delta="2 较上周" deltaUp={false} icon={<AuditOutlined />} />
        <StatCard title="已通过" value={counts.ok} delta="12 较上周" icon={<CheckCircleOutlined />} />
        <StatCard title="已拒绝" value={counts.reject} delta="1 较上周" deltaUp={false} icon={<CloseCircleOutlined />} />
      </div>

      <div className="appr-body">
        <div className="appr-left">
          <div className="appr-toolbar">
            <Segmented
              value={tab}
              onChange={(v) => setTab(v as TabKey)}
              options={['待我审批', '审批中', '已通过', '已拒绝', '全部']}
            />
            <Space wrap>
              <Select
                value={project}
                onChange={setProject}
                style={{ width: 140 }}
                options={[
                  { value: 'all', label: '全部项目' },
                  { value: 'mall-电商平台', label: 'mall-电商平台' },
                  { value: 'pay-支付服务', label: 'pay-支付服务' },
                  { value: 'user-用户中心', label: 'user-用户中心' },
                  { value: 'infra', label: 'infra' },
                ]}
              />
              <Select
                value={env}
                onChange={setEnv}
                style={{ width: 130 }}
                options={[
                  { value: 'all', label: '全部环境' },
                  { value: '生产环境', label: '生产环境' },
                  { value: '预发环境', label: '预发环境' },
                  { value: '测试环境', label: '测试环境' },
                ]}
              />
              <Select
                value={type}
                onChange={setType}
                style={{ width: 130 }}
                options={[
                  { value: 'all', label: '全部类型' },
                  { value: '生产发布', label: '生产发布' },
                  { value: '紧急回滚', label: '紧急回滚' },
                  { value: '容量变更', label: '容量变更' },
                  { value: '配置变更', label: '配置变更' },
                  { value: '功能发布', label: '功能发布' },
                ]}
              />
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="搜索发布主题、版本号或申请人"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ width: 220 }}
              />
            </Space>
          </div>

          <Panel title="发布信息">
            <div className="appr-list">
              {list.length === 0 ? (
                <div className="appr-empty">暂无符合条件的审批单</div>
              ) : (
                list.map((row) => (
                  <div
                    key={row.id}
                    role="button"
                    tabIndex={0}
                    className={`appr-row ${current?.id === row.id ? 'is-active' : ''}`}
                    onClick={() => setCurrentId(row.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setCurrentId(row.id)
                      }
                    }}
                  >
                    <div className="appr-row-info">
                      <span className="appr-row-icon">
                        <RocketOutlined />
                      </span>
                      <div className="appr-row-text">
                        <strong>{row.title}</strong>
                        <em>{row.subtitle}</em>
                      </div>
                    </div>
                    <div className="appr-row-user">
                      <Avatar size={28} style={{ background: '#2563eb', fontSize: 12 }}>
                        {row.avatar}
                      </Avatar>
                      <div className="appr-row-text">
                        <strong>{row.applicant}</strong>
                        <em>{row.role}</em>
                      </div>
                    </div>
                    <div className="appr-row-time">{row.time}</div>
                    <div className="appr-row-risk">
                      <Tag color={riskColor(row.risk)}>{row.risk}风险</Tag>
                    </div>
                    <div className="appr-row-actions" onClick={(e) => e.stopPropagation()}>
                      <Button size="small" onClick={() => setCurrentId(row.id)}>
                        查看
                      </Button>
                      {(row.status === '待我审批' || row.status === '审批中') && (
                        <Button type="primary" size="small" onClick={() => setCurrentId(row.id)}>
                          审批
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <div className="appr-bottom">
            <Panel title="发布风险概览">
              <div className="appr-risk-wrap">
                <Pie
                  data={[
                    { type: '高风险', value: 3 },
                    { type: '中风险', value: 6 },
                    { type: '低风险', value: 5 },
                  ]}
                  angleField="value"
                  colorField="type"
                  innerRadius={0.62}
                  height={160}
                  legend={{ position: 'top' }}
                  scale={{
                    color: {
                      domain: ['高风险', '中风险', '低风险'],
                      range: ['#dc2626', '#d97706', '#16a34a'],
                    },
                  }}
                />
                <div className="appr-risk-tip">
                  <strong>风险提示</strong>
                  <p>近一周生产环境变更较频繁，建议合并低风险发布窗口，降低回归成本。</p>
                </div>
              </div>
            </Panel>

            <Panel title="最近审批记录">
              <ul className="appr-recent">
                {recentRecords.map((r) => (
                  <li key={r.title}>
                    <StatusTag text={r.result} tone={r.result.includes('通过') ? 'ok' : 'danger'} />
                    <div>
                      <strong>{r.title}</strong>
                      <em>
                        {r.who} · {r.time}
                      </em>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="审批人分布">
              <ul className="appr-approvers">
                {approvers.map((a) => (
                  <li key={a.name}>
                    <Avatar size={32} style={{ background: '#2563eb' }}>
                      {a.avatar}
                    </Avatar>
                    <div>
                      <strong>{a.name}</strong>
                      <em>{a.role}</em>
                    </div>
                    <span>{a.count} 次</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>

        <Panel
          className="appr-detail-panel"
          title={
            current ? (
              <span className="appr-detail-title">
                {current.title} <StatusTag text={`${current.risk}风险`} tone={riskTone(current.risk)} />
              </span>
            ) : (
              '审批详情'
            )
          }
        >
          {current ? (
            <div className="appr-detail">
              <Tabs
                size="small"
                activeKey={detailTab}
                onChange={setDetailTab}
                items={[
                  { key: 'basic', label: '基本信息' },
                  { key: 'change', label: '变更内容' },
                  { key: 'risk', label: '风险评估' },
                  { key: 'comments', label: '审批意见' },
                  { key: 'flow', label: '流程记录' },
                ]}
              />

              {detailTab === 'basic' && (
                <dl className="appr-kv">
                  <div>
                    <dt>申请人</dt>
                    <dd>
                      {current.applicant} · {current.role}
                    </dd>
                  </div>
                  <div>
                    <dt>项目</dt>
                    <dd>{current.project}</dd>
                  </div>
                  <div>
                    <dt>版本</dt>
                    <dd>{current.version}</dd>
                  </div>
                  <div>
                    <dt>环境</dt>
                    <dd>
                      <Tag color={current.env.includes('生产') ? 'red' : 'blue'}>{current.env}</Tag>
                    </dd>
                  </div>
                  <div>
                    <dt>提交时间</dt>
                    <dd>{current.time}</dd>
                  </div>
                  <div>
                    <dt>计划时间</dt>
                    <dd>{current.planTime}</dd>
                  </div>
                  <div>
                    <dt>类型</dt>
                    <dd>{current.type}</dd>
                  </div>
                  <div>
                    <dt>流水线</dt>
                    <dd>{current.pipeline}</dd>
                  </div>
                  <div className="is-full">
                    <dt>描述</dt>
                    <dd>{current.desc}</dd>
                  </div>
                </dl>
              )}

              {detailTab === 'change' && (
                <ul className="appr-plain-list">
                  <li>mall-frontend · 订单导出入口与支付结果页优化</li>
                  <li>mall-backend · 导出任务异步化</li>
                  <li>order-service · 查询接口分页参数校验</li>
                </ul>
              )}

              {detailTab === 'risk' && (
                <ul className="appr-plain-list">
                  <li>影响范围：生产交易链路</li>
                  <li>回滚方案：一键回滚至 v2.0.9</li>
                  <li>验证结论：Test / Staging 冒烟通过</li>
                </ul>
              )}

              {detailTab === 'comments' && (
                <div className="appr-plain-list">暂无历史审批意见</div>
              )}

              {detailTab === 'flow' && (
                <ul className="appr-plain-list">
                  <li>
                    {current.time} · {current.applicant} 提交申请
                  </li>
                  <li>待技术负责人审批</li>
                </ul>
              )}

              {(current.status === '待我审批' || current.status === '审批中') && (
                <div className="appr-detail-foot">
                  <Input.TextArea
                    rows={3}
                    placeholder="请输入审批意见（可选）"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Space>
                    <Button danger onClick={() => act(current.id, '已拒绝')}>
                      拒绝
                    </Button>
                    <Button onClick={() => message.info('已转交（演示）')}>转交</Button>
                    <Button type="primary" onClick={() => act(current.id, '已通过')}>
                      同意
                    </Button>
                  </Space>
                </div>
              )}
            </div>
          ) : (
            <div className="appr-empty">请选择审批单</div>
          )}
        </Panel>
      </div>
    </div>
  )
}
