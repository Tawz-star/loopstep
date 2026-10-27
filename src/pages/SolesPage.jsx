import React from 'react';
import { useNavigate } from 'react-router-dom';
import SoleCollections from '../components/SoleCollections';

export default function SolesPage() {
  const navigate = useNavigate();

  const handleCustomize = (tierId) => {
    navigate('/sole-studio', { state: { scannedSpecs: { category: tierId } } });
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      <SoleCollections onCustomizeSole={handleCustomize} />
    </div>
  );
}
