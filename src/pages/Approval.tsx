import { Button, Col, Drawer, Input, Row, Space, Table, message } from 'antd'
import { useState } from 'react'
import { Panel, StatCard, StatusTag } from '../components/ui'
import { approvals } from '../mock/data'

export default function ApprovalPage() {
  const [data, setData] = useState(approvals)
  const [current, setCurrent] = useState<(typeof approvals)[0] | null>(null)
  const [comment, setComment] = useState('')

  const act = (id: string, status: string) => {
    setData((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    message.success(`已${status} ${id}`)
    setCurrent(null)
    setComment('')
  }

  return (
    <div>
      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="待我审批" value={data.filter((a) => a.status.includes('待') || a.status.includes('中')).length} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="高风险" value={data.filter((a) => a.risk === '高').length} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="今日已通过" value={1} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="超时提醒" value={0} />
        </Col>
      </Row>

      <Panel title="审批列表" style={{ marginTop: 14 }}>
        <Table
          rowKey="id"
          dataSource={data}
          pagination={false}
          columns={[
            { title: '单号', dataIndex: 'id' },
            { title: '标题', dataIndex: 'title' },
            {
              title: '风险',
              dataIndex: 'risk',
              render: (v: string) => (
                <StatusTag text={v} tone={v === '高' ? 'danger' : v === '中' ? 'warn' : 'muted'} />
              ),
            },
            { title: '申请人', dataIndex: 'applicant' },
            { title: '环境', dataIndex: 'env' },
            {
              title: '状态',
              dataIndex: 'status',
              render: (v: string) => (
                <StatusTag
                  text={v}
                  tone={v.includes('通过') ? 'ok' : v.includes('待') || v.includes('中') ? 'running' : 'muted'}
                />
              ),
            },
            { title: '时间', dataIndex: 'time' },
            {
              title: '操作',
              render: (_, row) => (
                <Button type="link" onClick={() => setCurrent(row)}>
                  查看详情
                </Button>
              ),
            },
          ]}
        />
      </Panel>

      <Drawer
        title={current ? `审批详情 ${current.id}` : '审批详情'}
        open={!!current}
        onClose={() => setCurrent(null)}
        width={420}
      >
        {current ? (
          <Space direction="vertical" style={{ width: '100%' }} size={14}>
            <div>
              <strong>{current.title}</strong>
            </div>
            <div>申请人：{current.applicant}</div>
            <div>环境：{current.env}</div>
            <div>
              风险：
              <StatusTag
                text={current.risk}
                tone={current.risk === '高' ? 'danger' : current.risk === '中' ? 'warn' : 'muted'}
              />
            </div>
            <div>变更范围：mall-frontend / mall-backend / order-service</div>
            <div>测试结论：Test/Staging 已通过 · 关联构建 #425</div>
            <Input.TextArea
              rows={3}
              placeholder="填写审批意见"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Space>
              <Button type="primary" onClick={() => act(current.id, '已通过')}>
                同意
              </Button>
              <Button danger onClick={() => act(current.id, '已拒绝')}>
                拒绝
              </Button>
              <Button onClick={() => message.info('已转交（演示）')}>转交</Button>
            </Space>
          </Space>
        ) : null}
      </Drawer>
    </div>
  )
}
