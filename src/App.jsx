import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import CompanyProfile from './components/CompanyProfile'
import Auth from './components/Auth'
import Campaigns from './components/Campaigns'
import CompanyDashboard from './components/CompanyDashboard'
import UserAccount from './components/UserAccount'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function App(){
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company/:id" element={<CompanyProfile />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/account" element={<UserAccount />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
