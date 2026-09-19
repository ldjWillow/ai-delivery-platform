import { PlusOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, Form, Input, Progress, Row, Select, Space, Tabs, message } from 'antd'
import { Pie } from '@ant-design/charts'
import { useMemo, useState } from 'react'
import { LogView, Panel, StatCard, StatusTag } from '../components/ui'
import {
  agentRunning,
  agentStats,
  agentTasks,
  overviewLogs,
  reviewSuggestions,
} from '../mock/data'

const toneOf = (s: string) => {
  if (s.includes('完成') || s.includes('已')) return 'ok' as const
  if (s.includes('运行')) return 'running' as const
  if (s.includes('排队') || s.includes('等待') || s.includes('待')) return 'muted' as const
  return 'warn' as const
}

export default function AgentPage() {
  const [open, setOpen] = useState(false)
  const pieData = useMemo(
    () => [
      { type: 'GPT-4o', value: 45 },
      { type: 'Claude 3.5', value: 28 },
      { type: '通义千问', value: 15 },
      { type: '文心一言', value: 8 },
      { type: '其他', value: 4 },
    ],
    [],
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
        <Tabs
          style={{ flex: 1 }}
          items={[
            '总览',
            'AI 编程',
            '代码评审',
            '缺陷修复',
            '测试生成',
            '任务队列',
            '模型管理',
          ].map((t) => ({ key: t, label: t }))}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          新建 AI 任务
        </Button>
      </div>

      <Row gutter={[14, 14]}>
        {agentStats.map((s) => (
          <Col xs={24} sm={12} lg={8} xl={4.8} flex="1 1 180px" key={s.title}>
            <StatCard title={s.title} value={s.value} delta={`${s.delta} 较上周`} icon={<ThunderboltOutlined />} />
          </Col>
        ))}
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} lg={8}>
          <Panel title="AI Agent 执行中">
            <Space direction="vertical" style={{ width: '100%' }} size={14}>
              {agentRunning.map((a) => (
                <div key={a.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 650 }}>{a.name}</div>
                      <div style={{ color: '#64748b', fontSize: 12 }}>{a.task}</div>
                    </div>
                    <StatusTag text="运行中" tone="running" />
                  </div>
                  <Progress className="progress-live" percent={a.percent} size="small" style={{ marginTop: 8 }} />
                  <div style={{ color: '#94a3b8', fontSize: 12 }}>已运行 {a.elapsed}</div>
                </div>
              ))}
            </Space>
          </Panel>
        </Col>
        <Col xs={24} lg={8}>
          <Panel title="近期 AI 任务">
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {agentTasks.map((t) => (
                <div key={t.title} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>耗时 {t.time}</div>
                  </div>
                  <StatusTag text={t.status} tone={toneOf(t.status)} />
                </div>
              ))}
            </Space>
          </Panel>
        </Col>
        <Col xs={24} lg={8}>
          <Panel title="模型使用统计">
            <Pie
              data={pieData}
              angleField="value"
              colorField="type"
              radius={0.9}
              innerRadius={0.68}
              legend={{ position: 'bottom' }}
              height={220}
              label={false}
              annotations={[
                {
                  type: 'text',
                  style: {
                    text: '1,246k\nTokens',
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  },
                },
              ]}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>日消耗 1.86M ↑12%</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>月消耗 34.2M ↓8%</span>
            </div>
          </Panel>
        </Col>
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} lg={8}>
          <Panel title="代码评审建议">
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {reviewSuggestions.map((r) => (
                <div key={r.file} style={{ padding: 10, background: '#F8FAFC', borderRadius: 10 }}>
                  <Space>
                    <StatusTag
                      text={r.level}
                      tone={r.level === '高' ? 'danger' : r.level === '中' ? 'warn' : 'muted'}
                    />
                    <span style={{ fontSize: 12, color: '#64748b' }}>{r.time}</span>
                  </Space>
                  <div style={{ marginTop: 6, fontWeight: 600 }}>{r.text}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: '#94a3b8' }}>{r.file}</div>
                  <Space style={{ marginTop: 8 }}>
                    <Button size="small" type="primary" onClick={() => message.success('已采纳建议')}>
                      采纳
                    </Button>
                    <Button size="small" onClick={() => message.info('已忽略')}>
                      忽略
                    </Button>
                  </Space>
                </div>
              ))}
            </Space>
          </Panel>
        </Col>
        <Col xs={24} lg={8}>
          <Panel title="任务队列">
            {[
              { t: '生成支付退款单测', s: '排队中', w: '约 3 分钟' },
              { t: '修复 CI 失败：admin', s: '排队中', w: '约 5 分钟' },
              { t: 'Review PR #210', s: '排队中', w: '约 8 分钟' },
              { t: '补充导出接口文档', s: '等待中', w: '—' },
              { t: '重构会话过滤器', s: '等待中', w: '—' },
            ].map((q) => (
              <div
                key={q.t}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{q.t}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>预计等待 {q.w}</div>
                </div>
                <StatusTag text={q.s} tone={toneOf(q.s)} />
              </div>
            ))}
          </Panel>
        </Col>
        <Col xs={24} lg={8}>
          <Panel title="运行日志">
            <LogView lines={overviewLogs} />
          </Panel>
        </Col>
      </Row>

      <Drawer title="新建 AI 任务" open={open} onClose={() => setOpen(false)} width={420}>
        <Form
          layout="vertical"
          onFinish={() => {
            message.success('任务已创建并进入队列（演示）')
            setOpen(false)
          }}
        >
          <Form.Item label="任务类型" name="type" initialValue="coding" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'coding', label: 'AI 编程' },
                { value: 'review', label: '代码评审' },
                { value: 'fix', label: '缺陷修复' },
                { value: 'test', label: '测试生成' },
              ]}
            />
          </Form.Item>
          <Form.Item label="关联项目" name="project" initialValue="mall" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'mall', label: 'mall-电商平台' },
                { value: 'pay', label: 'pay-支付服务' },
                { value: 'order', label: 'order-订单服务' },
              ]}
            />
          </Form.Item>
          <Form.Item label="任务描述" name="desc" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="描述需求，例如：采购订单增加导出按钮" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            创建并运行
          </Button>
        </Form>
      </Drawer>
    </div>
  )
}
