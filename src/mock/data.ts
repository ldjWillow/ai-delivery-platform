export type StatusTone = 'ok' | 'warn' | 'danger' | 'running' | 'muted'

export const currentUser = {
  name: '张三',
  role: '技术负责人',
  avatarText: '张',
}

export const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return '上午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

export const pageMeta: Record<
  string,
  { title: string; subtitle: string; quote: string; search: string }
> = {
  '/': {
    title: '项目总览',
    subtitle: '一眼看懂全局研发交付态势，AI 驱动从需求到上线的全链路可视化',
    quote: '用 AI 把交付链路串成一条线',
    search: '搜索项目、服务、构建记录或关键词...',
  },
  '/overview-v2': {
    title: '项目总览2',
    subtitle: '可视化交付链路、Agent 结果、环境与统一事件一屏掌控',
    quote: '用 AI 把交付链路串成一条线',
    search: '搜索项目、流水线、环境、日志...',
  },
  '/pipelines': {
    title: '流水线',
    subtitle: '编排 Push / PR / 手动 / 定时触发，把 Agent、CI 与部署串成可观测流水线',
    quote: '稳定交付，从每一次可回放的流水线开始',
    search: '搜索项目、服务、构建记录或关键词...',
  },
  '/agent': {
    title: 'AI Agent',
    subtitle: 'AI 负责智能修改，CI 负责确定性验证，让研发效率再快一倍',
    quote: '让 AI 成为每个开发者的超级搭档',
    search: '搜索项目、代码、任务、Agent 或功能...',
  },
  '/builds': {
    title: '构建中心',
    subtitle: '统一查看 GitHub Actions 等构建结果，失败可一键定位并交给 AI 修复',
    quote: '确定性构建，是稳定交付的底线',
    search: '搜索项目、构建记录、镜像...',
  },
  '/deploys': {
    title: '部署中心',
    subtitle: '管理应用发布、健康检查与一键回滚，让更好的产品更快触达用户',
    quote: '持续交付，让更好的产品更快触达用户',
    search: '搜索项目、服务、部署记录...',
  },
  '/environments': {
    title: '环境管理',
    subtitle: 'Dev / Test / Staging / Prod 统一上下文，变量、服务与依赖一目了然',
    quote: '环境是部署与日志的共同上下文',
    search: '搜索环境、服务、变量...',
  },
  '/environments-v2': {
    title: '环境管理2',
    subtitle: '资源、变量、服务与健康状态一屏掌控',
    quote: '环境是部署与日志的共同上下文',
    search: '搜索环境、服务、变量...',
  },
  '/versions': {
    title: '版本管理',
    subtitle: 'Release / Tag / Artifact / 部署记录统一关联，变更可追溯可对比',
    quote: '版本是交付链路的关键关联对象',
    search: '搜索版本、Tag、制品...',
  },
  '/versions-v2': {
    title: '版本管理2',
    subtitle: '概览、对比、制品与分支关系一屏掌控',
    quote: '版本是交付链路的关键关联对象',
    search: '搜索版本、Tag、制品、分支...',
  },
  '/logs': {
    title: '日志中心',
    subtitle: '按项目 / 环境 / 服务检索日志，并关联版本、部署与告警',
    quote: '用同一条 Trace 把问题钉死',
    search: '搜索日志、TraceId、关键词...',
  },
  '/logs-v2': {
    title: '日志中心2',
    subtitle: '级别分布、服务过滤、实时流与详情联动排查',
    quote: '用同一条 Trace 把问题钉死',
    search: '搜索日志、TraceId、关键词...',
  },
  '/approvals': {
    title: '审批中心',
    subtitle: '待办、详情与风险一屏处理，生产变更全程可审计',
    quote: '没有审批，就没有生产发布',
    search: '搜索审批单、申请人、版本...',
  },
  '/alerts': {
    title: '告警中心',
    subtitle: '告警自动关联最近版本、部署与日志，缩短定位时间',
    quote: '先止血，再归因，再复盘',
    search: '搜索告警、规则、服务...',
  },
  '/monitor': {
    title: '监控中心',
    subtitle: '可用性、延迟、资源与拓扑一屏观测，支撑值班定位',
    quote: '看得见，才管得住',
    search: '搜索服务、实例、API...',
  },
  '/customers': {
    title: '客户中心',
    subtitle: '客户、验收、沟通与回款一屏掌控',
    quote: '交付价值，最终要落到客户成功',
    search: '搜索客户、合同、验收...',
  },
  '/acceptance': {
    title: '验收中心',
    subtitle: '待验清单、详情与反馈闭环，推动交付可签字',
    quote: '验收通过，才算真正交付',
    search: '搜索验收项目、客户、负责人...',
  },
  '/settings': {
    title: '系统设置',
    subtitle: '组织、成员、角色、Provider、凭证与审计配置',
    quote: '最小权限，最大可审计',
    search: '搜索设置项...',
  },
}

