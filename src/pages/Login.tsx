import {
  AlertOutlined,
  CloudServerOutlined,
  CodeOutlined,
  DeploymentUnitOutlined,
  GithubOutlined,
  LockOutlined,
  MoonOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Alert, Button, Checkbox, Divider, Form, Input, Tabs, message } from 'antd'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import '../styles/login.css'

const sellPoints = ['项目协作', 'AI Agent', '自动交付', '监控告警']

const orbit = [
  { icon: <CodeOutlined />, label: '需求规划' },
  { icon: <DeploymentUnitOutlined />, label: '开发构建' },
  { icon: <CloudServerOutlined />, label: '部署发布' },
  { icon: <AlertOutlined />, label: '监控运维' },
]

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [mode, setMode] = useState('account')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const onFinish = async (values: { account: string; password: string; remember?: boolean }) => {
    setFormError(null)
    setLoading(true)
    try {
      await login(values.account, values.password)
      nav('/', { replace: true })
    } catch (e) {
      setFormError(e instanceof Error ? e.message : '登录失败，请检查账号或密码后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <aside className="login-visual" aria-label="AI 软件交付平台">
        <div className="login-visual-bg" aria-hidden />
        <div className="login-visual-waves" aria-hidden />

        <header className="login-brand">
          <span className="login-brand-mark" aria-hidden>
            <span />
          </span>
          <div>
            <strong>AI 软件交付平台</strong>
            <span>Build with AI, Deliver Faster</span>
          </div>
        </header>

        <div className="login-visual-body">
          <div className="login-visual-copy">
            <h1>AI 驱动软件交付</h1>
            <p>从需求到部署与监控，一体化智能交付控制。</p>
            <p className="login-sell-line" aria-label="核心能力">
              {sellPoints.map((point, i) => (
                <span key={point}>
                  {i > 0 ? <i className="login-sell-dot" aria-hidden /> : null}
                  {point}
                </span>
              ))}
            </p>
          </div>

          <div className="login-orbit" aria-hidden>
            <div className="login-orbit-stage">
              <div className="login-orbit-glow" />
              <div className="login-orbit-path" />
              {orbit.map((n, i) => (
                <div key={n.label} className={`login-orbit-chip login-orbit-chip--${i}`}>
                  <span>{n.icon}</span>
                  {n.label}
                </div>
              ))}
              <div className="login-orbit-core">
                <div className="login-orbit-cube">
                  <i className="login-orbit-face login-orbit-face--front" />
                  <i className="login-orbit-face login-orbit-face--top" />
                  <i className="login-orbit-face login-orbit-face--side" />
                </div>
                <div className="login-orbit-ring" />
                <div className="login-orbit-base" />
              </div>
            </div>
          </div>
        </div>

        <footer className="login-visual-foot">
          <span>—— 更快的交付，更大的可能 ——</span>
          <em>A Better Tomorrow</em>
        </footer>
      </aside>

      <main className="login-panel">
        <div className="login-panel-bg" aria-hidden />
        <div className="login-panel-top">
          <div className="login-panel-utils">
            <button
              type="button"
              className="login-util-btn"
              title="主题（演示）"
              onClick={() => message.info('演示环境暂未开放主题切换')}
            >
              <MoonOutlined />
            </button>
            <button type="button" className="login-util-btn" onClick={() => message.info('当前仅支持简体中文')}>
              简体中文 ▾
            </button>
          </div>
        </div>

        <div className="login-panel-main">
          <div className="login-panel-card">
            <header className="login-panel-head">
              <h2>欢迎登录</h2>
              <p>登录 AI 软件交付平台，开始更高效的软件研发与交付</p>
            </header>

            <Tabs
              className="login-tabs"
              activeKey={mode}
              onChange={setMode}
              items={[
                { key: 'account', label: '账号登录' },
                { key: 'qr', label: '扫码登录' },
              ]}
            />

            {formError ? (
              <Alert
                className="login-form-error"
                type="error"
                showIcon
                message={formError}
                closable
                onClose={() => setFormError(null)}
              />
            ) : null}

            <div className="login-auth-body">
              <div
                className={mode === 'account' ? 'login-auth-pane is-active' : 'login-auth-pane'}
                aria-hidden={mode !== 'account'}
                inert={mode !== 'account' ? true : undefined}
              >
                <div className="login-enterprise">
                  <button
                    type="button"
                    className="login-enterprise-btn login-enterprise-btn--wecom"
                    onClick={() => message.info('企业微信登录为演示入口')}
                  >
                    <span className="login-sso-wecom">企</span>
                    企业微信登录
                  </button>
                  <button
                    type="button"
                    className="login-enterprise-btn"
                    onClick={() => message.info('SSO 登录为演示入口')}
                  >
                    <SafetyCertificateOutlined />
                    企业 SSO
                  </button>
                </div>

                <Divider className="login-divider" plain>
                  或使用账号密码
                </Divider>

                <Form
                  layout="vertical"
                  requiredMark={false}
                  initialValues={{ account: 'zhangsan', password: '123456', remember: true }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    label="手机号 / 邮箱"
                    name="account"
                    rules={[{ required: true, message: '请输入手机号或邮箱' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="请输入手机号或邮箱" size="large" autoComplete="username" />
                  </Form.Item>
                  <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="请输入密码"
                      size="large"
                      autoComplete="current-password"
                    />
                  </Form.Item>
                  <div className="login-row">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>记住我</Checkbox>
                    </Form.Item>
                    <button type="button" className="login-link" onClick={() => message.info('演示环境请使用默认账号登录')}>
                      忘记密码？
                    </button>
                  </div>
                  <Button className="login-submit" type="primary" htmlType="submit" block loading={loading}>
                    登录 →
                  </Button>
                </Form>

                <p className="login-alt-row">
                  <button type="button" className="login-alt-link" onClick={() => message.info('GitHub 登录为演示入口')}>
                    <GithubOutlined /> GitHub 登录
                  </button>
                </p>
              </div>

              <div
                className={mode === 'qr' ? 'login-auth-pane is-active' : 'login-auth-pane'}
                aria-hidden={mode !== 'qr'}
                inert={mode !== 'qr' ? true : undefined}
              >
                <div className="login-qr-panel">
                  <div className="login-qr-box" aria-hidden>
                    <span className="login-qr-fake" />
                  </div>
                  <p>请使用企业微信 / 钉钉扫码登录</p>
                  <button
                    type="button"
                    className="login-link"
                    onClick={() => message.info('演示环境二维码已刷新')}
                  >
                    点击刷新二维码
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="login-signup">
            还没有账号？{' '}
            <button type="button" className="login-link" onClick={() => message.info('请联系管理员开通账号')}>
              联系管理员开通
            </button>
          </p>

          <footer className="login-page-foot">
            <div className="login-foot-links">
              <button type="button" className="login-foot-link">
                隐私政策
              </button>
              <button type="button" className="login-foot-link">
                服务条款
              </button>
              <button type="button" className="login-foot-link">
                帮助中心
              </button>
            </div>
            <div>© 2026 AI 软件交付平台</div>
          </footer>
        </div>
      </main>
    </div>
  )
}
