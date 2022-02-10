import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateMusic from './components/CreateMusic';
import NavBar from './components/NavBar';
import HowItWorks from './components/HowItWorks';

function App() {
  
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/create-new" element={<CreateMusic />}/>
        <Route path="/how-it-works" element={<HowItWorks />}/>
      </Routes>
    </>
  );
}

export default App;
