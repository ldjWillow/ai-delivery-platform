import { ConfigProvider, App as AntApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import OverviewPage from './pages/Overview'
import PipelinePage from './pages/Pipeline'
import AgentPage from './pages/Agent'
import BuildPage from './pages/Build'
import DeployPage from './pages/Deploy'
import EnvironmentPage from './pages/Environment'
import VersionPage from './pages/Version'
import LogsPage from './pages/Logs'
import ApprovalPage from './pages/Approval'
import AlertPage from './pages/Alert'
import SettingsPage from './pages/Settings'
import { theme } from './theme'
import 'dayjs/locale/zh-cn'

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="pipelines" element={<PipelinePage />} />
              <Route path="agent" element={<AgentPage />} />
              <Route path="builds" element={<BuildPage />} />
              <Route path="deploys" element={<DeployPage />} />
              <Route path="environments" element={<EnvironmentPage />} />
              <Route path="versions" element={<VersionPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="approvals" element={<ApprovalPage />} />
              <Route path="alerts" element={<AlertPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  )
}
