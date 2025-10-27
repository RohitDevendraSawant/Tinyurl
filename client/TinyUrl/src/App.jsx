import React from 'react'
import Header from './components/Header'
import { Outlet } from 'react-router'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-900 text-white'>
      <Header />
      <main className='grow flex flex-col'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App;