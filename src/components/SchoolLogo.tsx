import React, { useState } from 'react';
import { School, Award } from 'lucide-react';

interface SchoolLogoProps {
  url?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({ url, size = 'md', className = '' }) => {
  const [imgError, setImgError] = useState(false);

  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  }[size];

  // If user provided a link or error occurred, we display the school emblem
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${dimensions} ${className}`}>
      {!imgError && url ? (
        <img
          src={url}
          alt="Logo SMP Negeri 1 Wanaraya"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-md filter drop-shadow-sm"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-blue-900 flex items-center justify-center text-white border border-amber-300">
            <School className="w-3/5 h-3/5 text-amber-300" />
          </div>
        </div>
      )}
    </div>
  );
};
