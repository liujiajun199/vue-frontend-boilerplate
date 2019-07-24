import { BrowserWindow } from 'electron'
import url from './url'
import store from '../store'
import windows from './cache'
import { registerCommonHandlers } from './handlers'

// Default options for creating new window
const DEFAULT_OPTIONS = {
  height: 768,
  width: 1024,
  webPreferences: {
    nodeIntegration: true
  }
}

/**
 * Create window instance by using giving options
 * @param {Object} options
 * @returns {BrowserWindow} instance
 */
export const createWindow = options => {
  console.log('Creating window', options)
  const { name, url, sizeType, width, height, x, y } = options
  /** @type {BrowserWindow} */
  const existWindow = windows[name]

  if (existWindow) {
    existWindow.restore()
    existWindow.focus()
    return existWindow
  }

  const opts = { ...DEFAULT_OPTIONS, width, height, x, y }
  const window = windows[name] = new BrowserWindow(opts)

  window._name = name
  window._sizeType = sizeType
  window.loadURL(url)
  registerCommonHandlers(window)

  return window
}

export const createMainWindow = () => {
  const { width, height } = store.get('windows.main')
  console.log('Main window: width is', width, 'height is', height)
  return createWindow({ name: 'main', url, width, height })
}

export const createChildWindow = opts => {
  console.log('opts', opts)
  const { name, url, category, options } = opts
  const rect = category && store.get(`windows.${category}`)
  console.log('sizeOptions', rect)
  const location = store.get(`windows.${name}`)
  console.log('location', location)

  return createWindow({ name, url, ...options, ...rect, ...location })
}

/**
 * Restore all window instances
 */
export const initializeWindows = () => {
  createMainWindow()
}