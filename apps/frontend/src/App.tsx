import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './pages/signup'
import Home from './pages/Home'
import Landing from './pages/landing'
import Signin from './pages/signin'
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
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
