import {
  AppstoreOutlined,
  AuditOutlined,
  BellOutlined,
  CloudUploadOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  GithubOutlined,
  KeyOutlined,
  LinkOutlined,
  LockOutlined,
  MailOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { Button, Form, Input, Select, Space, Switch, message } from 'antd'
import { useMemo, useState, type ReactNode } from 'react'
import { Panel, StatCard } from '../components/ui'
import '../styles/settings.css'

type CategoryKey =
  | 'basic'
  | 'org'
  | 'notify'
  | 'integration'
  | 'ai'
  | 'security'
  | 'audit'
  | 'backup'

const categories: {
  key: CategoryKey
  title: string
  desc: string
  icon: ReactNode
}[] = [
  { key: 'basic', title: '基础设置', desc: '平台基本信息与品牌配置', icon: <SettingOutlined /> },
  { key: 'org', title: '组织与权限', desc: '成员、角色与权限管理', icon: <TeamOutlined /> },
  { key: 'notify', title: '通知与消息', desc: '消息渠道与通知策略', icon: <BellOutlined /> },
  { key: 'integration', title: '集成配置', desc: '第三方服务与接口集成', icon: <AppstoreOutlined /> },
  { key: 'ai', title: 'AI / 模型配置', desc: '模型服务与 AI 能力设置', icon: <RobotOutlined /> },
  { key: 'security', title: '安全策略', desc: '认证、访问控制与安全防护', icon: <SafetyCertificateOutlined /> },
  { key: 'audit', title: '审计日志', desc: '操作日志与审计配置', icon: <AuditOutlined /> },
  { key: 'backup', title: '数据备份', desc: '数据备份与恢复策略', icon: <DatabaseOutlined /> },
]

const integrations = [
  { name: 'GitHub', desc: '代码仓库与协作', status: '已连接', icon: <GithubOutlined />, on: true },
  { name: 'GitHub Actions', desc: 'CI / CD 流水线', status: '已连接', icon: <ThunderboltOutlined />, on: true },
  { name: 'Coolify', desc: '部署与运行时', status: '已启用', icon: <CloudUploadOutlined />, on: true },
  { name: 'Webhook', desc: '事件回调通知', status: '已启用', icon: <LinkOutlined />, on: true },
  { name: 'SMTP', desc: '邮件发送服务', status: '已启用', icon: <MailOutlined />, on: true },
  { name: 'OAuth / SSO', desc: '企业单点登录', status: '已启用', icon: <SafetyCertificateOutlined />, on: true },
]

const securityItems = [
  { title: 'API 密钥管理', desc: '管理开放接口访问凭证', action: '管理密钥', icon: <KeyOutlined /> },
  { title: '登录保护', desc: '异常登录检测与锁定', action: '已启用', icon: <LockOutlined /> },
  { title: '二步验证', desc: '可选开启二次校验', action: '可选', icon: <SafetyCertificateOutlined /> },
  { title: 'IP 白名单', desc: '限制控制台访问来源', action: '未启用', icon: <ClusterOutlined /> },
  { title: '数据保留周期', desc: '日志与审计保留时长', action: '180 天', icon: <DatabaseOutlined /> },
]

export default function SettingsPage() {
  const [category, setCategory] = useState<CategoryKey>('basic')
  const [sloganLen, setSloganLen] = useState(12)
  const [form] = Form.useForm()

  const active = useMemo(() => categories.find((c) => c.key === category)!, [category])

  const onSave = async () => {
    try {
      await form.validateFields()
      message.success('设置已保存（演示）')
    } catch {
      /* validation */
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-stats">
        <StatCard title="配置项总数" value={48} delta="12 较上周" icon={<SettingOutlined />} />
        <StatCard title="已启用集成" value={6} delta="2 较上周" icon={<AppstoreOutlined />} />
        <StatCard title="角色数量" value={12} delta="2 较上周" icon={<TeamOutlined />} />
        <StatCard title="安全评分" value={92} delta="5 较上周" icon={<SafetyCertificateOutlined />} />
      </div>

      <div className="settings-layout">
        <aside className="settings-cats">
          <div className="settings-section-title">设置分类</div>
          <div className="settings-cat-grid">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`settings-cat-card ${category === c.key ? 'is-active' : ''}`}
                onClick={() => setCategory(c.key)}
              >
                <span className="settings-cat-icon">{c.icon}</span>
                <span className="settings-cat-text">
                  <strong>{c.title}</strong>
                  <em>{c.desc}</em>
                </span>
                <span className="settings-cat-chevron" aria-hidden>
                  ›
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="settings-main">
          {category === 'basic' ? (
            <>
              <Panel
                title="基础设置"
                extra={
                  <Space>
                    <Button onClick={() => form.resetFields()}>取消</Button>
                    <Button type="primary" onClick={onSave}>
                      保存设置
                    </Button>
                  </Space>
                }
              >
                <Form
                  form={form}
                  layout="vertical"
                  requiredMark
                  className="settings-basic-form"
                  initialValues={{
                    name: 'AI 软件交付平台',
                    locale: 'zh-CN',
                    timezone: 'Asia/Shanghai',
                    slogan: '更快的交付，更大的可能',
                  }}
                  onValuesChange={(_, all) => {
                    if (typeof all.slogan === 'string') setSloganLen(all.slogan.length)
                  }}
                >
                  <div className="settings-basic-grid">
                    <div>
                      <Form.Item label="平台名称" name="name" rules={[{ required: true, message: '请输入平台名称' }]}>
                        <Input placeholder="平台名称" />
                      </Form.Item>
                      <Form.Item label="默认语言" name="locale" rules={[{ required: true }]}>
                        <Select
                          options={[
                            { value: 'zh-CN', label: '简体中文' },
                            { value: 'en-US', label: 'English' },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item label="时区" name="timezone" rules={[{ required: true }]}>
                        <Select
                          options={[
                            { value: 'Asia/Shanghai', label: '(GMT+08:00) 北京, 上海, 香港' },
                            { value: 'UTC', label: '(GMT+00:00) UTC' },
                          ]}
                        />
                      </Form.Item>
                    </div>

                    <div>
                      <div className="settings-field-label">品牌 Logo</div>
                      <div className="settings-logo-box">
                        <div className="settings-logo-preview" aria-hidden>
                          <span />
                        </div>
                        <div>
                          <div className="settings-logo-title">点击上传 Logo</div>
                          <div className="settings-logo-hint">支持 PNG / JPG / SVG，建议 256×256</div>
                          <Button size="small" style={{ marginTop: 8 }} onClick={() => message.info('演示环境暂不上传文件')}>
                            更换图片
                          </Button>
                        </div>
                      </div>

                      <Form.Item
                        label="首页标语"
                        name="slogan"
                        style={{ marginTop: 16, marginBottom: 0 }}
                        extra={<span className="settings-char-count">{sloganLen}/50</span>}
                      >
                        <Input maxLength={50} />
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </Panel>

              <div className="settings-side-row">
                <Panel title="接口与集成">
                  <ul className="settings-list">
                    {integrations.map((item) => (
                      <li key={item.name} className="settings-list-item">
                        <span className="settings-list-icon">{item.icon}</span>
                        <div className="settings-list-body">
                          <strong>{item.name}</strong>
                          <span>{item.desc}</span>
                        </div>
                        <span className="settings-list-status">
                          <i />
                          {item.status}
                        </span>
                        <Button type="link" size="small" onClick={() => message.info(`${item.name} 配置（演示）`)}>
                          配置
                        </Button>
                        <Switch size="small" defaultChecked={item.on} />
                      </li>
                    ))}
                  </ul>
                </Panel>

                <Panel title="安全设置">
                  <ul className="settings-list settings-list--security">
                    {securityItems.map((item) => (
                      <li key={item.title} className="settings-list-item settings-list-item--link">
                        <span className="settings-list-icon">{item.icon}</span>
                        <div className="settings-list-body">
                          <strong>{item.title}</strong>
                          <span>{item.desc}</span>
                        </div>
                        <button type="button" className="settings-list-action" onClick={() => message.info(`${item.title}（演示）`)}>
                          {item.action}
                          <span aria-hidden>›</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="settings-recent">
                    <div className="settings-recent-title">最近操作</div>
                    <div className="settings-recent-item">张三 · 更新登录保护策略 · 今天 10:24</div>
                    <div className="settings-recent-item">安全事件 · 异地登录拦截 1 次 · 昨天 22:08</div>
                  </div>
                </Panel>
              </div>
            </>
          ) : (
            <Panel title={active.title}>
              <div className="settings-placeholder">
                <div className="settings-placeholder-icon">{active.icon}</div>
                <h3>{active.title}</h3>
                <p>{active.desc}</p>
                <p className="settings-placeholder-hint">该分类配置面板为演示占位，可按模块继续展开。</p>
                <Button type="primary" onClick={() => setCategory('basic')}>
                  返回基础设置
                </Button>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}
