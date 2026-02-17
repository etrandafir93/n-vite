import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import ClassicInvitation from './pages/invitation/Classic'
import RomanticInvitation from './pages/invitation/Romantic'
import SportyInvitation from './pages/invitation/Sporty'
import NaturalInvitation from './pages/invitation/Natural'

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/v2">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invitation/:slug/classic" element={<ClassicInvitation />} />
        <Route path="/invitation/:slug/romantic" element={<RomanticInvitation />} />
        <Route path="/invitation/:slug/sporty" element={<SportyInvitation />} />
        <Route path="/invitation/:slug/natural" element={<NaturalInvitation />} />
      </Routes>
    </BrowserRouter>
  )
}
