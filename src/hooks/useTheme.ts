import { useEffect } from 'react'
import { useAppStore } from '@/store'

export const useTheme = () => {
  const theme = useAppStore((state) => state.ui.theme)
  const setTheme = useAppStore((state) => state.setTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  }
}