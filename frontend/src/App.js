import React from 'react';
import {  Routes , Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/homePage/HomePage';
import ChatPage from './pages/chatPage/ChatPage';
import ForgetPasswordPage from './pages/forgetPasswordPage/ForgetPasswordPage';




function App() {
  return (
    <div className='App'>
      	<Routes>
          <Route exact path='/' element={<HomePage/>} />
          <Route path='/chats' element={<ChatPage/>} />
          <Route path='/forget-password' element={<ForgetPasswordPage />} />

        </Routes>
    </div>
  )   
}

export default App


    