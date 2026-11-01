import { Outlet } from 'react-router'
import Navbar from '../Components/Navbar/Navbar'


function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default MainLayout
