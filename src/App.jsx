import './App.css'
import Authentication from './pages/Authentication'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ChatGroup from './pages/ChatGroup'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Authentication />
    },
    {
      path: '/ChatGroup',
      element: <ChatGroup />
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
