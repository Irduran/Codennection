import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import { app } from '../../firebase'
import './Logout.css'

export const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you already leaving? 😭',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#463961',
      cancelButtonColor: '#B0619e',
      confirmButtonText: 'Yes, Bye 😣',
      cancelButtonText: 'Noo Cancel! 🥳',
    });
  
    if (result.isConfirmed) {
      const auth = getAuth(app);
      try {
        await signOut(auth);

        Swal.fire({
          title: 'You have logged out successfully.',
          text: 'See you soon ✨',
          icon: 'success',
          confirmButtonText: 'Oki',
        });
  
        navigate("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
  
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al cerrar sesión.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  };

  return (
    <div className="d-flex p-2 flex-row-reverse">
      <div className="topbar-logout-round" onClick={handleLogout}>
        <FontAwesomeIcon
          icon={faArrowRightFromBracket}
          className="topbar-notification"
        />
      </div>
    </div>
  );
};