import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './Pages/Home'
import  Screentest from './Pages/Screentest'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/screen-test" element={<Screentest />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
