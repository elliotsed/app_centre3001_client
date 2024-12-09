import React, { useState, useContext, useEffect } from 'react'
import "../assets/css/addcontact.css"
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DashboardContext } from '../pages/Dashboard'
import { GiHamburgerMenu } from "react-icons/gi";



const EditContact = () => {
    const [values, setValues] = useState({
        contactType: "",
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

    const { id } = useParams()


    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(values)

        axios.put("https://app-centre3001-api.vercel.app/gestion_contact/update-contact/" + id, values, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                if (res.data.success) {
                    toast.success("Contact modifié", {
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


    useEffect(() => {
        axios.get("https://app-centre3001-api.vercel.app/gestion_contact/contacts/" + id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                // console.log(res)
                if (res.data.success) {
                    setValues({
                        contactType: res.data.contactType,
                        first_name: res.data.first_name,
                        last_name: res.data.last_name,
                        email: res.data.email,
                        phone: res.data.phone,
                        address: res.data.address,
                        country: res.data.country,
                        postalCode: res.data.postalCode,
                        municipality: res.data.municipality,
                        province: res.data.province,
                        website: res.data.website,
                        skype: res.data.skype,
                        birthday: res.data.birthday,
                        comment: res.data.comment,
                        businessName: res.data.businessName,
                        paymentMethod: res.data.paymentMethod
                    })
                }
            }).catch(err => {
                console.log(err)
            })
    }, [])



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
                    <h2>Modifier un Contact</h2>
                    <div className="type-form-row">
                        <div className="type-form-group">
                            <label htmlFor="contactType">Type de contact:</label>
                            <select name="contactType" value={values.contactType} onChange={handleInput}>
                                <option value="private">Privé</option>
                                <option value="business">Entreprise</option>
                            </select>
                        </div>
                    </div>
                    
                    {values.contactType === 'business' && (
                        <div className="form-row">
                            <div className="form-group">
                                <input type="text" placeholder="Nom de l'entreprise" className="form-control" name='businessName' onChange={handleInput} value={values.businessName} />
                            </div>
                            <div className="form-group">
                                <input type="text" placeholder='Mode de paiement' className="form-control" name='paymentMethod' onChange={handleInput} value={values.paymentMethod} />
                            </div>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Nom' className="form-control" name='last_name' onChange={handleInput} value={values.last_name} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Prénom' className="form-control" name="first_name" onChange={handleInput} value={values.first_name} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="email" placeholder='Email' className="form-control" name='email' autoComplete='off' onChange={handleInput} value={values.email} />
                        </div>
                        <div className="form-group">
                            <input type="tel" placeholder='Téléphone' className="form-control" name='phone' onChange={handleInput} value={values.phone} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Pays' className="form-control" name='country' onChange={handleInput} value={values.country} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Province' className="form-control" name='province' onChange={handleInput} value={values.province} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Adresse' className="form-control" name='address' onChange={handleInput} value={values.address} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Code postal' className="form-control" name='postalCode' onChange={handleInput} value={values.postalCode} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Municipalité' className="form-control" name='municipality' onChange={handleInput} value={values.municipality} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Date de naissance' className="form-control" name='birthday' onFocus={(e) => e.target.type = "date"}
                                onBlur={(e) => e.target.type = "text"} onChange={handleInput} value={values.birthday} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input type="text" placeholder='Site web' className="form-control" name='website' onChange={handleInput} value={values.website} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder='Skype' className="form-control" name='skype' onChange={handleInput} value={values.skype} />
                        </div>
                    </div>
                    <div className="form-row full-width">
                        <div className="form-group">
                            <textarea placeholder="Commentaire" className="form-control" name="comment" onChange={handleInput} value={values.comment} rows="5" />
                        </div>
                    </div>

                    <button className="form-btn">Modifier</button>
                </form>
            </div>
        </>
    )
}

export default EditContact