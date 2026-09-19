import { Button, Col, Modal, Row, Space, Table, message } from 'antd'
import { useState } from 'react'
import { Panel, StatCard, StatusTag } from '../components/ui'
import { versions } from '../mock/data'

export default function VersionPage() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Release 数" value={18} delta="3 本月" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="活跃 Tag" value={42} delta="5 本周" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="可用制品" value={128} delta="12 较上周" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="待对比差异" value={2} />
        </Col>
      </Row>

      <Panel
        title="版本列表"
        style={{ marginTop: 14 }}
        extra={
          <Space>
            <Button onClick={() => setOpen(true)}>版本对比</Button>
            <Button type="primary" onClick={() => message.success('已创建 Release 草稿（演示）')}>
              创建 Release
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="ver"
          dataSource={versions}
          pagination={false}
          columns={[
            { title: '版本', dataIndex: 'ver', render: (v: string) => <strong>{v}</strong> },
            {
              title: '状态',
              dataIndex: 'status',
              render: (v: string) => (
                <StatusTag text={v} tone={v === '废弃' ? 'muted' : 'ok'} />
              ),
            },
            { title: 'Tag', dataIndex: 'tag' },
            { title: 'Commit', dataIndex: 'commit' },
            { title: '制品 / Digest', dataIndex: 'artifact' },
            { title: '时间', dataIndex: 'time' },
            {
              title: '操作',
              render: () => (
                <Space>
                  <Button type="link" size="small">
                    Changelog
                  </Button>
                  <Button type="link" size="small">
                    跳转部署
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Panel>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} md={12}>
          <Panel title="发布历史">
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <div>v2.1.0 → Production · 张三 · 今天 10:24 · 成功</div>
              <div>v2.1.0-rc.1 → Staging · 李四 · 今天 09:18 · 成功</div>
              <div>v2.0.9 → Production · 张三 · 昨天 18:32 · 失败后回滚</div>
            </Space>
          </Panel>
        </Col>
        <Col xs={24} md={12}>
          <Panel title="关联对象">
            <Space direction="vertical" style={{ width: '100%' }} size={10}>
              <div>需求：采购订单导出按钮</div>
              <div>PR：#92 feat/order-export</div>
              <div>Build：#425 · Image digest sha256:91ab…</div>
              <div>审批：A-318 已通过</div>
            </Space>
          </Panel>
        </Col>
      </Row>

      <Modal
        title="版本对比"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => {
          message.success('差异计算完成（演示）')
          setOpen(false)
        }}
      >
        对比 <strong>v2.1.0</strong> 与 <strong>v2.0.9</strong>：代码 +12/-3 文件，依赖 2 项升级，配置 1 项变更。
      </Modal>
    </div>
  )
}
