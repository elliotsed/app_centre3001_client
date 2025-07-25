import React, { useState, useContext } from 'react'
import "../assets/css/addcontact.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DashboardContext } from '../pages/Dashboard'
import { GiHamburgerMenu } from "react-icons/gi";



const AddContact = () => {
    const [values, setValues] = useState({
        contactType: "private",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        postalCode: "",
        municipality: "",
        province: "",
        website: "",
        skype: "",
        birthday: "",
        comment: "",
        businessName: "",
        paymentMethod: ""

    });
    const navigate = useNavigate();


    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(values)

        axios.post("https://app-centre3001-api.vercel.app/gestion_contact/add-contact", values, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                if (res.data.success) {
                    toast.success("Contact ajouté", {
                        position: "top-right",
                        autoClose: 5000
                    });
                    navigate('/dashboard/contacts')
                }
            }).catch(err => {
                console.log(err)
            })

    }

    const { handleToggleClick } = useContext(DashboardContext)


    return (
        <>
            <div className="topbar">
                <div className="toggle" onClick={handleToggleClick}>
                    <GiHamburgerMenu />
                </div>

                {/* <div className="search">
                    <label>
                        <input type="text" placeholder="Search here" />
                        <ion-icon name="search-outline"></ion-icon>
                    </label>
                </div>

                <div className="user">
                    <img src="assets/imgs/customer01.jpg" alt="" />
                </div> */}
            </div>
            <div className="add-form-container">
                <form className="add-form" onSubmit={handleSubmit}>
                    <h2>Ajouter un Contact</h2>
                    <div className="type-form-row">
                        <div className="type-form-group">
                            <label htmlFor="contactType">Type de contact:</label>
                            <select name="contactType" value={values.contactType} onChange={handleInput}>
                                <option value="private">Privé</option>
                                <option value="business">Entreprise</option>
                                <option value="Client thérapeutique">Client thérapeutique</option>
                                <option value="Client boutique">Client boutique</option>
                            </select>
                        </div>
                    </div>

                    {(values.contactType === 'business' || values.contactType === 'client')  && (
                        <div className="form-row">
                            <div className="form-group">
                                <input type="text" placeholder="Nom de l'entreprise" className="form-control" name='businessName' onChange={handleInput} />
                            </div>
                            <div className="form-group">
                                <input type="text" placeholder='Mode de paiement' className="form-control" name='paymentMethod' onChange={handleInput} />
                            </div>
                        </div>
                    )}
                    
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Nom' className="form-control" name='last_name' required onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Prénom' className="form-control" name="first_name" required onChange={handleInput} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="email" placeholder='Email' className="form-control" name='email' autoComplete='off' onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <input type="tel" placeholder='Téléphone' className="form-control" name='phone' onChange={handleInput} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Pays' className="form-control" name='country' onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Province' className="form-control" name='province' onChange={handleInput} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Adresse' className="form-control" name='address' onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Code postal' className="form-control" name='postalCode' onChange={handleInput} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Municipalité' className="form-control" name='municipality' onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Date de naissance' className="form-control" name='birthday' onFocus={(e) => e.target.type = "date"}
                                onBlur={(e) => e.target.type = "text"} onChange={handleInput} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Site web' className="form-control" name='website' onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Skype' className="form-control" name='skype' onChange={handleInput} />
                        </div>
                    </div>
                    <div className="form-row full-width">
                        <div className="form-group">
                            <textarea placeholder="Commentaire" className="form-control" name="comment" onChange={handleInput} rows="5" />
                        </div>
                    </div>

                    <button className="form-btn">Ajouter</button>
                </form>
            </div>
        </>
    )
}

export default AddContact