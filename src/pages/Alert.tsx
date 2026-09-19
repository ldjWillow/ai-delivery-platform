import { Button, Col, Row, Space, Table, message } from 'antd'
import { useState } from 'react'
import { Panel, StatCard, StatusTag } from '../components/ui'
import { alerts } from '../mock/data'

export default function AlertPage() {
  const [data, setData] = useState(alerts)

  return (
    <div>
      <Row gutter={[14, 14]}>
        <Col xs={12} md={6}>
          <StatCard title="严重" value={data.filter((a) => a.level === '严重').length} />
        </Col>
        <Col xs={12} md={6}>
          <StatCard title="重要" value={data.filter((a) => a.level === '重要').length} />
        </Col>
        <Col xs={12} md={6}>
          <StatCard title="一般" value={data.filter((a) => a.level === '一般').length} />
        </Col>
        <Col xs={12} md={6}>
          <StatCard title="已恢复" value={data.filter((a) => a.status.includes('恢复') || a.status.includes('关闭')).length} />
        </Col>
      </Row>

      <Panel title="活跃告警" style={{ marginTop: 14 }}>
        <Table
          rowKey="id"
          dataSource={data}
          pagination={false}
          columns={[
            { title: 'ID', dataIndex: 'id' },
            {
              title: '级别',
              dataIndex: 'level',
              render: (v: string) => (
                <StatusTag
                  text={v}
                  tone={v === '严重' ? 'danger' : v === '重要' ? 'warn' : 'muted'}
                />
              ),
            },
            { title: '标题', dataIndex: 'title' },
            { title: '项目', dataIndex: 'project' },
            {
              title: '状态',
              dataIndex: 'status',
              render: (v: string) => (
                <StatusTag
                  text={v}
                  tone={v === 'FIRING' ? 'danger' : v.includes('处理') ? 'running' : 'ok'}
                />
              ),
            },
            { title: '时间', dataIndex: 'time' },
            {
              title: '操作',
              render: (_, row) => (
                <Space>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      setData((prev) =>
                        prev.map((a) => (a.id === row.id ? { ...a, status: '处理中' } : a)),
                      )
                      message.success('已确认告警')
                    }}
                  >
                    确认
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      setData((prev) =>
                        prev.map((a) => (a.id === row.id ? { ...a, status: '已关闭' } : a)),
                      )
                      message.success('已关闭')
                    }}
                  >
                    关闭
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Panel>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} md={8}>
          <Panel title="告警规则">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>健康检查失败 · <StatusTag text="启用" tone="ok" /></div>
              <div>部署失败 · <StatusTag text="启用" tone="ok" /></div>
              <div>Redis 连接阈值 · <StatusTag text="启用" tone="ok" /></div>
              <Button size="small" onClick={() => message.success('已打开新建规则（演示）')}>
                新建规则
              </Button>
            </Space>
          </Panel>
        </Col>
        <Col xs={24} md={8}>
          <Panel title="通知渠道">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>钉钉 · 正常</div>
              <div>企业微信 · 正常</div>
              <div>邮件 · 正常</div>
              <div>Webhook · 失败重试中</div>
              <Button size="small" onClick={() => message.success('测试通知已发送（演示）')}>
                测试通知
              </Button>
            </Space>
          </Panel>
        </Col>
        <Col xs={24} md={8}>
          <Panel title="值班">
            <div>当前值班：张三</div>
            <div style={{ marginTop: 8 }}>下一班：李四 · 18:00</div>
            <Button style={{ marginTop: 12 }} size="small" onClick={() => message.info('已申请临时替班')}>
              临时替班
            </Button>
          </Panel>
        </Col>
      </Row>
    </div>
  )
}
