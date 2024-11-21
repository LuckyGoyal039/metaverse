import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './pages/signup'
import Home from './pages/Home'
import Landing from './pages/landing'
import Signin from './pages/signin'
import Demo from './pages/Demo'
function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />
    },
    {
      path: "/app",
      element: <Home />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/signin",
      element: <Signin />
    },
    {
      path: "/demo",
      element: <Demo />
    },
    

  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
