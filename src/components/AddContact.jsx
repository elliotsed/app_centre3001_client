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

        axios.post("http://localhost:3000/gestion_contact/add-contact", values, {
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
                            </select>
                        </div>
                    </div>
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
                            <input type="email" placeholder='Email' className="form-control" name='email' autoComplete='off' required onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <input type="tel" placeholder='Téléphone' className="form-control" name='phone' required onChange={handleInput} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Pays' className="form-control" name='country' required onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Province' className="form-control" name='province' required onChange={handleInput} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Adresse' className="form-control" name='address' required onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Code postal' className="form-control" name='postalCode' required onChange={handleInput} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Municipalité' className="form-control" name='municipality' required onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Date de naissance' className="form-control" name='birthday' required onFocus={(e) => e.target.type = "date"}
                                onBlur={(e) => e.target.type = "text"} onChange={handleInput} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Site web' className="form-control" name='website' required onChange={handleInput} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Skype' className="form-control" name='skype' required onChange={handleInput} />
                        </div>
                    </div>

                    {values.contactType === 'business' && (
                        <div className="form-row">
                            <div className="form-group">
                                <input type="text" placeholder="Nom de l'entreprise" className="form-control" name='businessName' required onChange={handleInput} />
                            </div>
                            <div className="form-group">
                                <input type="text" placeholder='Mode de paiement' className="form-control" name='paymentMethod' required onChange={handleInput} />
                            </div>
                        </div>
                    )}

                    <button className="form-btn">Ajouter</button>
                </form>
            </div>
        </>
    )
}

export default AddContact