import { Modal, Input, Empty } from 'antd'
import {
  AlertOutlined,
  ApartmentOutlined,
  AuditOutlined,
  BuildOutlined,
  CloudServerOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  FileSearchOutlined,
  RobotOutlined,
  SettingOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import { buildRecords, pipelines, projects } from '../mock/data'

type NavFn = (path: string) => void

const routes = [
  { title: '项目总览', path: '/', icon: <DashboardOutlined />, keywords: 'overview 总览' },
  { title: '项目总览2', path: '/overview-v2', icon: <DashboardOutlined />, keywords: 'overview 总览2 可视化流水线' },
  { title: '流水线', path: '/pipelines', icon: <ApartmentOutlined />, keywords: 'pipeline ci' },
  { title: 'AI Agent', path: '/agent', icon: <RobotOutlined />, keywords: 'agent ai 编程' },
  { title: '构建中心', path: '/builds', icon: <BuildOutlined />, keywords: 'build 构建' },
  { title: '部署中心', path: '/deploys', icon: <DeploymentUnitOutlined />, keywords: 'deploy 部署 回滚' },
  { title: '环境管理', path: '/environments', icon: <CloudServerOutlined />, keywords: 'env 环境' },
  { title: '环境管理2', path: '/environments-v2', icon: <CloudServerOutlined />, keywords: 'env 环境管理2 资源' },
  { title: '版本管理', path: '/versions', icon: <TagsOutlined />, keywords: 'version release' },
  { title: '日志中心', path: '/logs', icon: <FileSearchOutlined />, keywords: 'log 日志' },
  { title: '日志中心2', path: '/logs-v2', icon: <FileSearchOutlined />, keywords: 'log 日志中心2 实时流' },
  { title: '审批中心', path: '/approvals', icon: <AuditOutlined />, keywords: 'approval 审批' },
  { title: '告警中心', path: '/alerts', icon: <AlertOutlined />, keywords: 'alert 告警' },
  { title: '客户中心', path: '/customers', icon: <ContactsOutlined />, keywords: 'customer 客户 回款 验收' },
  { title: '系统设置', path: '/settings', icon: <SettingOutlined />, keywords: 'settings 设置' },
]

export function CommandPalette({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean
  onClose: () => void
  onNavigate: NavFn
}) {
  const [q, setQ] = useState('')

  useEffect(() => {
    if (open) setQ('')
  }, [open])

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    const pageHits = routes.filter(
      (r) => !s || r.title.toLowerCase().includes(s) || r.keywords.includes(s),
    )
    const projectHits = projects
      .filter((p) => !s || p.name.toLowerCase().includes(s) || p.key.includes(s))
      .map((p) => ({
        title: p.name,
        path: '/',
        icon: <DashboardOutlined />,
        hint: '项目',
      }))
    const buildHits = buildRecords
      .filter((b) => !s || b.no.includes(s) || b.project.toLowerCase().includes(s))
      .slice(0, 4)
      .map((b) => ({
        title: `${b.no} · ${b.project}`,
        path: '/builds',
        icon: <BuildOutlined />,
        hint: b.status,
      }))
    const pipeHits = pipelines
      .filter((p) => !s || p.name.toLowerCase().includes(s))
      .slice(0, 3)
      .map((p) => ({
        title: p.name,
        path: '/pipelines',
        icon: <ApartmentOutlined />,
        hint: p.status,
      }))

    if (!s) {
      return pageHits.map((r) => ({ ...r, hint: '模块' }))
    }
    return [
      ...pageHits.map((r) => ({ ...r, hint: '模块' })),
      ...projectHits,
      ...pipeHits,
      ...buildHits,
    ]
  }, [q])

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={560}
      className="cmdk-modal"
      styles={{ body: { padding: 0 } }}
    >
      <div className="cmdk">
        <Input
          autoFocus
          size="large"
          variant="borderless"
          placeholder="跳转模块、搜索项目 / 流水线 / 构建号…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onPressEnter={() => {
            const first = results[0]
            if (first) {
              onNavigate(first.path)
              onClose()
            }
          }}
        />
        <div className="cmdk-list">
          {results.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无匹配结果" />
          ) : (
            results.map((r, i) => (
              <button
                key={`${r.path}-${r.title}-${i}`}
                type="button"
                className="cmdk-item"
                onClick={() => {
                  onNavigate(r.path)
                  onClose()
                }}
              >
                <span className="cmdk-item-icon">{r.icon}</span>
                <span className="cmdk-item-title">{r.title}</span>
                <span className="cmdk-item-hint">{r.hint}</span>
              </button>
            ))
          )}
        </div>
        <div className="cmdk-foot">
          <span>Enter 打开</span>
          <span>Esc 关闭</span>
        </div>
      </div>
    </Modal>
  )
}
