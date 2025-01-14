import React, { useState } from 'react'
import "../assets/css/form.css"
import { Link, useNavigate } from 'react-router-dom'
import Validation from '../components/Validation'
import axios from 'axios'
import { toast } from 'react-toastify'


const Register = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        password_confirm: ""
    })

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
        if (errs.name === "" && errs.email === "" && errs.password === "" && errs.password_confirm === "") {
            axios
              .post(
                "https://app-centre3001-api.vercel.app/gestion_contact/register",
                values
              )
              .then((res) => {
                if (res.data.success) {
                  toast.success("Votre compte a été créé avec succès", {
                    position: "top-right",
                    autoClose: 5000,
                  });
                  navigate("/login");
                }
              })
              .catch((err) => {
                if (err.response.data.errors) {
                  setServerErrors(err.response.data.errors);
                }
                console.log(err);
              });
        }
    }

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Créer un Compte</h2>
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Nom:</label>
                    <input type="text" placeholder='Entrez votre nom' className="form-control" name='name' onChange={handleInput} />
                    {
                        errors.name && <span className="error">{errors.name}</span>
                    }
                </div>
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
                <div className="form-group">
                    <label htmlFor="password_confirm" className="form-label">Confirmez le mot de passe:</label>
                    <input type="password" placeholder='********' className="form-control" name='password_confirm' onChange={handleInput} />
                    {
                        errors.password_confirm && <span className="error">{errors.password_confirm}</span>
                    }
                </div>
                {
                    serverErrors.length > 0 && (
                        serverErrors.map((error, index) => (
                            <p className="error">{error.msg}</p>
                        ))
                    )
                }
                <button className="form-btn">Inscription</button>
                <p>Vous-avez déjà un compte? <Link to="/login">Se connecter</Link></p>
            </form>
        </div>
    )
}

export default Register