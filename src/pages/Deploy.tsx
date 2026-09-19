import { PlusOutlined, RollbackOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Col, Modal, Row, Select, Space, Steps, Table, message } from 'antd'
import { useState } from 'react'
import { Panel, StatCard, StatusTag } from '../components/ui'
import { deployRecords, environments } from '../mock/data'

export default function DeployPage() {
  const [rollbackOpen, setRollbackOpen] = useState(false)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <Space wrap>
          <Select defaultValue="mall" style={{ width: 180 }} options={[{ value: 'mall', label: 'mall-电商平台' }]} />
          <Select defaultValue="all" style={{ width: 120 }} options={[{ value: 'all', label: '全部环境' }]} />
          <Select defaultValue="all" style={{ width: 120 }} options={[{ value: 'all', label: '全部服务' }]} />
          <Select defaultValue="7d" style={{ width: 120 }} options={[{ value: '7d', label: '近 7 天' }]} />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => message.success('已打开新建部署向导（演示）')}>
          新建部署
        </Button>
      </div>

      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="今日部署" value={8} delta="2 较上周" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="部署成功率" value="96.2%" delta="1.1% 较上周" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="平均部署时长" value="2m38s" delta="18% 较上周" deltaUp={false} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="今日失败" value={1} delta="3 较上周" deltaUp={false} />
        </Col>
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} xl={16}>
          <Panel title="发布工作流">
            <Steps
              current={4}
              items={[
                { title: '选择版本' },
                { title: '配置部署' },
                { title: '发布上线' },
                { title: '健康检查' },
                { title: '完成' },
              ]}
            />
            <Row gutter={[10, 10]} style={{ marginTop: 18 }}>
              {environments.map((e) => (
                <Col span={12} md={6} key={e.key}>
                  <div className="env-chip">
                    <StatusTag text={e.status} tone={e.tone} />
                    <div style={{ fontWeight: 700, marginTop: 8 }}>{e.name}</div>
                    <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{e.version}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Panel>

          <Panel title="最近部署记录" style={{ marginTop: 14 }}>
            <Table
              rowKey="no"
              pagination={false}
              dataSource={deployRecords}
              columns={[
                { title: '编号', dataIndex: 'no' },
                { title: '版本', dataIndex: 'version' },
                { title: '环境', dataIndex: 'env' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (v: string) => <StatusTag text={v} tone={v === '成功' ? 'ok' : 'danger'} />,
                },
                { title: '耗时', dataIndex: 'duration' },
                { title: '操作人', dataIndex: 'by' },
                { title: '时间', dataIndex: 'time' },
              ]}
            />
          </Panel>
        </Col>
        <Col xs={24} xl={8}>
          <Panel title="当前发布版本">
            <div style={{ fontSize: 22, fontWeight: 750 }}>v2.1.0</div>
            <div style={{ color: '#64748b', marginTop: 4 }}>正式版 · Production · #428</div>
            <div style={{ marginTop: 12, fontSize: 13 }}>feat: 新推荐模型 · 预期转化提升 15%</div>
            <Space wrap style={{ marginTop: 12 }}>
              {['mall-frontend', 'mall-backend', 'pay-service', 'order-service'].map((s) => (
                <StatusTag key={s} text={s} tone="ok" />
              ))}
            </Space>
          </Panel>
          <Panel title="域名与健康检查" style={{ marginTop: 14 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>www.example.com <StatusTag text="正常" tone="ok" /></div>
              <div>api.example.com <StatusTag text="正常" tone="ok" /></div>
              <div>admin.example.com <StatusTag text="正常" tone="ok" /></div>
              <div>HTTPS 证书剩余 358 天</div>
              <div>服务可用性 12/12 · 接口 56/56 · DB/Cache 正常</div>
            </Space>
            <Space style={{ marginTop: 16 }}>
              <Button icon={<RollbackOutlined />} onClick={() => setRollbackOpen(true)}>
                回滚版本
              </Button>
              <Button danger icon={<WarningOutlined />} onClick={() => setRollbackOpen(true)}>
                紧急回退
              </Button>
            </Space>
          </Panel>
        </Col>
      </Row>

      <Modal
        title="确认回滚"
        open={rollbackOpen}
        onCancel={() => setRollbackOpen(false)}
        onOk={() => {
          message.success('已回滚到上一健康版本 v2.0.9（演示）')
          setRollbackOpen(false)
        }}
        okText="确认回滚"
        okButtonProps={{ danger: true }}
      >
        将 Production 回滚到 <strong>v2.0.9</strong>，并记录操作人与原因。此为演示，不会真实变更环境。
      </Modal>
    </div>
  )
}
