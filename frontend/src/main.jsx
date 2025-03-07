import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { NameProvider } from './contexts/NameContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* //need <Component></Component> if you want to pass children inside. */}
    <NameProvider>
    <App />
    </NameProvider>
  </StrictMode>,
)
