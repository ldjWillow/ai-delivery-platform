import { Button, Form, Input, Select, Space, Switch, Table, Tabs, message } from 'antd'
import { Panel, StatusTag } from '../components/ui'

export default function SettingsPage() {
  return (
    <div>
      <Tabs
        items={[
          {
            key: 'org',
            label: '组织与成员',
            children: (
              <Panel title="成员列表">
                <Table
                  pagination={false}
                  rowKey="name"
                  dataSource={[
                    { name: '张三', role: 'Owner', status: '正常' },
                    { name: '李四', role: 'Admin', status: '正常' },
                    { name: '王五', role: 'Developer', status: '正常' },
                    { name: '陈六', role: 'Release Manager', status: '正常' },
                    { name: '客户甲', role: 'Viewer/Client', status: '正常' },
                  ]}
                  columns={[
                    { title: '成员', dataIndex: 'name' },
                    { title: '角色', dataIndex: 'role' },
                    {
                      title: '状态',
                      dataIndex: 'status',
                      render: (v: string) => <StatusTag text={v} tone="ok" />,
                    },
                    {
                      title: '操作',
                      render: () => (
                        <Space>
                          <Button type="link" size="small">
                            编辑
                          </Button>
                          <Button type="link" size="small" danger>
                            禁用
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                />
              </Panel>
            ),
          },
          {
            key: 'rbac',
            label: '角色权限',
            children: (
              <Panel title="RBAC">
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  {[
                    'Owner · 组织配置 / 账单 / 全部项目',
                    'Admin · 成员 / Provider / 环境管理',
                    'Developer · 代码 / Agent / 构建 / 非生产部署',
                    'Release Manager · 版本 / 审批 / 生产部署 / 回滚',
                    'Viewer/Client · 进度 / 测试环境 / 验收',
                  ].map((t) => (
                    <div key={t} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t}</span>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </Space>
              </Panel>
            ),
          },
          {
            key: 'provider',
            label: 'Provider',
            children: (
              <Panel title="外部集成">
                <Table
                  pagination={false}
                  rowKey="name"
                  dataSource={[
                    { name: 'GitHub', type: 'Git', status: '已连接' },
                    { name: 'GitHub Actions', type: 'CI', status: '已连接' },
                    { name: 'Cursor Agent', type: 'Agent', status: '已连接' },
                    { name: 'Coolify', type: 'Deploy', status: '已连接' },
                    { name: '钉钉', type: '通知', status: '异常' },
                  ]}
                  columns={[
                    { title: '名称', dataIndex: 'name' },
                    { title: '类型', dataIndex: 'type' },
                    {
                      title: '状态',
                      dataIndex: 'status',
                      render: (v: string) => (
                        <StatusTag text={v} tone={v === '已连接' ? 'ok' : 'danger'} />
                      ),
                    },
                    {
                      title: '操作',
                      render: () => (
                        <Button type="link" size="small" onClick={() => message.success('连接测试通过（演示）')}>
                          测试连接
                        </Button>
                      ),
                    },
                  ]}
                />
              </Panel>
            ),
          },
          {
            key: 'secrets',
            label: '凭证密钥',
            children: (
              <Panel title="凭证">
                <Form layout="vertical" style={{ maxWidth: 480 }}>
                  <Form.Item label="名称" required>
                    <Input placeholder="例如 github-token" />
                  </Form.Item>
                  <Form.Item label="类型" required>
                    <Select
                      options={[
                        { value: 'token', label: 'Token' },
                        { value: 'secret', label: 'Secret' },
                        { value: 'ssh', label: 'SSH Key' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item label="内容" required>
                    <Input.Password placeholder="前端仅保存掩码演示，不会回显明文" />
                  </Form.Item>
                  <Button type="primary" onClick={() => message.success('已加密保存（演示）')}>
                    保存
                  </Button>
                </Form>
              </Panel>
            ),
          },
          {
            key: 'audit',
            label: '审计日志',
            children: (
              <Panel title="最近审计">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>张三 · 生产回滚确认 · 今天 10:30</div>
                  <div>李四 · 更新 Provider Token · 今天 09:12</div>
                  <div>王五 · 同意审批 A-318 · 今天 09:55</div>
                  <div>系统 · Webhook 重试成功 · 昨天 22:01</div>
                </Space>
              </Panel>
            ),
          },
        ]}
      />
    </div>
  )
}
