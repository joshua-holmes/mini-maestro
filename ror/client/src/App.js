import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateMusic from './components/CreateMusic';
import NavBar from './components/NavBar';

function App() {
  
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/create-new" element={<CreateMusic />}/>
      </Routes>
    </>
  );
}

export default App;
