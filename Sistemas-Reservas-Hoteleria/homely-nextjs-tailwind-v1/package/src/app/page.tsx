"use client"
import { useState } from 'react'
import GetInTouch from '@/components/Home/Index/index'
import FAQ from '@/components/Home/PreguntasF'
import LoginModal from '@/components/Auth/LoginModal'
import RegisterModal from '@/components/Auth/RegisterModal'

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
      <main>
        <GetInTouch 
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />
        <FAQ />
      </main>

      {/* Modales de autenticación */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  )
}
