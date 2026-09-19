import {
  AlertOutlined,
  ApartmentOutlined,
  AuditOutlined,
  BellOutlined,
  BuildOutlined,
  CloudServerOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MonitorOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
  SearchOutlined,
  SettingOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Badge,
  Breadcrumb,
  Dropdown,
  Layout,
  List,
  Menu,
  Modal,
  Popover,
  Select,
  message,
} from 'antd'
import type { MenuProps } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { currentUser, pageMeta, projects } from '../mock/data'
import { CommandPalette } from '../components/CommandPalette'
import { useAuth } from '../auth/AuthContext'

const { Sider, Header, Content } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function item(key: string, icon: React.ReactNode, label: React.ReactNode): MenuItem {
  return { key, icon, label }
}

function group(label: string, children: MenuItem[]): MenuItem {
  return { type: 'group', label, children }
}

const notifications = [
  { title: '生产发布待审批 A-318', desc: 'mall v2.1.0 · 高风险', time: '8 分钟前' },
  { title: 'Staging Redis 连接数告警', desc: 'AL-901 · FIRING', time: '12 分钟前' },
  { title: 'user-ci 构建失败', desc: '#97 · develop', time: '45 分钟前' },
]

export default function AppLayout() {
  const nav = useNavigate()
  const loc = useLocation()
  const { user, logout } = useAuth()
  const meta = pageMeta[loc.pathname] ?? pageMeta['/']
  const displayName = user?.name ?? currentUser.name
  const displayRole = user?.role ?? currentUser.role
  const avatarText = displayName.slice(0, 1)
  const [collapsed, setCollapsed] = useState(false)
  const [project, setProject] = useState('mall')
  const [cmdOpen, setCmdOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  const selected = useMemo(() => {
    if (loc.pathname.startsWith('/settings')) return ['/settings']
    if (loc.pathname.startsWith('/customers')) return ['/customers']
    return [loc.pathname === '' ? '/' : loc.pathname]
  }, [loc.pathname])

  const openKeysDefault = ['grp-delivery', 'grp-assets', 'grp-runtime', 'grp-biz']

  const menuItems: MenuItem[] = useMemo(
    () => [
      group('态势', [
        item('/', <DashboardOutlined />, '项目总览'),
        item('/overview-v2', <DashboardOutlined />, '项目总览2'),
      ]),
      group('客户', [
        item('/customers', <ContactsOutlined />, '客户中心'),
        item(
          '/acceptance',
          <FileProtectOutlined />,
          <span className="menu-label-with-badge">
            验收中心
            <Badge count={8} size="small" />
          </span>,
        ),
      ]),
      group('交付', [
        item('/pipelines', <ApartmentOutlined />, '流水线'),
        item('/agent', <RobotOutlined />, 'AI Agent'),
        item('/builds', <BuildOutlined />, '构建中心'),
        item('/deploys', <DeploymentUnitOutlined />, '部署中心'),
      ]),
      group('资产', [
        item('/environments', <CloudServerOutlined />, '环境管理'),
        item('/environments-v2', <CloudServerOutlined />, '环境管理2'),
        item('/versions', <TagsOutlined />, '版本管理'),
        item('/versions-v2', <TagsOutlined />, '版本管理2'),
      ]),
      group('运行', [
        item('/logs', <FileSearchOutlined />, '日志中心'),
        item('/logs-v2', <FileSearchOutlined />, '日志中心2'),
        item(
          '/approvals',
          <AuditOutlined />,
          <span className="menu-label-with-badge">
            审批中心
            <Badge count={3} size="small" />
          </span>,
        ),
        item(
          '/alerts',
          <AlertOutlined />,
          <span className="menu-label-with-badge">
            告警中心
            <Badge count={1} size="small" />
          </span>,
        ),
        item('/monitor', <MonitorOutlined />, '监控中心'),
      ]),
    ],
    [],
  )

  const onOpenCmd = useCallback(() => setCmdOpen(true), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const projectName = projects.find((p) => p.key === project)?.name ?? project

  const crumb =
    loc.pathname === '/' || loc.pathname === ''
      ? [{ title: '态势' }, { title: '项目总览' }]
      : [
          { title: projectName },
          { title: meta.title },
        ]

  const notifContent = (
    <div style={{ width: 320 }}>
      <div style={{ fontWeight: 650, marginBottom: 8 }}>通知</div>
      <List
        size="small"
        dataSource={notifications}
        renderItem={(n) => (
          <List.Item
            style={{ cursor: 'pointer', paddingInline: 0 }}
            onClick={() => {
              message.info(`已打开：${n.title}`)
              if (n.title.includes('审批')) nav('/approvals')
              else if (n.title.includes('告警')) nav('/alerts')
              else nav('/builds')
            }}
          >
            <List.Item.Meta
              title={<span style={{ fontSize: 13 }}>{n.title}</span>}
              description={
                <span style={{ fontSize: 12 }}>
                  {n.desc} · {n.time}
                </span>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )

  return (
    <Layout className="shell-root">
      <Sider
        className="shell-sider"
        width={240}
        collapsedWidth={72}
        collapsible
        collapsed={collapsed}
        trigger={null}
      >
        <div className={`shell-brand ${collapsed ? 'is-collapsed' : ''}`}>
          <div className="shell-brand-main">
            <div className="shell-logo" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 1.5L15.5 5.25V12.75L9 16.5L2.5 12.75V5.25L9 1.5Z"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path d="M9 6.2V11.8M6.2 9H11.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            {!collapsed && (
              <div className="shell-brand-text">
                <div className="shell-brand-title">AI 交付平台</div>
                <div className="shell-brand-sub">acme · 研发交付</div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="shell-collapse-btn"
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? '展开侧栏' : '折叠侧栏'}
            aria-label={collapsed ? '展开侧栏' : '折叠侧栏'}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        <div className="shell-menu-wrap">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selected}
            defaultOpenKeys={openKeysDefault}
            items={menuItems}
            onClick={({ key }) => nav(key)}
            inlineCollapsed={collapsed}
          />
        </div>

        <div className="shell-sider-foot">
          <button
            type="button"
            className={`shell-settings-btn ${selected.includes('/settings') ? 'active' : ''}`}
            onClick={() => nav('/settings')}
            title="系统设置"
          >
            <SettingOutlined />
            {!collapsed && <span>系统设置</span>}
          </button>
        </div>
      </Sider>

      <Layout className="shell-main">
        <Header className="shell-header">
          <div className="shell-header-left">
            <Select
              className="shell-project-select"
              value={project}
              onChange={setProject}
              options={projects.map((p) => ({ value: p.key, label: p.name }))}
              popupMatchSelectWidth={240}
            />
            <Breadcrumb className="shell-breadcrumb" items={crumb} />
          </div>

          <button type="button" className="shell-search-trigger" onClick={onOpenCmd}>
            <SearchOutlined />
            <span className="shell-search-placeholder">搜索项目、构建、部署、审批…</span>
            <kbd>⌘K</kbd>
          </button>

          <div className="shell-header-right">
            <Popover placement="bottomRight" content={notifContent} trigger="click">
              <button type="button" className="shell-icon-btn" aria-label="通知">
                <Badge count={3} size="small" offset={[-2, 2]}>
                  <BellOutlined />
                </Badge>
              </button>
            </Popover>
            <button
              type="button"
              className="shell-icon-btn"
              aria-label="帮助"
              onClick={() => setHelpOpen(true)}
            >
              <QuestionCircleOutlined />
            </button>
            <Dropdown
              menu={{
                items: [
                  { key: 'profile', label: '个人资料', onClick: () => message.info('演示：个人资料') },
                  { key: 'settings', label: '系统设置', onClick: () => nav('/settings') },
                  { type: 'divider' },
                  {
                    key: 'logout',
                    label: '退出登录',
                    onClick: () => {
                      logout()
                      message.success('已退出')
                      nav('/login', { replace: true })
                    },
                  },
                ],
              }}
            >
              <button type="button" className="shell-user-chip">
                <Avatar size={28} style={{ background: 'var(--brand)' }}>
                  {avatarText}
                </Avatar>
                <span className="shell-user-meta">
                  <span className="name">{displayName}</span>
                  <span className="role">{displayRole}</span>
                </span>
              </button>
            </Dropdown>
          </div>
        </Header>

        <Content className="shell-content">
          <Outlet context={{ project, setProject }} />
        </Content>
      </Layout>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={nav} />

      <Modal title="帮助" open={helpOpen} onCancel={() => setHelpOpen(false)} footer={null}>
        <p>⌘K / Ctrl+K：打开命令面板，跳转模块或搜索演示数据。</p>
        <p>侧栏按「态势 → 交付 → 资产 → 运行」分组，底部可折叠。</p>
        <p>本站为假数据演示，不连接真实 Git / CI / 部署。</p>
      </Modal>
    </Layout>
  )
}
