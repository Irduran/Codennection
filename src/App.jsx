import './App.css'
import { Login } from './components/Login/Login'
import { Stars } from './components/Stars/Stars'
import {Dashboard} from '../src/components/Dashboard/Dashboard'
import { useState } from 'react'
import appFirebase from '../src/credentials'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
const auth = getAuth(appFirebase)


function App() {

  const [usuario, setUsuario] = useState(null)

  onAuthStateChanged(auth, (usuarioFirebase)=>{
    if(usuarioFirebase){
      setUsuario(usuarioFirebase)
    }else{
      setUsuario(null)
    }
  })

  return (
    <div>
      <Stars></Stars>
      {usuario ? <Dashboard correoUsuario = {usuario.email} /> : <Login/>}
    </div>
  )
}

export default App