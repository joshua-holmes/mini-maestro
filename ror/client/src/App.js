import './App.css';
import { Routes, Route } from 'react-router-dom';
import CreateMusic from './components/CreateMusic';
import NavBar from './components/NavBar';

function App() {
  
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/create-new" element={<CreateMusic />}/>
      </Routes>
    </>
  );
}

export default App;
