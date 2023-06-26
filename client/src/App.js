import {Routes,Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/About' element={<About/>} />
    </Routes> 
    </>
  );
}

export default App;
