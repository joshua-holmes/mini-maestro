import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateMusic from './components/CreateMusic';
import NavBar from './components/NavBar';
import HowItWorks from './components/HowItWorks';
import AboutMe from './components/AboutMe';
import Signup from './components/Signup';
import Login from './components/Login';
import { useEffect, useState } from 'react';

function App() {

  const [user, setUser] = useState({})

  useEffect(() => {
    fetch("/api/me")
    .then(r => r.json())
    .then(setUser)
    .catch(error => console.error("DO A BARREL ROLL ==>", error))
  }, [])
  
  return (
    <>
      <NavBar setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home firstName={user.first_name} />}/>
        <Route path="/create-new" element={<CreateMusic user={user} />}/>
        <Route path="/how-it-works" element={<HowItWorks />}/>
        <Route path="/about-me" element={<AboutMe />}/>
        <Route path="/sign-up" element={<Signup setUser={setUser}/>}/>
        <Route path="/login" element={<Login 
          isLoggedIn={!!user.username}
          setUser={setUser}/>}
        />
      </Routes>
    </>
  );
}

export default App;
