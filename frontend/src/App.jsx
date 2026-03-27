import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Templates from './components/Templates'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import ClassicInvitation from './pages/invitation/Classic'
import RomanticInvitation from './pages/invitation/Romantic'
import ModernInvitation from './pages/invitation/Modern'
import NaturalInvitation from './pages/invitation/Natural'
import Invitation from './pages/guests/Invitation'
import EventsDashboard from './pages/events/EventsDashboard'
import EventBuilder from './pages/events/EventBuilder'
import EventAnalytics from './pages/events/EventAnalytics'

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Templates />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invitations/:ref" element={<Invitation />} />
        <Route path="/invitations/:ref/:theme" element={<Invitation />} />
        <Route path="/invitation/:slug/classic" element={<ClassicInvitation />} />
        <Route path="/invitation/:slug/romantic" element={<RomanticInvitation />} />
        <Route path="/invitation/:slug/modern" element={<ModernInvitation />} />
        <Route path="/invitation/:slug/natural" element={<NaturalInvitation />} />
        <Route path="/events" element={<EventsDashboard />} />
        <Route path="/events/builder" element={<EventBuilder />} />
        <Route path="/events/:reference/dashboard" element={<EventAnalytics />} />
      </Routes>
    </BrowserRouter>
  )
}
