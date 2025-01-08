import React, { useEffect, useState, useContext } from 'react'
import "../assets/css/contacts.css"
import axios from 'axios'
import DataTable from 'react-data-table-component'
import { FaPenToSquare, FaRegTrashCan, FaEye } from 'react-icons/fa6'
import CircleLoader from 'react-spinners/CircleLoader'
import Modal from 'react-modal'
import { GiHamburgerMenu } from "react-icons/gi";
import { DashboardContext } from '../pages/Dashboard';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const customStyles = {
  headCells: {
    style: {
      fontSize: 15 + "px",
      fontWeight: 600,
    },
  },
  cells: {
    style: {
      fontSize: 13 + "px",
      fontWeight: 500,
    },
  },
};

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: "60%",
  },
};

const MySwal = withReactContent(Swal)

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const deleteContact = (id) => {
    MySwal.fire({
      title: "Êtes-vous sûr?",
      text: "Ce contact sera supprimé!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete("https://app-centre3001-api.vercel.app/gestion_contact/contact/" + id, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
          .then(res => {
            setContacts(res.data.contacts);
            MySwal.fire({
              title: "Supprimé!",
              text: "Ce contact a bien été supprimé!",
              icon: "success"
            });

          }).catch(err => {
            MySwal.fire({
              title: "Erreur!",
              text: "Une erreur est survenue!",
              icon: "error"
            });
          });
      }
    });
  }



  const columns = [
    {
      name: 'Nom',
      selector: row => row.last_name,
    },
    {
      name: 'Prénom',
      selector: row => row.first_name,
    },
    {
      name: 'Téléphone',
      selector: row => row.phone,
    },
    {
      name: 'Email',
      selector: row => row.email,
    },
    {
      name: 'Type',
      selector: row => {
        switch (row.contactType) {
          case 'business':
            return 'Entreprise';
          case 'private':
            return 'Privé';
          case 'client':
            return 'Client';
        }
      }
    },
    {
      name: 'Action',
      selector: row => (
        <div className="action-icons">
          <FaEye className='table-icon1' onClick={() => handleEditClick(row)} />
          <Link to={`/dashboard/edit-contact/${row._id}`}>
            <FaPenToSquare className='table-icon2' />
          </Link>
          <FaRegTrashCan className='table-icon3' onClick={() => deleteContact(row._id)} />
        </div>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    axios.get("https://app-centre3001-api.vercel.app/gestion_contact/contacts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (res.data.success) {
          setContacts(res.data.contacts);
          setLoading(false)
        }
      }).catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const { handleToggleClick } = useContext(DashboardContext);

  // Filtrer les contacts en fonction du type sélectionné
  const filteredContacts = contacts
    .filter(contact => {
      if (filterType === 'all') return true;
      return contact.contactType === filterType;
    })
    .filter(contact => {
      return (
        contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm) ||
        contact.businessName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });


  return (
    <>
      {
        loading ? (
          <>
            <div className="topbar">
              <div className="toggle" onClick={handleToggleClick}>
                <GiHamburgerMenu />
              </div>
            </div>
            <CircleLoader
              loading={loading}
              size={50}
              aria-label='Loading Sponner'
              data-testid="loader"
            />
          </>

        ) : (
          <>
            <div className="topbar">
              <div className="toggle" onClick={handleToggleClick}>
                <GiHamburgerMenu />
              </div>
              <div className="search">
                <label>
                  <input type="text"
                    placeholder="Rechercher par nom, prénom ou téléphone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </label>
              </div>
            </div>

            {contacts.length === 0 ? <></> :
              <div className="filter-container">
                <label htmlFor="filter">Filtrer par type:</label>
                <select
                  id="filter"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Tous</option>
                  <option value="private">Privé</option>
                  <option value="business">Entreprise</option>
                  <option value="client">Client</option>
                </select>
              </div>
            }

            <div className="contact-list">
              <DataTable
                columns={columns}
                data={filteredContacts}
                customStyles={customStyles}
                pagination
                noDataComponent={<h1><strong>Aucun contact ajouté</strong></h1>}
              />
            </div>
          </>
        )
      }

      {/* Modal for editing contact */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Détails du Contact"
      >
        <div className="contact-details">
          <h2>Détails du Contact</h2>
          {selectedContact && (
            <div className="contact-details-content">
              <div className="contact-details-column">
                <p><strong>Nom:</strong> <span>{selectedContact.last_name}</span></p>
                <p><strong>Prénom:</strong> <span>{selectedContact.first_name}</span></p>
                <p><strong>Email:</strong> <span>{selectedContact.email}</span></p>
                <p><strong>Téléphone:</strong> <span>{selectedContact.phone}</span></p>
                <p><strong>Pays:</strong> <span>{selectedContact.country}</span></p>
                <p><strong>Municipalité:</strong> <span>{selectedContact.municipality}</span></p>
                <p><strong>Province:</strong> <span>{selectedContact.province}</span></p>
                <p><strong>Adresse:</strong> <span>{selectedContact.address}</span></p>
                <p><strong>Code Postal:</strong> <span>{selectedContact.postalCode}</span></p>
                <p><strong>Site internet:</strong> <span>{selectedContact.website}</span></p>
              </div>
              <div className="contact-details-column">
                <p><strong>Skype:</strong> <span>{selectedContact.skype}</span></p>
                <p><strong>Date de naissance:</strong> <span>{selectedContact.birthday}</span></p>
                {selectedContact.contactType === "business" ?
                  <>
                    <p><strong>Nom de l'entreprise:</strong> <span>{selectedContact.businessName}</span></p>
                    <p><strong>Moyen de paiement:</strong> <span>{selectedContact.paymentMethod}</span></p>
                  </>
                  : <></>
                }
                <p><strong>Commentaire:</strong> <span>{selectedContact.comment}</span></p>

              </div>

            </div>
          )}
        </div>
      </Modal>

    </>
  )
}

export default Contacts