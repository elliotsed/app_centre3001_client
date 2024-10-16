import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/home.css'


const NotFound = () => {
    return (
        <div className="not-found">
            <h1>404</h1>
            <h1>Cette Page N'existe Pas</h1>
            <h2>Retour à <Link to="/">l'accueil</Link></h2>
        </div>
  )
}

export default NotFound