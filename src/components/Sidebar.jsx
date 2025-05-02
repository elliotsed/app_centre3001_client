import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFileInvoice } from 'react-icons/fa';
import { RiContactsBook3Fill } from 'react-icons/ri';
import { IoPersonAddSharp } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { IoHome } from 'react-icons/io5';
import { FaShoppingCart } from 'react-icons/fa';
import '../assets/css/sidebar.css';

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState(0);
  return (
    <ul>
      <li>
        <Link to="#" className="sidebar-link">
          <span className="icon">
            <ion-icon name="logo-apple"></ion-icon>
          </span>
          <span className="title mt-5">CENTRE 3001</span>
        </Link>
      </li>

      <li className={`${activeLink === 0 ? 'activeLink' : ''}`} onClick={() => setActiveLink(0)}>
        <Link to="/dashboard" className="sidebar-link">
          <span className="icon">
            <IoHome />
          </span>
          <span className="title">Dashboard</span>
        </Link>
      </li>

      <li className={`${activeLink === 1 ? 'activeLink' : ''}`} onClick={() => setActiveLink(1)}>
        <Link to="/dashboard/contacts" className="sidebar-link">
          <span className="icon">
            <RiContactsBook3Fill />
          </span>
          <span className="title">Mes Contacts</span>
        </Link>
      </li>

      <li className={`${activeLink === 2 ? 'activeLink' : ''}`} onClick={() => setActiveLink(2)}>
        <Link to="/dashboard/add-contact" className="sidebar-link">
          <span className="icon">
            <IoPersonAddSharp />
          </span>
          <span className="title">Ajouter Contact</span>
        </Link>
      </li>

      <li className={`${activeLink === 3 ? 'activeLink' : ''}`} onClick={() => setActiveLink(3)}>
        <Link to="/dashboard/add-client" className="sidebar-link">
          <span className="icon">
            <FaUser />
          </span>
          <span className="title">Ajouter un Client</span>
        </Link>
      </li>

      <li className={`${activeLink === 4 ? 'activeLink' : ''}`} onClick={() => setActiveLink(4)}>
        <Link to="/dashboard/clients" className="sidebar-link">
          <span className="icon">
            <FaUser />
          </span>
          <span className="title">Mes Clients</span>
        </Link>
      </li>

      <li className={`${activeLink === 5 ? 'activeLink' : ''}`} onClick={() => setActiveLink(5)}>
        <Link to="/dashboard/facture" className="sidebar-link flex items-center">
          <p className="icon">
            <FaFileInvoice />
          </p>
          <p className="title">Facture</p>
        </Link>
      </li>

      <li className={`${activeLink === 7 ? 'activeLink' : ''}`} onClick={() => setActiveLink(7)}>
        <Link to="/dashboard/sales" className="sidebar-link">
          <span className="icon">
            <FaShoppingCart />
          </span>
          <span className="title">Ventes</span>
        </Link>
      </li>

      <li className={`${activeLink === 6 ? 'activeLink' : ''}`} onClick={() => setActiveLink(6)}>
        <Link to="/logout" className="sidebar-link">
          <span className="icon">
            <RiLogoutCircleLine />
          </span>
          <span className="title">Déconnexion</span>
        </Link>
      </li>
    </ul>
  );
};

export default Sidebar;