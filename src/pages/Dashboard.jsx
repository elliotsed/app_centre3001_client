import React, { createContext, useState } from 'react'
import "../assets/css/dashboard.css"
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

export const DashboardContext = createContext();

const Dashboard = () => {
    const [toggleActive, setToggleActive] = useState(false);
    const handleToggleClick = () => {
        if (toggleActive === false) {
            setToggleActive(true)
        } else {
            setToggleActive(false)
        }
    }
    return (
        <DashboardContext.Provider value={{ handleToggleClick }} >
            <div className="dashboard">
                <div className={`${toggleActive === true ? "navigation active" : "navigation"}`}>
                    <Sidebar />
                </div>

                <div className={`${toggleActive === true ? "main active" : "main"}`}>
                    <Outlet />
                </div>

            </div>
        </DashboardContext.Provider >

    )
}

export default Dashboard