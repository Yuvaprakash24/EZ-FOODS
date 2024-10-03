import ResponsiveAppBar from './components/ResponsiveAppBar'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Ez_Menu from './components/Ez_Menu'
import About from './components/about'
import Admin_Dashboard from './components/Admin_Dashboard'
import Cart from './components/Cart'
import Success from './components/Success'
import Cancel from './components/Cancel'
const App = () => {
  return (
    <>
    <BrowserRouter>
    <ResponsiveAppBar />
      <Routes>
        <Route path='/' element={<About />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/contact' element={<About />}/>
        <Route path='/menu' element={<Ez_Menu/>}/>
        <Route path='/admin-dashboard' element={<Admin_Dashboard/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/success' element={<Success/>}/>
        <Route path='/cancel' element={<Cancel/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App