export const projects = [
  {
    key: 'mall',
    name: 'mall-电商平台',
    desc: '电商交易与推荐核心',
    progress: 12,
    total: 15,
    status: '正常',
    tone: 'ok' as StatusTone,
    color: '#2F6BFF',
    members: ['张', '李', '王', '陈'],
  },
  {
    key: 'pay',
    name: 'pay-支付服务',
    desc: '支付与清结算',
    progress: 8,
    total: 10,
    status: '已发布',
    tone: 'ok' as StatusTone,
    color: '#22C55E',
    members: ['张', '赵'],
  },
  {
    key: 'user',
    name: 'user-用户中心',
    desc: '账号与权限',
    progress: 5,
    total: 12,
    status: '开发中',
    tone: 'running' as StatusTone,
    color: '#8B5CF6',
    members: ['李', '周', '吴'],
  },
  {
    key: 'order',
    name: 'order-订单服务',
    desc: '订单与履约',
    progress: 9,
    total: 11,
    status: '正常',
    tone: 'ok' as StatusTone,
    color: '#F59E0B',
    members: ['王', '陈'],
  },
]

export const deliveryEvents = [
  { title: 'mall-电商平台', action: '发布成功', detail: 'v2.1.0 → Production', time: '10 分钟前', tone: 'ok' as StatusTone },
  { title: 'pay-支付服务', action: '合并代码', detail: 'PR #186 feat: 退款重试', time: '28 分钟前', tone: 'running' as StatusTone },
  { title: 'user-用户中心', action: '构建失败', detail: 'npm test exit 1', time: '45 分钟前', tone: 'danger' as StatusTone },
  { title: 'order-订单服务', action: 'Agent 完成', detail: '导出按钮 PR #92', time: '1 小时前', tone: 'ok' as StatusTone },
  { title: 'mall-电商平台', action: '审批通过', detail: '生产发布单 #A-318', time: '2 小时前', tone: 'ok' as StatusTone },
]

export const overviewLogs = [
  { t: '10:24:12', lv: 'INFO', msg: 'pipeline #428 started on branch main' },
  { t: '10:24:38', lv: 'SUCCESS', msg: 'Cursor Agent finished in 1m24s' },
  { t: '10:25:01', lv: 'INFO', msg: 'GitHub Actions job build-image running' },
  { t: '10:26:18', lv: 'WARN', msg: 'health check latency > 800ms on order-service' },
  { t: '10:27:02', lv: 'SUCCESS', msg: 'Coolify deploy v2.1.0 healthy' },
  { t: '10:27:40', lv: 'ERROR', msg: 'alert: redis connections near limit (staging)' },
]

export const pipelines = [
  { name: 'mall-main', status: '运行中', branch: 'main', last: '10 分钟前', duration: '6m12s', by: '张三' },
  { name: 'pay-release', status: '成功', branch: 'release/1.8', last: '1 小时前', duration: '4m02s', by: '李四' },
  { name: 'user-ci', status: '失败', branch: 'develop', last: '45 分钟前', duration: '2m18s', by: '王五' },
  { name: 'order-hotfix', status: '暂停', branch: 'hotfix/export', last: '昨天', duration: '—', by: '陈六' },
  { name: 'mall-pr', status: '成功', branch: 'feat/rec', last: '3 小时前', duration: '5m40s', by: '张三' },
]

export const recentRuns = [
  { project: 'mall-电商平台', no: '#428', status: '部署中', branch: 'main', commit: 'a3f91c2', time: '10 分钟前' },
  { project: 'pay-支付服务', no: '#186', status: '成功', branch: 'main', commit: '91bc02e', time: '1 小时前' },
  { project: 'user-用户中心', no: '#97', status: '失败', branch: 'develop', commit: 'cc812aa', time: '45 分钟前' },
  { project: 'order-订单服务', no: '#210', status: '成功', branch: 'main', commit: '0ef12ab', time: '2 小时前' },
]

export const agentStats = [
  { title: 'AI 编程任务', value: 24, delta: '+12', tone: 'up' },
  { title: '代码评审建议', value: 56, delta: '+18', tone: 'up' },
  { title: '缺陷修复建议', value: 8, delta: '+5', tone: 'up' },
  { title: '测试用例生成', value: 132, delta: '+40', tone: 'up' },
  { title: 'PR 处理完成', value: 18, delta: '+8', tone: 'up' },
]

export const agentRunning = [
  { name: '代码生成 Agent', task: '实现订单导出按钮', percent: 78, elapsed: '1m24s' },
  { name: '代码评审 Agent', task: 'PR #186 风险扫描', percent: 45, elapsed: '48s' },
  { name: '缺陷修复 Agent', task: '修复登录态超时', percent: 62, elapsed: '2m06s' },
  { name: '测试生成 Agent', task: '补充支付单测', percent: 33, elapsed: '36s' },
]

