// IconPlaceholder.js
import React from 'react';

const IconPlaceholder = ({ className = "w-12 h-12 mb-4 text-purple-400" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> // Example Icon
);

export default IconPlaceholder;