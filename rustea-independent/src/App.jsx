import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import DrinkDetail from './pages/DrinkDetail'
import Favorites from './pages/Favorites'
import AdminPanel from './admin/AdminPanel'

function App() {
  const location = useLocation()
  const [currentPageName, setCurrentPageName] = useState('Home')

  React.useEffect(() => {
    const path = location.pathname.replace('/', '') || 'Home'
    setCurrentPageName(path)
  }, [location])

  return (
    <Layout currentPageName={currentPageName}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/drink" element={<DrinkDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Layout>
  )
}

export default App