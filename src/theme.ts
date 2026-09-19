import type { ThemeConfig } from 'antd'

/** Brand vs semantic: brand for chrome; semantic for delivery health */
export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#2563EB',
    colorInfo: '#2563EB',
    colorSuccess: '#16A34A',
    colorWarning: '#D97706',
    colorError: '#DC2626',
    colorText: '#0F172A',
    colorTextSecondary: '#64748B',
    colorBgLayout: '#E8EEF6',
    colorBgContainer: '#FFFFFF',
    colorBorder: '#E2E8F0',
    borderRadius: 10,
    fontFamily:
      '"DM Sans", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 14,
    controlHeight: 36,
  },
  components: {
    Layout: {
      siderBg: '#0B1220',
      headerBg: 'transparent',
      bodyBg: '#E8EEF6',
    },
    Menu: {
      darkItemBg: 'transparent',
      darkSubMenuItemBg: 'transparent',
      darkItemSelectedBg: 'rgba(37, 99, 235, 0.22)',
      darkItemHoverBg: 'rgba(255,255,255,0.06)',
      darkItemSelectedColor: '#FFFFFF',
      darkItemColor: '#CBD5E1',
      itemBorderRadius: 8,
      itemMarginInline: 10,
      itemHeight: 40,
      groupTitleColor: '#64748B',
    },
    Card: {
      borderRadiusLG: 12,
      paddingLG: 18,
    },
    Table: {
      headerBg: '#F8FAFC',
      borderColor: '#E2E8F0',
    },
    Button: {
      borderRadius: 8,
      controlHeight: 36,
      primaryShadow: '0 4px 12px rgba(37, 99, 235, 0.22)',
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
}
