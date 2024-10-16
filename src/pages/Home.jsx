import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import '../assets/css/home.css'
import { UserContext } from '../App'
import { Link } from 'react-router-dom'

const Home = () => {
    const { user } = useContext(UserContext)
    return (
        <>
            <Navbar />
            <div className="home">
                <h1 className="home-title">
                    GESTION DE CONTACT CENTRE 3001
                </h1>
                {
                    user ? <>
                        <p className='home-description'>
                            Bienvenue {user.name}
                        </p>
                        <Link to="/dashboard" type='button' className="home-btn">Tableau de Bord</Link>
                    </>
                        : <>
                            <p className='home-description'>
                                Connectez-vous et commencez à ajouter, modifier ou supprimer vos contacts en quelques clics.
                            </p>
                        </>
                }
            </div>
        </>
    )
}

export default Home