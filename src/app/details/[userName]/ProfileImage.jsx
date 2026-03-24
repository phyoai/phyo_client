import React, { useState } from 'react';
import Image from 'next/image';

// Custom Image Component using Next.js Image (same as Hero component)
const ProfileImage = ({ src, alt, name, className }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to process image URL through proxy
  const getCorsProxyUrl = (url) => {
    if (!url) return '';
    
    // Check if URL might be expired (has oe parameter with old timestamp)
    try {
      const urlObj = new URL(url);
      const oeParam = urlObj.searchParams.get('oe');
      if (oeParam) {
        // oe parameter is a hex timestamp, convert to check if expired
        const timestamp = parseInt(oeParam, 16) * 1000; // Convert to milliseconds
        const now = Date.now();
        if (timestamp < now) {
          console.log('⚠️ URL signature expired, showing fallback');
          return ''; // Return empty to trigger fallback
        }
      }
    } catch (e) {
      // If URL parsing fails, continue with proxy
    }
    
    // Google Translate proxy method
    let p = url?.split("/") || [""];
    let t = '';
    for (let i = 0; i < p.length; i++) {
      if (i == 2) {
        t += p[i].replaceAll('-', '--').replaceAll('.', '-') + atob('LnRyYW5zbGF0ZS5nb29n') + '/';
      } else {
        if (i != p.length - 1) {
          t += p[i] + '/';
        } else {
          t += p[i];
        }
      }
    }
    return encodeURI(t);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = getCorsProxyUrl(src);

  // Fallback to initials if image fails, no src, or URL is expired
  if (imageError || !src || !imageUrl) {
    return (
      <div className={`${className} bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-200`}>
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className="relative">
      <Image
        src={imageUrl}
        alt={alt}
        width={80}
        height={80}
        className={`${className} border-2 border-gray-200 object-cover`}
        onError={handleImageError}
        unoptimized={true} // Required for external images with proxy
        priority={false}
      />
    </div>
  );
};

export default ProfileImage; 