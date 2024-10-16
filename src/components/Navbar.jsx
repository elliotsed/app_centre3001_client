import React, { useContext } from 'react'
import "../assets/css/navbar.css"
import { Link } from 'react-router-dom'
import { UserContext } from '../App'

const Navbar = () => {
  const { user } = useContext(UserContext)
  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/" className='navbar-brand'>
          CENTRE 3001
        </Link>
      </div>
      <div className="navbar-right">
        {
          user ? <>
            <Link to="/logout" className='navbar-link'>Déconnexion</Link>
          </>
            : <>
              <Link to="/login" className='navbar-link'>Se connecter</Link>
              <Link to="/register" className='navbar-link'>S'inscrire</Link>
            </>
        }

      </div>
    </div>
  )
}

export default Navbar