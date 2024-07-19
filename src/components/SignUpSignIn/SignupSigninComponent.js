import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import "./Sign.css"
import Input from '../Input/Input'
import Button from '../Button/Button'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  createUserWithEmailAndPassword , signInWithEmailAndPassword} from "firebase/auth";
import {auth,db, provider} from "../../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { signInWithPopup} from "firebase/auth";

function SignupSigninComponent() {
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const[loading,setLoading] = useState()
  const [login,setLogin] = useState(false)
  const navigate = useNavigate();

  function SignupwithEmail(){
    setLoading(true)
    // Authenticate user ,or create a new account using email address and password
    if(name!=="" && email!=="" && password!=="" && confirmPassword!=="" ){

      if(password===confirmPassword){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          console.log(user);
          toast.success("User Created Successfully")
          setLoading(false); // after user created go away loading... 
          setName("")
          setEmail("")
          setPassword("")
          setConfirmPassword("")
          navigate("/dashboard")
          // Create a Doc  with user id as the following id
          createDoc(user)
         
        })
        .catch((error) => {
          const errorMessage = error.message;
          toast.error(errorMessage)
          setLoading(false);
          // ..
        });
      }
      else{
        toast.error("Passwords do not match")
        setLoading(false);
      }

    }
    else{
          toast.error("All Fields are Mandatory!")
          setLoading(false);
    }
  }

   async function createDoc(user){
    //first make sure the doc with the uid doesnt exist
    if(!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if(!userData.exists()){
      //create a Doc.
      try{
        await setDoc(userRef, {
           name: user.displayName? user.displayName: name,
           email : user.email,
           photoURL: user.photoURL?user.photoURL:"",
           createAt: new Date(),
          });
          // toast.success("Doc Created Successfully")
      }
      catch(err){
        toast.error(err.message);
    }
  }
  else{
    // toast.error("Doc already exists!")
  }
}

  function loginWithEmail(){
    console.log(email)
    console.log(password)
    setLoading(true);
    if(email!=="" && password!==""){
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    toast.success("User Logged in")
    navigate("/dashboard")
    setLoading(false)
    createDoc(user)
    // ...
  })
  .catch((error) => {
    const errorMessage = error.message;
    toast.error(errorMessage)
    setLoading(false);
  });
  }
  else{
    toast.error("All Fields are Mandatory!")
    setLoading(false);
  }
}

 function GoogleAuth(){
  setLoading(true)
    try{
      signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    // The signed-in user info.
    const user = result.user;
    toast.success("User Authenticated")
    console.log("user>>>",user)
    createDoc(user)
    setLoading(false)
    navigate("/dashboard")
  }).catch((error) => {
    // Handle Errors here.
    const errorMessage = error.message;
    toast.error(errorMessage)
    setLoading(false)

  });
    }catch(e){
      toast.error("e.message")
      setLoading(false)
  }
 }
 
  return (
    <>
      {login?
      (<div className='signup-wrapper'>
        <h2 className='title'>LogIn on <span style = {{color: "var(--theme)"}}> Xpensez.</span></h2>
        <form>

           <Input label = {"Email"}
          type = "email"
           state={email}  
           setState={setEmail}  
           placeholder={"JhonDoe@gmail.com"}/> 

           <Input label = {"Password"}
          type = "password"
           state={password}  
           setState={setPassword} 
           placeholder={"Example@123"}/> 


          <Button disabled = {loading} text={loading?"Loading...":"Login using Email and Password"} onClick={loginWithEmail}/> 
          <p className='p-login'>Or</p>
          <Button onClick={GoogleAuth} text={loading?"Loading...":"Login using Google"} blue={true}/> 
          <p className='p-login' style = {{cursor:"pointer"}} onClick={()=>setLogin(!login)}>Don't Have an Account already? Click Here</p>
        </form>

    </div>)
      :    
      (<div className='signup-wrapper'>
        <h2 className='title'>SignUp on <span style = {{color: "var(--theme)"}}> Xpensez.</span></h2>
        <form>
          <Input label = {"Full Name"}
          type = "text"
           state={name} 
           setState={setName} 
           placeholder={"Jhon Doe"}/> 
           {/* passing props to our input components  */}

           <Input label = {"Email"}
          type = "email"
           state={email}  
           setState={setEmail}  
           placeholder={"JhonDoe@gmail.com"}/> 

           <Input label = {"Password"}
          type = "password"
           state={password}  
           setState={setPassword} 
           placeholder={"Example@123"}/> 

           <Input label = {"Confirm Password"}
          type = "password"
           state={confirmPassword} 
           setState={setConfirmPassword} 
           placeholder={"JExample@123"}/> 

          <Button disabled = {loading} text={loading?"Loading...":"Signup using Email and Password"} onClick={SignupwithEmail}/> 
          <p className='p-login'>Or</p>
          <Button onClick={GoogleAuth} text={loading?"Loading...":"Signup using Google"} blue={true}/> 
          <p className='p-login' style = {{cursor:"pointer"}} onClick={()=>setLogin(!login)}>Or Have an Account already? Click Here</p>
        </form>

    </div>)}
    </>

  )
}


export default SignupSigninComponent

