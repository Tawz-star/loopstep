import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShoeScanningExperience from '../components/ShoeScanningExperience';

export default function ScanPage() {
  const navigate = useNavigate();

  const handleProceedToSoleStudio = (specs) => {
    // Navigate to /sole-studio with compatible specs
    navigate('/sole-studio', { state: { scannedSpecs: specs } });
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      <ShoeScanningExperience onProceedToCustomizer={handleProceedToSoleStudio} />
    </div>
  );
}
