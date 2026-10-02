import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './extras.css'
import App from './App.jsx'
import NotificationCenter from './NotificationCenter.jsx'
import InstallApp from './InstallApp.jsx'
import { API } from './config'

// Purane code mein jo "http://localhost:5000" likha hai use sahi backend address par bhej deta hai
const originalFetch = window.fetch.bind(window)
window.fetch = (input, init) =>
  originalFetch(
    typeof input === 'string' ? input.replace('http://localhost:5000', API) : input,
    init
  )
// Phone par bhi website laptop jaisi dikhane ke liye (1100 se upar rakhein).
// Admin page phone par normal rehta hai.
const DESIGN_WIDTH = 1000

if (window.location.pathname !== '/admin') {
  document
    .querySelector('meta[name="viewport"]')
    ?.setAttribute('content', `width=${DESIGN_WIDTH}, viewport-fit=cover`)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <NotificationCenter />
    <InstallApp />
  </StrictMode>,
)

// App install (PWA): service worker sirf build / live version mein
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}