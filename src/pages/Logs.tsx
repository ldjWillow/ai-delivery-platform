import { Button, Col, Input, Row, Select, Space, Switch, message } from 'antd'
import { useEffect, useState } from 'react'
import { LogView, Panel, StatCard } from '../components/ui'
import { logLines } from '../mock/data'

export default function LogsPage() {
  const [paused, setPaused] = useState(false)
  const [lines, setLines] = useState(logLines)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => {
      const now = new Date()
      const stamp = now.toTimeString().slice(0, 12)
      setLines((prev) =>
        [
          {
            t: stamp,
            lv: Math.random() > 0.85 ? 'WARN' : 'INFO',
            svc: ['order-service', 'coolify', 'actions', 'agent'][Math.floor(Math.random() * 4)],
            msg: 'heartbeat ok · mock stream event',
          },
          ...prev,
        ].slice(0, 40),
      )
    }, 2200)
    return () => clearInterval(t)
  }, [paused])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <Space wrap>
          <Select defaultValue="mall" style={{ width: 160 }} options={[{ value: 'mall', label: 'mall-电商平台' }]} />
          <Select defaultValue="prod" style={{ width: 120 }} options={[{ value: 'prod', label: '生产环境' }]} />
          <Select defaultValue="all" style={{ width: 140 }} options={[{ value: 'all', label: '全部服务' }]} />
          <Select defaultValue="all" style={{ width: 120 }} options={[{ value: 'all', label: '全部级别' }]} />
          <Input.Search placeholder="TraceId / 关键词" style={{ width: 220 }} allowClear />
        </Space>
        <Space>
          <span style={{ color: '#64748b' }}>实时</span>
          <Switch checked={!paused} onChange={(v) => setPaused(!v)} />
          <Button onClick={() => message.success('已保存查询视图（演示）')}>保存视图</Button>
        </Space>
      </div>

      <Row gutter={[14, 14]}>
        <Col xs={12} md={6}>
          <StatCard title="INFO" value={1284} />
        </Col>
        <Col xs={12} md={6}>
          <StatCard title="WARN" value={36} delta="峰值" deltaUp={false} />
        </Col>
        <Col xs={12} md={6}>
          <StatCard title="ERROR" value={4} deltaUp={false} delta="近 1 小时" />
        </Col>
        <Col xs={12} md={6}>
          <StatCard title="关联告警" value={1} />
        </Col>
      </Row>

      <Panel title="实时日志流" style={{ marginTop: 14 }}>
        <LogView lines={lines} />
      </Panel>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} md={12}>
          <Panel title="事件详情">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>traceId: tr_9812af</div>
              <div>versionId: v2.1.0</div>
              <div>deployId: #428</div>
              <div>service: order-service</div>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => message.info('已复制 TraceId')}
              >
                复制 TraceId
              </Button>
            </Space>
          </Panel>
        </Col>
        <Col xs={24} md={12}>
          <Panel title="关联分析">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>关联版本 v2.1.0 · 部署 #428</div>
              <div>关联告警 AL-901 · Staging Redis</div>
              <div>可跳转：版本管理 / 部署中心 / 告警中心</div>
            </Space>
          </Panel>
        </Col>
      </Row>
    </div>
  )
}
