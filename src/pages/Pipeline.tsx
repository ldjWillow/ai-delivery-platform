import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Button, Col, Progress, Row, Space, Steps, Table, Tabs, Tag, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { Panel, StatCard, StatusTag } from '../components/ui'
import { pipelines, recentRuns } from '../mock/data'

const { Text } = Typography

const toneOf = (s: string) => {
  if (s.includes('成功')) return 'ok' as const
  if (s.includes('失败')) return 'danger' as const
  if (s.includes('运行') || s.includes('部署')) return 'running' as const
  return 'muted' as const
}

export default function PipelinePage() {
  const [percent, setPercent] = useState(72)
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    if (cancelled) return
    const t = setInterval(() => {
      setPercent((p) => (p >= 96 ? 72 : p + 1))
    }, 900)
    return () => clearInterval(t)
  }, [cancelled])

  return (
    <div>
      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="流水线总数" value={8} delta="2 较上周" icon={<PlayCircleOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="今日执行次数" value={24} delta="8 较昨日" icon={<CheckCircleOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="平均执行时长"
            value="6分12秒"
            delta="32% 较上周"
            deltaUp={false}
            icon={<ClockCircleOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="失败次数"
            value={2}
            delta="60% 较昨日"
            deltaUp={false}
            icon={<CloseCircleOutlined />}
          />
        </Col>
      </Row>

      <Panel
        title="核心流水线"
        extra={
          <Space>
            <Button icon={<SettingOutlined />}>流水线设置</Button>
            <Button type="primary" icon={<PlusOutlined />}>
              新建流水线
            </Button>
          </Space>
        }
        style={{ marginTop: 14 }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'stretch' }}>
          {[
            { name: 'Cursor Agent', status: '成功', time: '1m 24s', active: false },
            { name: 'GitHub Actions', status: '成功', time: '3m 18s', active: false },
            { name: 'Coolify', status: cancelled ? '已取消' : '运行中', time: '2m 6s', active: !cancelled },
          ].map((s) => (
            <div key={s.name} className={`pipeline-stage ${s.active ? 'active' : ''}`}>
              <div style={{ fontWeight: 700 }}>{s.name}</div>
              <div style={{ marginTop: 8 }}>
                <StatusTag text={s.status} tone={toneOf(s.status)} />
              </div>
              <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                {s.time}
              </Text>
            </div>
          ))}
          <div
            className="pipeline-stage dashed"
            onClick={() => message.success('已打开添加阶段（演示）')}
          >
            + 添加阶段
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 12,
            background: '#F8FAFC',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <Text strong>mall-电商平台</Text>
              <div style={{ marginTop: 4 }}>
                <Tag>main</Tag>
                <Tag>a3f91c2</Tag>
                <Text type="secondary">feat: 新推荐模型 · 张三</Text>
              </div>
            </div>
            <Button
              danger={cancelled}
              onClick={() => {
                setCancelled(true)
                message.warning('已取消当前执行（演示）')
              }}
            >
              {cancelled ? '已取消' : '取消执行'}
            </Button>
          </div>
          <Progress
            className={cancelled ? undefined : 'progress-live'}
            percent={cancelled ? percent : percent}
            status={cancelled ? 'exception' : 'active'}
            style={{ marginTop: 12 }}
            format={(p) => `${p}% · 3/4 阶段`}
          />
          <Steps
            size="small"
            style={{ marginTop: 14 }}
            current={cancelled ? 2 : 2}
            status={cancelled ? 'error' : 'process'}
            items={[
              { title: '代码检查', status: 'finish' },
              { title: '构建测试', status: 'finish' },
              { title: '部署上线', status: cancelled ? 'error' : 'process' },
              { title: '健康检查', status: 'wait' },
            ]}
          />
        </div>
      </Panel>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} xl={14}>
          <Panel title="流水线列表">
            <Tabs
              items={[
                { key: 'all', label: `全部 ${pipelines.length}` },
                { key: 'run', label: `运行中 ${pipelines.filter((p) => p.status === '运行中').length}` },
                { key: 'ok', label: `成功 ${pipelines.filter((p) => p.status === '成功').length}` },
                { key: 'fail', label: `失败 ${pipelines.filter((p) => p.status === '失败').length}` },
                { key: 'pause', label: `暂停 ${pipelines.filter((p) => p.status === '暂停').length}` },
              ]}
            />
            <Table
              size="middle"
              pagination={false}
              rowKey="name"
              dataSource={pipelines}
              columns={[
                {
                  title: '名称',
                  dataIndex: 'name',
                  render: (v: string) => (
                    <Space>
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: '#2F6BFF',
                          color: '#fff',
                          display: 'inline-grid',
                          placeItems: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {v[0].toUpperCase()}
                      </span>
                      {v}
                    </Space>
                  ),
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (v: string) => <StatusTag text={v} tone={toneOf(v)} />,
                },
                { title: '分支', dataIndex: 'branch' },
                { title: '最近执行', dataIndex: 'last' },
                { title: '耗时', dataIndex: 'duration' },
                {
                  title: '操作',
                  render: () => (
                    <Button
                      type="link"
                      icon={<PlayCircleOutlined />}
                      onClick={() => message.success('已触发执行（演示）')}
                    />
                  ),
                },
              ]}
            />
          </Panel>
        </Col>
        <Col xs={24} xl={10}>
          <Panel title="最近执行记录">
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {recentRuns.map((r) => (
                <div
                  key={r.no}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: '#F8FAFC',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 650 }}>
                      {r.project} {r.no}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {r.branch} · {r.commit}
                    </Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusTag text={r.status} tone={toneOf(r.status)} />
                    <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 6 }}>{r.time}</div>
                  </div>
                </div>
              ))}
            </Space>
          </Panel>
        </Col>
      </Row>
    </div>
  )
}
