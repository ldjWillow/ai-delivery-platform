import { Button, Col, Progress, Row, Space, Table, Tabs, message } from 'antd'
import { useState } from 'react'
import { Panel, StatCard, StatusTag } from '../components/ui'
import { envVars, environments, services } from '../mock/data'

export default function EnvironmentPage() {
  const [active, setActive] = useState('dev')
  const current = environments.find((e) => e.key === active)!

  return (
    <div>
      <Row gutter={[14, 14]}>
        {environments.map((e) => (
          <Col xs={24} sm={12} lg={6} key={e.key}>
            <div
              className={`env-chip ${active === e.key ? 'active' : ''}`}
              onClick={() => setActive(e.key)}
              style={{ minHeight: 110 }}
            >
              <StatusTag text={e.status} tone={e.tone} />
              <div style={{ fontWeight: 750, marginTop: 10, fontSize: 16 }}>{e.name}</div>
              <div style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>
                {e.services} 服务 · {e.instances} 实例组 · {e.version}
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 14 }}>
        <Tabs
          activeKey={active}
          onChange={setActive}
          items={environments.map((e) => ({ key: e.key, label: e.name }))}
        />
      </div>

      <Row gutter={[14, 14]}>
        {[
          { t: 'CPU', p: 42, d: '8.4 / 20 cores' },
          { t: '内存', p: 68, d: '13.6 / 20 GB' },
          { t: '存储', p: 36, d: '180 / 500 GB' },
          { t: '带宽', p: 52, d: '52 / 100 Mbps' },
        ].map((r) => (
          <Col xs={12} lg={6} key={r.t}>
            <StatCard title={`${current.name} · ${r.t}`} value={`${r.p}%`} suffix={r.d} />
            <Progress percent={r.p} showInfo={false} style={{ marginTop: -8 }} strokeColor="#2F6BFF" />
          </Col>
        ))}
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} lg={10}>
          <Panel
            title="环境变量"
            extra={
              <Button size="small" onClick={() => message.success('已新增变量（演示）')}>
                新增
              </Button>
            }
          >
            <Table
              size="small"
              pagination={false}
              rowKey="key"
              dataSource={envVars}
              columns={[
                { title: 'Key', dataIndex: 'key' },
                {
                  title: 'Value',
                  dataIndex: 'value',
                  render: (v: string, row) => (row.secret ? '••••••••' : v),
                },
                {
                  title: '类型',
                  render: (_, row) => (
                    <StatusTag text={row.secret ? 'Secret' : '普通'} tone={row.secret ? 'warn' : 'muted'} />
                  ),
                },
              ]}
            />
          </Panel>
        </Col>
        <Col xs={24} lg={14}>
          <Panel title="服务清单">
            <Table
              size="small"
              pagination={false}
              rowKey="name"
              dataSource={services}
              columns={[
                { title: '服务', dataIndex: 'name' },
                { title: '版本', dataIndex: 'version' },
                { title: '实例', dataIndex: 'instances' },
                { title: 'CPU', dataIndex: 'cpu' },
                { title: '内存', dataIndex: 'mem' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (v: string) => (
                    <StatusTag text={v} tone={v === '运行中' ? 'ok' : 'danger'} />
                  ),
                },
                {
                  title: '操作',
                  render: () => (
                    <Space>
                      <Button type="link" size="small" onClick={() => message.info('重启中（演示）')}>
                        重启
                      </Button>
                      <Button type="link" size="small">
                        日志
                      </Button>
                    </Space>
                  ),
                },
              ]}
            />
          </Panel>
        </Col>
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} md={8}>
          <Panel title="域名绑定">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>dev.example.com · 正常 · 证书 320 天</div>
              <div>test.example.com · 正常 · 证书 301 天</div>
              <div>staging.example.com · 正常 · 证书 269 天</div>
            </Space>
          </Panel>
        </Col>
        <Col xs={24} md={8}>
          <Panel title="依赖健康">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>MySQL 8.0.32 <StatusTag text="运行中" tone="ok" /> · 连接 12/100</div>
              <div>Redis 7.0.11 <StatusTag text="运行中" tone="ok" /> · 内存 1.2/4 GB</div>
            </Space>
          </Panel>
        </Col>
        <Col xs={24} md={8}>
          <Panel title="环境健康摘要">
            <StatusTag text="整体健康" tone={current.tone === 'warn' ? 'warn' : 'ok'} />
            <div style={{ marginTop: 10, color: '#64748b', fontSize: 13 }}>
              正常服务 12 · 异常 2 · 告警 0 · 可用性 99.9%
            </div>
          </Panel>
        </Col>
      </Row>
    </div>
  )
}
