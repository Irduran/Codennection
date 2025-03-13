import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export function GoogleAuth() {
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log(user);
        // Redirige al usuario al Dashboard
        navigate("/dashboard", { state: { user: { email: user.email, displayName: user.displayName } } });
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <img
    src="src\assets\google.png"
    alt="Sign in with Google"
    className="google-login"
    onClick={signInWithGoogle}
  />
  );
}
