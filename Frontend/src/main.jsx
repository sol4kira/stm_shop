import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
    <BrowserRouter>
    <Toaster>
    <App />
    </Toaster>
    </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
)
