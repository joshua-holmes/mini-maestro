import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateMusic from './components/CreateMusic';
import NavBar from './components/NavBar';
import HowItWorks from './components/HowItWorks';
import AboutMe from './components/AboutMe';
import Signup from './components/Signup';
import Login from './components/Login';
import MyTunes from './components/MyTunes';
import Tune from './components/Tune';
import NoMatch from './components/NoMatch';
import { useEffect, useState } from 'react';

function App() {

  const [user, setUser] = useState({})
  const isLoggedIn = !!user.username;

  useEffect(() => {
    fetch("/api/me")
    .then(r => r.json())
    .then(setUser)
    .catch(error => console.error("DO A BARREL ROLL ==>", error))
  }, [])
  
  return (
    <>
      <NavBar setUser={setUser} isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home firstName={user.first_name} />}/>
        <Route path="/create-new" element={<CreateMusic userState={[user, setUser]} />}/>
        <Route path="/how-it-works" element={<HowItWorks />}/>
        <Route path="/about-me" element={<AboutMe />}/>
        <Route path="/sign-up" element={<Signup setUser={setUser}/>}/>
        <Route path="/login" element={<Login 
          isLoggedIn={!!user.username}
          setUser={setUser}/>}
        />
        <Route path="/my-tunes" element={<MyTunes userState={[user, setUser]} />}/>
        <Route path="/my-tunes/:id" element={<Tune userState={[user, setUser]} />} />
        <Route path="*" element={<NoMatch />}/>
      </Routes>
    </>
  );
}

export default App;
