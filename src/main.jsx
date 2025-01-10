
import { createRoot } from 'react-dom/client'
import './index.css'
import Manager from './components/manager.jsx'
import Navbar from './components/Navbar_1.jsx'
import Footer from './components/footer.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <Navbar/>
    <Manager/>
    <Footer/>
  </>
)
