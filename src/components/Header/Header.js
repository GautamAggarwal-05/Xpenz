import React, { useEffect } from 'react'
import "./Header.css"    
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userImg from "../../assets/user.svg";
function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(()=>{
    if(user){ // if user logged in than next time when they visit keep them looged in and directly show them dashborad until they logged out
      navigate("/dashboard")
    }
  },[user, loading]);

  function logoutfunc() {
    try{
      signOut(auth).then(() => {
        // Sign-out successful.
        navigate("/")
        toast.success("Logged Out Successfully")
      }).catch((error) => {
        // An error happened.
      });
    }catch(err){
      toast.error(err.message)
    }

  }

  return (
    <div className='navbar'>
      <p className='logo'>Xpensez.</p>
      {user && (
      <div style={{display:"flex", alignItems:"center",gap:"0.5rem"}}>
      <img src={user.photoURL?user.photoURL : userImg} alt=''
       style={{height:"1.5rem",width:"1.5rem",borderRadius:"50%"}}/>
      <p className='link' onClick={logoutfunc}>Logout</p>
      </div>
      )}
    </div>
  );
}

export default Header
