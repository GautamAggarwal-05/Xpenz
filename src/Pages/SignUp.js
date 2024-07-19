import React from 'react'
import SignupSigninComponent from '../components/SignUpSignIn/SignupSigninComponent'
import Header from '../components/Header/Header'
function SignUp() {
  return (
    <>
    <Header/>
    <div className='wrapper'>
      <SignupSigninComponent/>
    </div>
    </>
    
  )
}

export default SignUp
