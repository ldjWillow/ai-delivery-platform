import { ConfigProvider, App as AntApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { RequireAuth } from './auth/RequireAuth'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/Login'
import OverviewPage from './pages/Overview'
import OverviewV2Page from './pages/OverviewV2'
import PipelinePage from './pages/Pipeline'
import AgentPage from './pages/Agent'
import BuildPage from './pages/Build'
import DeployPage from './pages/Deploy'
import EnvironmentPage from './pages/Environment'
import EnvironmentV2Page from './pages/EnvironmentV2'
import VersionPage from './pages/Version'
import VersionV2Page from './pages/VersionV2'
import LogsPage from './pages/Logs'
import LogsV2Page from './pages/LogsV2'
import ApprovalPage from './pages/Approval'
import AlertPage from './pages/Alert'
import MonitorPage from './pages/Monitor'
import AcceptancePage from './pages/Acceptance'
import CustomersPage from './pages/Customers'
import SettingsPage from './pages/Settings'
import { theme } from './theme'
import 'dayjs/locale/zh-cn'

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <AntApp>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                  <Route index element={<OverviewPage />} />
                  <Route path="overview-v2" element={<OverviewV2Page />} />
                  <Route path="pipelines" element={<PipelinePage />} />
                  <Route path="agent" element={<AgentPage />} />
                  <Route path="builds" element={<BuildPage />} />
                  <Route path="deploys" element={<DeployPage />} />
                  <Route path="environments" element={<EnvironmentPage />} />
                  <Route path="environments-v2" element={<EnvironmentV2Page />} />
                  <Route path="versions" element={<VersionPage />} />
                  <Route path="versions-v2" element={<VersionV2Page />} />
                  <Route path="logs" element={<LogsPage />} />
                  <Route path="logs-v2" element={<LogsV2Page />} />
                  <Route path="approvals" element={<ApprovalPage />} />
                  <Route path="alerts" element={<AlertPage />} />
                  <Route path="monitor" element={<MonitorPage />} />
                  <Route path="acceptance" element={<AcceptancePage />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  )
}
