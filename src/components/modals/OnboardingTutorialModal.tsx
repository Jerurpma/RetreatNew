import React, { useState } from 'react';

interface OnboardingTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreDestinations: () => void;
}

export const OnboardingTutorialModal: React.FC<OnboardingTutorialModalProps> = ({
  isOpen,
  onClose,
  onExploreDestinations,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      onExploreDestinations();
    }
  };

  return (
    <div id="onboarding-modal" className="portal show" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}>
      <div
        className="gp-box"
        style={{
          maxWidth: '580px',
          padding: '2.2rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #141414, #0b0b0b)',
          border: '1px solid rgba(201,168,76,0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          type="button"
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--muted)',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          &#x2715;
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.45rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.35rem' }}>
            Sanctuary Member Orientation &middot; Step {currentStep} of {totalSteps}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, color: '#fff', margin: 0 }}>
            {currentStep === 1 && '100% Legal vs. Medical Marijuana Status'}
            {currentStep === 2 && 'Select Your State & Choose Your City'}
            {currentStep === 3 && 'Transparent Itemized Price Breakdown'}
            {currentStep === 4 && 'How to Book Your Reservation'}
            {currentStep === 5 && 'Admin Team Calls Establishment to Confirm'}
          </h2>
        </div>

        {/* Step Content */}
        <div style={{ minHeight: '190px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {currentStep === 1 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>&#127807;</div>
              <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.75', margin: '0 auto', maxWidth: '460px' }}>
                Every destination tile indicates whether cannabis is <strong style={{ color: '#7EC87A' }}>100% Legal (Adult-Use 21+)</strong> or requires a <strong style={{ color: 'var(--teal)' }}>Medical Marijuana Card</strong>. For medical jurisdictions like Hawaii, Oklahoma, and Puerto Rico, Sanctuary arranges 38-state reciprocity clearance!
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>&#127961;</div>
              <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.75', margin: '0 auto', maxWidth: '460px' }}>
                Click on any state card (such as <strong>Arizona, California, Nevada, Hawaii, Colorado, Washington</strong>). This will open up the state portal where you can browse and pick your preferred city (e.g. <em>Sedona, Scottsdale, Palm Springs, Maui Wailea</em>) and view verified hotel partners.
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>&#128181;</div>
              <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.75', margin: '0 auto', maxWidth: '460px' }}>
                Complete price transparency with zero hidden fees. Before paying, you get a full itemized breakdown showing exact costs for <strong>Luxury Hotel Lodging</strong>, <strong>Private Chauffeur Transportation</strong>, <strong>Holistic Cannabis Wellness</strong>, and <strong>Dedicated Concierge Care</strong>.
              </p>
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>&#128197;</div>
              <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.75', margin: '0 auto', maxWidth: '460px' }}>
                Select your dates on the interactive calendar, choose your accommodation tier, customize your cannabis program, and fund via Credit Card or Escrow. You can pay in full or split seamlessly with your group.
              </p>
            </div>
          )}

          {currentStep === 5 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>&#128222;</div>
              <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.75', margin: '0 auto', maxWidth: '460px' }}>
                As soon as your reservation is placed, it appears immediately on our <strong>Admin Reservations Portal</strong>. Our concierge administration team uses the establishment’s direct phone number to call the hotel, lock in your room dates, and guarantee your private suite!
              </p>
            </div>
          )}
        </div>

        {/* Step Indicator dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.45rem', margin: '1.5rem 0 1rem' }}>
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              onClick={() => setCurrentStep(step)}
              style={{
                width: step === currentStep ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: step === currentStep ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          {currentStep > 1 && (
            <button
              type="button"
              className="bk-back"
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{ padding: '0.85rem 1.4rem' }}
            >
              &larr; Back
            </button>
          )}
          <button
            type="button"
            className="bk-next"
            onClick={handleNext}
            style={{ flex: 1, padding: '0.85rem' }}
          >
            {currentStep < totalSteps ? 'Next Step \u2192' : 'Explore Legal Destinations Now \u2192'}
          </button>
        </div>
      </div>
    </div>
  );
};
