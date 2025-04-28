import { createContext, useEffect, useState } from 'react'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import HomeDashboard from './components/HomeDashboard'
import Contacts from './components/Contacts'
import AddContact from './components/AddContact'
import EditContact from './components/EditContact'
import Logout from './components/Logout'
import ProtectedRoutes from './components/ProtectedRoutes'
import NotFound from './pages/NotFound'
import InvoicePage from './pages/Invoice/Invoice'
import InvoiceUpdatePage from './pages/Invoice/InvoiceUpdatePage'
import InvoiceViewOne from './pages/Invoice/InvoiceViewOne'
import ClientProfile from './components/consultations/ClientProfile'
import Clients from './pages/Clients'
import ConsultationDetails from './pages/Consultations'
import AddClient from './components/consultations/AddClient'
import NewConsultation from './pages/NewConsultation'

export const UserContext = createContext(null);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoutes>
        <Dashboard />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <HomeDashboard />,
      },
      {
        path: "/dashboard/contacts",
        element: <Contacts />,
      },
      {
        path: "/dashboard/add-contact",
        element: <AddContact />,
      },
      {
        path: "/dashboard/edit-contact/:id",
        element: <EditContact />,
      },
      {
        path: "/dashboard/facture",
        element: <InvoicePage />,
      },
      {
        path: "/dashboard/view-facture/:id",
        element: <InvoiceViewOne />,
      },
      {
        path: "/dashboard/facture/:id",
        element: <InvoiceUpdatePage />,
      },
      {
        path: "/dashboard/clients/:id",
        element: <ClientProfile />,
      },
      {
        path: "/dashboard/clients",
        element: <Clients />,
      },
      {
        path: "/dashboard/consultations/:id",
        element: <ConsultationDetails />,
      },
      {
        path: "/dashboard/add-client",
        element: <AddClient />,
      },
      {
        path: "/dashboard/clients/:id/consultations/new",
        element: <NewConsultation />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => {
  const [user, setUser] = useState()
  useEffect(() => {
    axios.get("https://app-centre3001-api.vercel.app/gestion_contact/verify", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (res.data.success) {
          setUser(res.data.user)
        }
      }).catch(err => {
        console.log(err)
      })

  }, [])
  return (
    <>
      <ToastContainer />
      <UserContext.Provider value={{ user, setUser }} >
        <RouterProvider router={router} />
      </UserContext.Provider >
    </>
  )
}

export default App