import React from 'react';

export const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.093-.828l2.952-7.872c.12-.317.009-.68-.254-.912l-14.894-11.85a1.125 1.125 0 0 0-1.21.002L1.353 3.513a.75.75 0 0 0-.106.912l3.22 8.587c.12.318.406.52.748.52h9.273" />
  </svg>
);

export const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.175A8.986 8.986 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
  </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
    </svg>
);

export const BurgerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22 15.001H2v-2h20v2zM2 17.001h20v2H2v-2zM20.5 4a3.5 3.5 0 0 0-3.159 2.001H6.66A3.501 3.501 0 0 0 3.5 4a3.5 3.5 0 0 0 0 7h17a3.5 3.5 0 0 0 0-7z"/>
    </svg>
);

export const HotdogIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.82,20.08C11.96,20.66 10.93,21 9.8,21C7.41,21 5.42,19.23 5.06,17H19V15H4.15C4.05,14.67 4,14.34 4,14A2,2 0 0,1 6,12H19V10H6A2,2 0 0,1 4,8C4,7.66 4.05,7.33 4.15,7H19V5H5.06C5.42,2.77 7.41,1 9.8,1C10.93,1 11.96,1.34 12.82,1.92L14,3L12.82,4.08C11.96,3.34 10.93,3 9.8,3A3,3 0 0,0 7,6A3,3 0 0,0 9.8,9C10.93,9 11.96,8.66 12.82,8.08L14,7L12.82,5.92C13.5,5.44 14.29,5.13 15.14,5.05C16.94,4.86 18.5,6.05 19,7.85V15.15C18.5,16.95 16.94,18.14 15.14,17.95C14.29,17.87 13.5,17.56 12.82,17.08L14,16L12.82,14.92C11.96,15.66 10.93,16 9.8,16A3,3 0 0,0 7,13A3,3 0 0,0 9.8,12C10.93,12 11.96,12.34 12.82,12.92L14,14L12.82,15.08L14,17L12.82,18.08L14,19L12.82,20.08Z" />
    </svg>
);

export const NachosIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22,10.5C22,10.22 21.78,10 21.5,10H2.5C2.22,10 2,10.22 2,10.5V11H22V10.5M21,12H3V17A1,1 0 0,0 4,18H20A1,1 0 0,0 21,17V12M14.75,9L12,4L9.25,9H14.75M19,9L16.25,4H14L16.75,9H19M8,9L5.25,4H3L5.75,9H8Z" />
    </svg>
);

export const DrinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M10,21V19H14V21H10M5,3H19L17,17H7L5,3M7.2,5L8.8,15H15.2L16.8,5H7.2Z" />
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

export const SandwichIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20,15.5C20,16.88 18.88,18 17.5,18H6.5C5.12,18 4,16.88 4,15.5V8.5C4,7.12 5.12,6 6.5,6H17.5C18.88,6 20,7.12 20,8.5V15.5M17.5,4H6.5C4,4 2,6 2,8.5V15.5C2,18 4,20 6.5,20H17.5C20,20 22,18 22,15.5V8.5C22,6 20,4 17.5,4Z" />
    </svg>
);

export const BowlIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12H4A8,8 0 0,0 12,20A8,8 0 0,0 20,12H22Z" />
    </svg>
);

export const MugIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18,6V8H16V6H18M18,4H16A2,2 0 0,0 14,6V8A2,2 0 0,0 16,10H18A2,2 0 0,0 20,8V6A2,2 0 0,0 18,4M4,3H12A2,2 0 0,1 14,5V12A2,2 0 0,1 12,14H4A2,2 0 0,1 2,12V5A2,2 0 0,1 4,3M4,5V12H12V5H4Z" />
    </svg>
);

export const FriesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.83,3.33L17.5,2L12.5,7L14.42,8.92L18.83,3.33M19.17,8.5L20.5,10L19.5,11L18.17,9.5L19.17,8.5M12,10L10,8L3,15L5,17L12,10M20.5,3.5L22,5L21,6L19.5,4.5L20.5,3.5M6.5,12L5,10.5L2,13.5L3.5,15L6.5,12M17.83,10.17L19,9L14,4L12.17,5.83L17.83,10.17M9,13L7.5,11.5L4.5,14.5L6,16L9,13M5.92,19.42L4.5,18L3.08,19.42L4.5,20.83L5.92,19.42M13,15L11,13L8,16L10,18L13,15M21.25,15.25L20.25,14.25L13.25,21.25L14.25,22.25L21.25,15.25Z" />
    </svg>
);

export const DessertIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.22L17.13 8.5L15.42 12.39L12 10.3L8.58 12.39L6.87 8.5L12 2.22M12 0L4.37 8.6L6.33 13.14L12 10L17.67 13.14L19.63 8.6L12 0M20 16C20 17.11 19.1 18 18 18C16.9 18 16 17.11 16 16C16 14.9 16.9 14 18 14C19.1 14 20 14.9 20 16M6 14C4.9 14 4 14.9 4 16C4 17.11 4.9 18 6 18C7.11 18 8 17.11 8 16C8 14.9 7.11 14 6 14M12 12C10.9 12 10 12.9 10 14C10 15.11 10.9 16 12 16C13.11 16 14 15.11 14 14C14 12.9 13.11 12 12 12M3 20H21V22H3V20Z" />
    </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);
