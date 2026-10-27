import React from 'react';
import ProblemComparisonSlider from '../components/ProblemComparisonSlider';
import HowItWorksAndUseCases from '../components/HowItWorksAndUseCases';
import AboutAndFAQ from '../components/AboutAndFAQ';

export default function AboutPage() {
  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* 1. Problem Statement Comparison */}
      <ProblemComparisonSlider />

      {/* 2. Innovation Concept & Use Cases */}
      <HowItWorksAndUseCases />

      {/* 3. Team Story, Vision & FAQ */}
      <AboutAndFAQ />
    </div>
  );
}
