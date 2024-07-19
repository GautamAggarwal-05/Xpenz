import './App.css';
import React from'react';
import {Routes , Route} from 'react-router-dom';
import SignUp from './Pages/SignUp'; 
import DashBoard from './Pages/DashBoard';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
   <>
    <ToastContainer position="top-right" autoClose={5000} />  {/* Notification Component */}
              <Routes>
              <Route path="/" element = {<SignUp/>}></Route>
              <Route path="/dashboard" element = {<DashBoard/> }></Route>
            </Routes>

      </>
  );
}

export default App;
