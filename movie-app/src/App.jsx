import "./css/App.css"
import Favorites from './Page/Favorites'
import Home from './Page/Home'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {
  return (
     <div> 
      <Navbar/>
    <main className='main-content'>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/favorites' element={<Favorites />} />
    </Routes>
   </main>
     </div>
  )
}

export default App
