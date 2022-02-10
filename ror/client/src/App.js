import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateMusic from './components/CreateMusic';
import NavBar from './components/NavBar';
import HowItWorks from './components/HowItWorks';
import AboutMe from './components/AboutMe';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/create-new" element={<CreateMusic />}/>
        <Route path="/how-it-works" element={<HowItWorks />}/>
        <Route path="/about-me" element={<AboutMe />}/>
        <Route path="/sign-up" element={<Signup />}/>
        <Route path="/login" element={<Login />}/>
      </Routes>
    </>
  );
}

export default App;
