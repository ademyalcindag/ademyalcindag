import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import CompanyProfile from './components/CompanyProfile'
import Auth from './components/Auth'
import Campaigns from './components/Campaigns'
import AdminPanel from './components/AdminPanel'
import CompanyDashboard from './components/CompanyDashboard'
import Navbar from './components/Navbar'

export default function App(){
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company/:id" element={<CompanyProfile />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  )
}
