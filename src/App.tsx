import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import Register from './Pages/Register/Register';
import AuthLayout from './Layouts/AuthLayout';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import MainLayout from './Layouts/MainLayout';
import Profile from './Pages/Profile/Profile';
import Notification from './Pages/Notification/Notification';
import Notfound from './Pages/Notfound/Notfound';
import { Toaster } from 'react-hot-toast';
import AppProtectedRoute from './Components/ProtectedRoutes/AppProtectedRoute';
import AuthProtectedRoute from './Components/ProtectedRoutes/AuthProtectedRoute';
import PostDetails from './Pages/PostDetails/PostDetails';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';



export default function App() {


  const routes = createBrowserRouter([
    {
      path: "/auth",
      element: <AuthProtectedRoute> <AuthLayout /> </AuthProtectedRoute>,
      children: [
        { index: true, element: <Navigate to="login" /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> }
      ]
    },

    {
      path: "",
      element: <AppProtectedRoute> <MainLayout /> </AppProtectedRoute>,
      children: [
        { index: true, element: <Navigate to="/feed" /> },
        { path: "feed", element: <Home /> },
        { path: "home", element: <Home /> },
        { path: "profile", element: <Profile /> },
        { path: "notification", element: <Notification /> },
        { path: "postDetails/:id", element: <PostDetails /> },
      ],
    },
    { path: "*", element: <Notfound /> },
  ]);
  return (
    <>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right"  /> 
        {/* buttonPosition="bottom-right" */}
     
      <RouterProvider router={routes} />

    </>
  )
}
