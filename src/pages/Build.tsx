import { BuildOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Progress, Row, Select, Space, Table, message } from 'antd'
import { Pie } from '@ant-design/charts'
import dayjs from 'dayjs'
import { Panel, StatCard, StatusTag } from '../components/ui'
import { buildRecords } from '../mock/data'

const { RangePicker } = DatePicker

export default function BuildPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <Space wrap>
          <Select defaultValue="all" style={{ width: 140 }} options={[{ value: 'all', label: '全部项目' }]} />
          <Select defaultValue="all" style={{ width: 140 }} options={[{ value: 'all', label: '全部构建类型' }]} />
          <Select defaultValue="all" style={{ width: 120 }} options={[{ value: 'all', label: '全部状态' }]} />
          <RangePicker defaultValue={[dayjs('2024-04-15'), dayjs('2024-04-22')]} />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => message.success('已创建构建任务（演示）')}>
          新建构建
        </Button>
      </div>

      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} xl={4} flex="1 1 160px">
          <StatCard title="构建总数" value={56} delta="12 较上周" icon={<BuildOutlined />} />
        </Col>
        <Col xs={24} sm={12} xl={4} flex="1 1 160px">
          <StatCard title="成功构建" value={48} delta="10 · 成功率 85.7%" />
        </Col>
        <Col xs={24} sm={12} xl={4} flex="1 1 160px">
          <StatCard title="失败构建" value={6} delta="2 · 失败率 10.7%" deltaUp={false} />
        </Col>
        <Col xs={24} sm={12} xl={4} flex="1 1 160px">
          <StatCard title="平均时长" value="4m32s" delta="18% 较上周" deltaUp={false} />
        </Col>
        <Col xs={24} sm={12} xl={4} flex="1 1 160px">
          <StatCard title="构建制品" value={286} delta="36 较上周" />
        </Col>
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} lg={8}>
          <Panel title="构建任务队列 (3)">
            {[
              { n: 'mall-电商平台', p: 62, e: '预计 2m 18s' },
              { n: 'pay-支付服务', p: 28, e: '预计 6m 12s' },
              { n: 'user-用户中心', p: 0, e: '排队 · 预计 8m 10s' },
            ].map((b) => (
              <div key={b.n} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{b.n}</strong>
                  <StatusTag text={b.p === 0 ? '排队' : '运行中'} tone={b.p === 0 ? 'muted' : 'running'} />
                </div>
                <Progress className={b.p ? 'progress-live' : undefined} percent={b.p} size="small" />
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{b.e}</div>
              </div>
            ))}
          </Panel>
        </Col>
        <Col xs={24} lg={8}>
          <Panel title="Maven / npm / Docker">
            <Space direction="vertical" style={{ width: '100%' }} size={10}>
              <div>Maven · mall-电商平台 <StatusTag text="构建成功" tone="ok" /></div>
              <div>Maven · order-订单服务 <StatusTag text="构建成功" tone="ok" /></div>
              <div>npm · mall-frontend <StatusTag text="构建成功" tone="ok" /></div>
              <div>npm · admin-管理后台 <StatusTag text="构建失败" tone="danger" /></div>
              <div>Docker · pay-service:0.8.5 <StatusTag text="已推送" tone="ok" /></div>
              <div>Docker · mall-frontend:1.2.0 <StatusTag text="已推送" tone="ok" /></div>
            </Space>
          </Panel>
        </Col>
        <Col xs={24} lg={8}>
          <Panel title="Runner 资源">
            <Pie
              data={[
                { type: '运行中', value: 8 },
                { type: '空闲', value: 4 },
                { type: '离线', value: 6 },
                { type: '维护', value: 2 },
              ]}
              angleField="value"
              colorField="type"
              innerRadius={0.7}
              height={200}
              legend={{ position: 'bottom' }}
              label={false}
            />
            <div style={{ textAlign: 'center', marginTop: -8, color: '#64748b' }}>在线 12 / 20</div>
          </Panel>
        </Col>
      </Row>

      <Panel title="最近构建记录" style={{ marginTop: 14 }}>
        <Table
          rowKey="no"
          dataSource={buildRecords}
          pagination={false}
          columns={[
            { title: '构建号', dataIndex: 'no' },
            { title: '项目', dataIndex: 'project' },
            { title: '分支', dataIndex: 'branch' },
            { title: '类型', dataIndex: 'type' },
            {
              title: '状态',
              dataIndex: 'status',
              render: (v: string) => <StatusTag text={v} tone={v === '成功' ? 'ok' : 'danger'} />,
            },
            { title: '耗时', dataIndex: 'duration' },
            { title: '触发人', dataIndex: 'by' },
            {
              title: '操作',
              render: () => (
                <Space>
                  <Button type="link" onClick={() => message.info('打开构建日志（演示）')}>
                    查看日志
                  </Button>
                  <Button type="link" icon={<DownloadOutlined />}>
                    制品
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Panel>
    </div>
  )
}