export const agentTasks = [
  { title: '实现订单导出功能', status: '已完成', time: '12m' },
  { title: '修复登录态超时', status: '运行中', time: '2m' },
  { title: '补充推荐接口单测', status: '排队中', time: '—' },
  { title: 'Review 退款重试 PR', status: '待确认', time: '—' },
  { title: '生成 Changelog', status: '已完成', time: '8m' },
]

export const reviewSuggestions = [
  { level: '高', file: 'order/ExportService.java:128', text: '导出接口缺少分页上限，可能 OOM', time: '8 分钟前' },
  { level: '中', file: 'pay/RetryPolicy.ts:44', text: '重试未做抖动，可能惊群', time: '20 分钟前' },
  { level: '低', file: 'mall/Recommend.tsx:91', text: '建议抽取常量避免魔法数', time: '35 分钟前' },
  { level: '中', file: 'user/SessionFilter.java:67', text: '超时配置与网关不一致', time: '1 小时前' },
]

export const buildRecords = [
  { no: '#425', project: 'mall-电商平台', branch: 'main', type: 'Maven', status: '成功', duration: '4m21s', by: '张三' },
  { no: '#424', project: 'mall-frontend', branch: 'main', type: 'npm', status: '成功', duration: '1m36s', by: '李四' },
  { no: '#423', project: 'admin-管理后台', branch: 'develop', type: 'npm', status: '失败', duration: '2m10s', by: '王五' },
  { no: '#422', project: 'pay-支付服务', branch: 'main', type: 'Docker', status: '成功', duration: '3m48s', by: '张三' },
  { no: '#421', project: 'order-订单服务', branch: 'main', type: 'Maven', status: '成功', duration: '3m12s', by: '陈六' },
]

export const deployRecords = [
  { no: '#428', version: 'v2.1.0', env: '生产环境', status: '成功', duration: '2m12s', by: '张三', time: '今天 10:24' },
  { no: '#427', version: 'v2.1.0-rc.1', env: '预发环境', status: '成功', duration: '2m05s', by: '李四', time: '今天 09:18' },
  { no: '#426', version: 'v2.1.0-rc.1', env: '测试环境', status: '成功', duration: '1m58s', by: '王五', time: '今天 08:40' },
  { no: '#425', version: 'v2.0.9', env: '生产环境', status: '失败', duration: '4m21s', by: '张三', time: '昨天 18:32' },
  { no: '#424', version: 'v2.0.9', env: '生产环境', status: '成功', duration: '2m30s', by: '陈六', time: '昨天 16:10' },
]

export const environments = [
  { key: 'dev', name: '开发环境', status: '运行中', tone: 'ok' as StatusTone, services: 12, instances: 2, version: 'v2.1.0-dev' },
  { key: 'test', name: '测试环境', status: '运行中', tone: 'ok' as StatusTone, services: 10, instances: 3, version: 'v2.1.0-rc.1' },
  { key: 'staging', name: '预发环境', status: '部分异常', tone: 'warn' as StatusTone, services: 8, instances: 2, version: 'v2.1.0' },
  { key: 'prod', name: '生产环境', status: '运行中', tone: 'ok' as StatusTone, services: 12, instances: 6, version: 'v2.1.0' },
]

export const envVars = [
  { key: 'APP_ENV', value: 'development', secret: false },
  { key: 'API_BASE_URL', value: 'https://dev-api.example.com', secret: false },
  { key: 'REDIS_URL', value: 'redis://10.0.1.3:6379', secret: true },
  { key: 'DB_PASSWORD', value: '********', secret: true },
  { key: 'LOG_LEVEL', value: 'debug', secret: false },
]

export const services = [
  { name: 'mall-frontend', version: 'v2.0.9', instances: '2/2', cpu: '12%', mem: '480MB', status: '运行中' },
  { name: 'mall-backend', version: 'v2.1.3', instances: '2/2', cpu: '28%', mem: '1.2GB', status: '运行中' },
  { name: 'pay-service', version: 'v1.5.6', instances: '2/2', cpu: '18%', mem: '760MB', status: '运行中' },
  { name: 'order-service', version: 'v1.8.1', instances: '2/2', cpu: '22%', mem: '890MB', status: '运行中' },
  { name: 'user-service', version: 'v1.4.2', instances: '1/2', cpu: '9%', mem: '420MB', status: '异常' },
]

