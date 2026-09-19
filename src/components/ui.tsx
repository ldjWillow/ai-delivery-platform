import { Avatar, Card, Space, Typography } from 'antd'
import type { ReactNode } from 'react'

const { Text, Title } = Typography

export function StatCard({
  title,
  value,
  delta,
  deltaUp = true,
  icon,
  suffix,
}: {
  title: string
  value: ReactNode
  delta?: string
  deltaUp?: boolean
  icon?: ReactNode
  suffix?: string
}) {
  return (
    <Card className="stat-card fade-up" styles={{ body: { padding: 18 } }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {title}
          </Text>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <Title level={3} style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {value}
            </Title>
            {suffix ? (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {suffix}
              </Text>
            ) : null}
          </div>
          {delta ? (
            <Text
              style={{
                marginTop: 8,
                display: 'inline-block',
                color: deltaUp ? '#16a34a' : '#dc2626',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {deltaUp ? '↑' : '↓'} {delta}
            </Text>
          ) : null}
        </div>
        {icon ? (
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'var(--primary-soft)',
              color: 'var(--primary)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  )
}

export function Panel({
  title,
  extra,
  children,
  style,
  className,
}: {
  title: ReactNode
  extra?: ReactNode
  children: ReactNode
  style?: React.CSSProperties
  className?: string
}) {
  return (
    <Card
      className={['panel-card', 'fade-up', className].filter(Boolean).join(' ')}
      title={<span style={{ fontWeight: 650 }}>{title}</span>}
      extra={extra}
      styles={{ body: { paddingTop: 12 } }}
      style={style}
    >
      {children}
    </Card>
  )
}

export function StatusTag({
  text,
  tone,
}: {
  text: string
  tone: 'ok' | 'warn' | 'danger' | 'running' | 'muted' | 'success'
}) {
  const normalized = tone === 'success' ? 'ok' : tone
  const map = {
    ok: { bg: '#ECFDF5', color: '#15803D', border: '#BBF7D0' },
    warn: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
    danger: { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' },
    running: { bg: '#ECFEFF', color: '#0E7490', border: '#A5F3FC' },
    muted: { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' },
  }[normalized]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 8px',
        borderRadius: 999,
        background: map.bg,
        color: map.color,
        border: `1px solid ${map.border}`,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <span
        className={`status-dot ${normalized === 'running' ? 'running' : normalized === 'muted' ? 'ok' : normalized}`}
      />
      {text}
    </span>
  )
}

export function MemberStack({ names }: { names: string[] }) {
  return (
    <Avatar.Group size={24} max={{ count: 3 }}>
      {names.map((n) => (
        <Avatar key={n} style={{ background: '#2F6BFF', fontSize: 12 }}>
          {n}
        </Avatar>
      ))}
    </Avatar.Group>
  )
}

export function PageGreeting({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 16 }} className="fade-up">
      <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 720 }}>
            {title}
          </Title>
          <Text type="secondary" style={{ marginTop: 6, display: 'block', maxWidth: 720 }}>
            {subtitle}
          </Text>
        </div>
      </Space>
    </div>
  )
}

export function LogView({
  lines,
}: {
  lines: { t: string; lv: string; msg: string; svc?: string }[]
}) {
  const cls = (lv: string) => {
    const u = lv.toUpperCase()
    if (u.includes('SUCCESS')) return 'lv-success'
    if (u.includes('WARN')) return 'lv-warn'
    if (u.includes('ERROR')) return 'lv-error'
    return 'lv-info'
  }
  return (
    <div className="log-panel">
      {lines.map((l, i) => (
        <div key={`${l.t}-${i}`}>
          <span style={{ color: '#94a3b8' }}>{l.t}</span>{' '}
          <span className={cls(l.lv)}>[{l.lv}]</span>{' '}
          {l.svc ? <span style={{ color: '#a78bfa' }}>{l.svc}</span> : null}{' '}
          {l.msg}
        </div>
      ))}
    </div>
  )
}
