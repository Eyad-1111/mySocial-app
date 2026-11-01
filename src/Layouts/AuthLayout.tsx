import { Outlet } from 'react-router'
import Authintro from '../Components/Authintro/Authintro'

function AuthLayout() {
    return (
        <>
            <main className="bg-sec h-screen  flex flex-col lg:flex-row items-center justify-center">
                <div className="container mx-auto my-10">
                    <div className="grid lg:grid-cols-2 items-center gap-4">
                        <div className="order-2 lg:order-0">
                            <Authintro /> 
                        </div>
                        <div className="order-0">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default AuthLayout
