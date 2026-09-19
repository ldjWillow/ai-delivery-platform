import {
  CloudServerOutlined,
  DeploymentUnitOutlined,
  PlusOutlined,
  ProjectOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { Button, Col, Progress, Row, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { LogView, MemberStack, Panel, StatCard, StatusTag } from '../components/ui'
import {
  deliveryEvents,
  environments,
  greeting,
  overviewLogs,
  projects,
} from '../mock/data'

const { Text } = Typography

export default function OverviewPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const name = user?.name ?? '张三'
  return (
    <div>
      <div className="overview-hero fade-up">
        <div>
          <h1>
            {greeting()}，{name}
          </h1>
          <p>一眼看懂全局研发交付态势。项目切换已放到顶栏，这里专注 KPI 与风险。</p>
        </div>
        <div className="overview-hero-meta">
          <span>后端 8</span>
          <span>前端 3</span>
          <span>环境 4</span>
          <Button type="primary" icon={<PlusOutlined />}>
            新建项目
          </Button>
        </div>
      </div>

      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="项目总数" value={12} delta="2 较上周" icon={<ProjectOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="流水线运行中"
            value={6}
            delta="2 较上周"
            icon={<DeploymentUnitOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="本周成功部署"
            value={28}
            delta="12 较上周"
            icon={<CloudServerOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="待处理告警"
            value={3}
            delta="5 较上周"
            deltaUp={false}
            icon={<WarningOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} xl={14}>
          <Panel title="项目进展">
            <Space direction="vertical" style={{ width: '100%' }} size={14}>
              {projects.map((p) => (
                <div
                  key={p.key}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 120px 90px 88px',
                    gap: 12,
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: p.color,
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {p.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 650 }}>{p.name}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {p.desc}
                    </Text>
                  </div>
                  <div>
                    <Progress
                      percent={Math.round((p.progress / p.total) * 100)}
                      size="small"
                      strokeColor={p.color}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {p.progress}/{p.total} 任务
                    </Text>
                  </div>
                  <MemberStack names={p.members} />
                  <StatusTag text={p.status} tone={p.tone} />
                </div>
              ))}
            </Space>
          </Panel>
        </Col>
        <Col xs={24} xl={10}>
          <Panel title="近期交付动态" extra={<a onClick={() => nav('/pipelines')}>查看全部</a>}>
            <Space direction="vertical" style={{ width: '100%' }} size={14}>
              {deliveryEvents.map((e) => (
                <div
                  key={`${e.title}-${e.time}`}
                  style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}
                >
                  <Space align="start">
                    <span className={`status-dot ${e.tone === 'running' ? 'running' : e.tone}`} />
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {e.title} · {e.action}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {e.detail}
                      </Text>
                    </div>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                    {e.time}
                  </Text>
                </div>
              ))}
            </Space>
          </Panel>
        </Col>
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} xl={10}>
          <Panel title="环境状态" extra={<a onClick={() => nav('/environments')}>环境管理</a>}>
            <Row gutter={[10, 10]}>
              {environments.map((env) => (
                <Col span={12} key={env.key}>
                  <div className="env-chip" onClick={() => nav('/environments')}>
                    <Space>
                      <span className={`status-dot ${env.tone === 'warn' ? 'warn' : 'ok'}`} />
                      <Text strong>{env.name}</Text>
                    </Space>
                    <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
                      {env.status} · {env.services} 服务
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Panel>
        </Col>
        <Col xs={24} xl={14}>
          <Panel title="最新日志" extra={<a onClick={() => nav('/logs')}>日志中心</a>}>
            <LogView lines={overviewLogs} />
          </Panel>
        </Col>
      </Row>
    </div>
  )
}