export const versions = [
  { ver: 'v2.1.0', status: '已发布', tag: 'v2.1.0', commit: 'a3f91c2', artifact: 'mall:2.1.0@sha256:91ab…', time: '2024-04-22 10:24' },
  { ver: 'v2.1.0-rc.1', status: '已发布', tag: 'v2.1.0-rc.1', commit: '88c10de', artifact: 'mall:2.1.0-rc.1@sha256:11cf…', time: '2024-04-22 08:40' },
  { ver: 'v2.0.9', status: '已发布', tag: 'v2.0.9', commit: '0ef12ab', artifact: 'mall:2.0.9@sha256:55aa…', time: '2024-04-21 16:10' },
  { ver: 'v2.0.8', status: '废弃', tag: 'v2.0.8', commit: 'bb912ff', artifact: 'mall:2.0.8@sha256:09ee…', time: '2024-04-18 11:02' },
]

export const approvals = [
  {
    id: 'A-318',
    title: 'mall-电商平台 v2.1.0',
    subtitle: '生产环境发布申请 · mall-frontend',
    risk: '高',
    applicant: '李四',
    role: '前端开发',
    avatar: '李',
    project: 'mall-电商平台',
    version: 'v2.1.0',
    env: '生产环境',
    type: '生产发布',
    pipeline: 'mall-release',
    desc: '包含支付链路优化与订单导出能力，Test/Staging 已验证通过。',
    status: '待我审批',
    time: '今天 09:50',
    planTime: '今天 14:00',
  },
  {
    id: 'A-317',
    title: '扩容 order-service ×2',
    subtitle: '生产环境扩容申请 · order-service',
    risk: '中',
    applicant: '张三',
    role: '技术负责人',
    avatar: '张',
    project: 'mall-电商平台',
    version: 'v2.1.0',
    env: '生产环境',
    type: '容量变更',
    pipeline: 'infra-scale',
    desc: '高峰期订单服务 CPU 持续高于 75%，申请扩容 2 个实例。',
    status: '审批中',
    time: '今天 09:20',
    planTime: '今天 11:00',
  },
  {
    id: 'A-316',
    title: '回滚 pay v1.5.5',
    subtitle: '生产环境回滚申请 · pay-service',
    risk: '高',
    applicant: '王五',
    role: '后端开发',
    avatar: '王',
    project: 'pay-支付服务',
    version: 'v1.5.5',
    env: '生产环境',
    type: '紧急回滚',
    pipeline: 'pay-rollback',
    desc: '支付成功率下降，回滚至上一稳定版本。',
    status: '待我审批',
    time: '昨天 19:12',
    planTime: '立即',
  },
  {
    id: 'A-315',
    title: '更新 Staging 证书',
    subtitle: '预发环境证书更新 · gateway',
    risk: '低',
    applicant: '陈六',
    role: '运维',
    avatar: '陈',
    project: 'infra',
    version: 'cert-2024.04',
    env: '预发环境',
    type: '配置变更',
    pipeline: 'cert-renew',
    desc: '预发证书即将到期，按周期更新。',
    status: '已通过',
    time: '昨天 15:00',
    planTime: '昨天 16:00',
  },
  {
    id: 'A-314',
    title: '开放用户导出 API',
    subtitle: '测试环境能力开放 · user-service',
    risk: '低',
    applicant: '赵七',
    role: '产品',
    avatar: '赵',
    project: 'user-用户中心',
    version: 'v1.4.2',
    env: '测试环境',
    type: '功能发布',
    pipeline: 'user-api',
    desc: '导出接口仅对内部角色开放，附带审计日志。',
    status: '已拒绝',
    time: '前天 11:20',
    planTime: '本周三',
  },
]

export const alerts = [
  { id: 'AL-901', level: '严重', title: 'Staging Redis 连接数接近上限', project: 'mall', status: 'FIRING', time: '8 分钟前' },
  { id: 'AL-900', level: '重要', title: 'user-service 实例 1/2 异常', project: 'user', status: '处理中', time: '32 分钟前' },
  { id: 'AL-899', level: '一般', title: '构建失败：admin-管理后台', project: 'admin', status: '已恢复', time: '1 小时前' },
  { id: 'AL-898', level: '重要', title: 'Production 部署失败 #425', project: 'order', status: '已关闭', time: '昨天' },
]

export const logLines = [
  { t: '10:27:40.012', lv: 'ERROR', svc: 'redis', msg: 'maxclients warning: 980/1000' },
  { t: '10:27:12.441', lv: 'WARN', svc: 'order-service', msg: 'health latency 812ms trace=tr_9812' },
  { t: '10:26:58.102', lv: 'INFO', svc: 'coolify', msg: 'deploy finished digest=sha256:91ab…' },
  { t: '10:26:10.880', lv: 'INFO', svc: 'actions', msg: 'job build-image success' },
  { t: '10:25:33.201', lv: 'SUCCESS', svc: 'agent', msg: 'PR #92 created: feat/order-export' },
  { t: '10:24:12.000', lv: 'INFO', svc: 'pipeline', msg: 'trigger=push branch=main' },
]
