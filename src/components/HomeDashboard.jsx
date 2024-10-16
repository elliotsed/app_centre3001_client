import React, { useContext, useEffect, useState } from 'react'
import "../assets/css/homedashboard.css"
import { GiHamburgerMenu } from "react-icons/gi";
import { DashboardContext } from '../pages/Dashboard';
import axios from 'axios';



const HomeDashboard = () => {
    const { handleToggleClick } = useContext(DashboardContext);
    const [contacts, setContacts] = useState([]);
    const [privateContacts, setPrivateContacts] = useState([]);
    const [businessContacts, setBusinessContacts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/gestion_contact/contacts", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                if (res.data.success) {
                    const allContacts = res.data.contacts;
                    setContacts(allContacts);

                    // Filtrer les contacts par type
                    const privateContactsFiltered = allContacts.filter(contact => contact.contactType === 'private');
                    const businessContactsFiltered = allContacts.filter(contact => contact.contactType === 'business');

                    setPrivateContacts(privateContactsFiltered);
                    setBusinessContacts(businessContactsFiltered);
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

            {/* <!-- ======================= Cards ================== --> */}
            <div className="cardBox">
                <div className="card">
                    <div>
                        <div className="numbers">{contacts.length}</div>
                        <div className="cardName">{contacts.length === 0 || contacts.length === 1 ? "Contact Ajouté" : "Contacts Ajoutés"}</div>
                    </div>

                    <div className="iconBx">
                        <ion-icon name="eye-outline"></ion-icon>
                    </div>
                </div>

                <div className="card">
                    <div>
                        <div className="numbers">{privateContacts.length}</div>
                        <div className="cardName">{privateContacts.length === 0 || privateContacts.length === 1 ? "Contact Privé" : "Contacts Privés"}</div>
                    </div>

                    <div className="iconBx">
                        <ion-icon name="cart-outline"></ion-icon>
                    </div>
                </div>

                <div className="card">
                    <div>
                        <div className="numbers">{businessContacts.length}</div>
                        <div className="cardName">{businessContacts.length === 0 || businessContacts.length === 1 ? "Contact d'entreprise" : "Contacts d'entreprise"}</div>
                    </div>

                    <div className="iconBx">
                        <ion-icon name="chatbubbles-outline"></ion-icon>
                    </div>
                </div>
                {/* 
                <div className="card">
                    <div>
                        <div className="numbers">$7,842</div>
                        <div className="cardName">Earning</div>
                    </div>

                    <div className="iconBx">
                        <ion-icon name="cash-outline"></ion-icon>
                    </div>
                </div> */}
            </div>

            {/* <!-- ================ Order Details List ================= --> */}
            <div className="details">
                {/* <div className="recentOrders">
                    <div className="cardHeader">
                        <h2>Recent Orders</h2>
                        <a href="#" className="btn">View All</a>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Price</td>
                                <td>Payment</td>
                                <td>Status</td>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Star Refrigerator</td>
                                <td>$1200</td>
                                <td>Paid</td>
                                <td><span className="status delivered">Delivered</span></td>
                            </tr>

                            <tr>
                                <td>Dell Laptop</td>
                                <td>$110</td>
                                <td>Due</td>
                                <td><span className="status pending">Pending</span></td>
                            </tr>

                            <tr>
                                <td>Apple Watch</td>
                                <td>$1200</td>
                                <td>Paid</td>
                                <td><span className="status return">Return</span></td>
                            </tr>

                            <tr>
                                <td>Addidas Shoes</td>
                                <td>$620</td>
                                <td>Due</td>
                                <td><span className="status inProgress">In Progress</span></td>
                            </tr>

                            <tr>
                                <td>Star Refrigerator</td>
                                <td>$1200</td>
                                <td>Paid</td>
                                <td><span className="status delivered">Delivered</span></td>
                            </tr>

                            <tr>
                                <td>Dell Laptop</td>
                                <td>$110</td>
                                <td>Due</td>
                                <td><span className="status pending">Pending</span></td>
                            </tr>

                            <tr>
                                <td>Apple Watch</td>
                                <td>$1200</td>
                                <td>Paid</td>
                                <td><span className="status return">Return</span></td>
                            </tr>

                            <tr>
                                <td>Addidas Shoes</td>
                                <td>$620</td>
                                <td>Due</td>
                                <td><span className="status inProgress">In Progress</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}

                {/* <!-- ================= New Customers ================ --> */}
                {/* <div className="recentCustomers">
                    <div className="cardHeader">
                        <h2>Recent Customers</h2>
                    </div>

                    <table>
                        <tr>
                            <td width="60px">
                                <div className="imgBx"><img src="assets/imgs/customer02.jpg" alt="" /></div>
                            </td>
                            <td>
                                <h4>David <br /> <span>Italy</span></h4>
                            </td>
                        </tr>

                        <tr>
                            <td width="60px">
                                <div className="imgBx"><img src="assets/imgs/customer01.jpg" alt="" /></div>
                            </td>
                            <td>
                                <h4>Amit <br /> <span>India</span></h4>
                            </td>
                        </tr>

                        <tr>
                            <td width="60px">
                                <div className="imgBx"><img src="assets/imgs/customer02.jpg" alt="" /></div>
                            </td>
                            <td>
                                <h4>David <br /> <span>Italy</span></h4>
                            </td>
                        </tr>

                        <tr>
                            <td width="60px">
                                <div className="imgBx"><img src="assets/imgs/customer01.jpg" alt="" /></div>
                            </td>
                            <td>
                                <h4>Amit <br /> <span>India</span></h4>
                            </td>
                        </tr>

                        <tr>
                            <td width="60px">
                                <div className="imgBx"><img src="assets/imgs/customer02.jpg" alt="" /></div>
                            </td>
                            <td>
                                <h4>David <br /> <span>Italy</span></h4>
                            </td>
                        </tr>

                        <tr>
                            <td width="60px">
                                <div className="imgBx"><img src="assets/imgs/customer01.jpg" alt="" /></div>
                            </td>
                            <td>
                                <h4>Amit <br /> <span>India</span></h4>
                            </td>
                        </tr>

                        <tr>
                            <td width="60px">
                                <div className="imgBx"><img src="assets/imgs/customer01.jpg" alt="" /></div>
                            </td>
                            <td>
                                <h4>David <br /> <span>Italy</span></h4>
                            </td>
                        </tr>

                        <tr>
                            <td width="60px">
                                <div className="imgBx"><img src="assets/imgs/customer02.jpg" alt="" /></div>
                            </td>
                            <td>
                                <h4>Amit <br /> <span>India</span></h4>
                            </td>
                        </tr>
                    </table>
                </div> */}
            </div>
        </>
    )
}

export default HomeDashboard