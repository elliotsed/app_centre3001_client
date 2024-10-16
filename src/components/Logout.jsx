import React, { useContext } from 'react'
import { UserContext } from '../App'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom'




const Logout = () => {
    const MySwal = withReactContent(Swal)
    const navigate = useNavigate()
    const { setUser } = useContext(UserContext)

    MySwal.fire({
        title: "Êtes-vous sûr?",
        text: "Voulez vous quitter ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui",
        cancelButtonText: "Non"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear()
            setUser(null)
            navigate("/");
        }
        else {
            navigate("/dashboard")
        }
    });
}

export default Logout