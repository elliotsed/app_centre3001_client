import React, { useContext, useState } from 'react'
import "../assets/css/form.css"
import { Link, useNavigate } from 'react-router-dom'
import Validation from '../components/Validation'
import axios from 'axios'
import { toast } from 'react-toastify'
import { UserContext } from '../App'


const Login = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
    })

    const { user, setUser } = useContext(UserContext)
    const [errors, setErrors] = useState({})
    const [serverErrors, setServerErrors] = useState([])
    const navigate = useNavigate()

    const handleInput = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errs = Validation(values)
        setErrors(errs)
        if (errs.email === "" && errs.password === "") {
            axios.post("https://app-centre3001-api.vercel.app/gestion_contact/login", values)
                .then(res => {
                    if (res.data.success) {
                        toast.success("Connexion réussie", {
                            position: "top-right",
                            autoClose: 5000
                        });
                        localStorage.setItem("token", res.data.token)
                        setUser(res.data.user)
                        navigate("/dashboard")
                    }
                }).catch(err => {
                    if (err.response.data.errors) {
                        setServerErrors(err.response.data.errors)
                    }
                    console.log("nous somme ici ",err.response)
                })
        }
    }

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Se Connecter</h2>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input type="email" placeholder='Entrez votre email' className="form-control" name='email' autoComplete='off' onChange={handleInput} />
                    {
                        errors.email && <span className="error">{errors.email}</span>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Mot de passe:</label>
                    <input type="password" placeholder='********' className="form-control" name='password' onChange={handleInput} />
                    {
                        errors.password && <span className="error">{errors.password}</span>
                    }
                </div>
                {
                    serverErrors.length > 0 && (
                        serverErrors.map((error, index) => (
                            <p className="error">{error.msg}</p>
                        ))
                    )
                }
                <button className="form-btn">Connexion</button>
                <p>Vous n'avez pas de compte? <Link to="/register">S'inscrire</Link></p>
            </form>
        </div>
    )
}

export default Login