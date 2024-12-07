import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './pages/signup'
import Home from './pages/Home'
import Landing from './pages/landing'
import Signin from './pages/signin'
import Demo from './pages/Demo'
import NotFound from './pages/errPage/404'
import ServerError from './pages/errPage/500'
import { useEffect } from 'react'
import Room from './component/room'
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
    {
      path: "*",
      element: <NotFound />
    },
    {
      path: "/500",
      element: <ServerError />
    },
    {
      path: '/join-space',
      element: <Room />
    }

  ])
  useEffect(() => {
    document.title = "Meta";
  }, []);
  return (
    <RouterProvider router={router} />
  )
}

export default App
