import React from 'react'

const ThankYou: React.FC = () => {
  return (
    <div className="text-center p-12 bg-white rounded-lg shadow-xl">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h2 className="text-3xl font-bold text-slate-800 mt-4">Form Submitted Successfully!</h2>
    <p className="text-slate-600 mt-2">Thank you for completing the onboarding process. We will be in touch shortly.</p>
</div>
  )
}

export default ThankYou