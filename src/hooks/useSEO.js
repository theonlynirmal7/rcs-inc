import { useEffect } from 'react';

export default function useSEO(title, description) {
  useEffect(() => {
    // Set Document Title
    const baseTitle = 'RCS - Rameswar Cool Spares';
    document.title = title ? `${title} | ${baseTitle}` : `${baseTitle} | Automotive AC Parts`;

    // Set Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    
    metaDescription.setAttribute(
      'content',
      description || 'RCS is your trusted distributor of premium vehicle AC spare parts for cars, trucks, SUVs, and buses in India.'
    );
  }, [title, description]);
}
