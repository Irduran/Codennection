import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../../firebase'; // asegurate de importar `db`
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function GoogleAuth() {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const isNewUser = result._tokenResponse.isNewUser;

      const userRef = doc(db, "users", user.uid);

      if (isNewUser) {
        // Si es nuevo, creamos un documento básico
        await setDoc(userRef, {
          email: user.email,
          uid: user.uid,
          nombre: user.displayName || "",  // Opcional: nombre de Google
          bio: "",
          programmingLanguages: []
        });

        const userData = {
          email: user.email,
          uid: user.uid,
          nombre: user.displayName,
          bio: "",
          programmingLanguages: []
        };

        sessionStorage.setItem("userData", JSON.stringify(userData));
        Swal.fire("Sign Up Success! ✨", "You're a Codder Now!🥳", "success");
        navigate("/registro");

      } else {
        // Si ya existe, recuperamos los datos de Firestore
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = {
            email: user.email,
            uid: user.uid,
            ...userDoc.data()  // mergea lo que tengas guardado como nombre, bio, etc.
          };

          sessionStorage.setItem("userData", JSON.stringify(userData));
          Swal.fire("Welcome! ⭐", "Have fun 🐤", "success");
          navigate("/dashboard");
        } else {
          Swal.fire("Error", "User data not found ❌", "error");
        }
      }

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Google sign-in failed ❌", "error");
    }
  };

  return (
    <img
      src="src/assets/google.png"
      alt="Sign in with Google"
      className="google-login"
      onClick={signInWithGoogle}
    />
  );
}
