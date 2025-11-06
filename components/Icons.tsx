import React from 'react';

export const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.093-.828l2.952-7.872c.12-.317.009-.68-.254-.912l-14.894-11.85a1.125 1.125 0 0 0-1.21.002L1.353 3.513a.75.75 0 0 0-.106.912l3.22 8.587c.12.318.406.52.748.52h9.273" />
  </svg>
);

export const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/>
    </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/>
    </svg>
);

export const BurgerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-5.035-4.01-9.06-8.995-9.06S1.5 6.965 1.5 12c0 2.923 1.423 5.51 3.61 7.159.226.17.39.39.5.642l1.37 3.83c.123.342.444.57.802.57h6.432c.358 0 .679-.228.802-.57l1.37-3.83c.11-.252.274-.472.5-.642C18.077 17.51 19.5 14.923 19.5 12zM4.5 12a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01M16.5 12h.01M7.5 12h.01" />
    </svg>
);
export const HotdogIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .34.232.622.548.682A44.881 44.881 0 0 1 16.5 4.5c.378 0 .723.081 1.05.232.327.152.707.036.883-.263l.184-.31c.175-.296.036-.682-.262-.882A44.88 44.88 0 0 0 16.5 3c-1.152 0-2.26.11-3.324.318-.328.068-.548.342-.548.682zM7.5 15.75c0 .34.232.622.548.682A44.881 44.881 0 0 0 10.5 16.5c.378 0 .723.081 1.05.232.327.152.707.036.883-.263l.184-.31c.175-.296.036-.682-.262-.882a44.88 44.88 0 0 1-1.852-.518c-1.152 0-2.26.11-3.324.318-.328.068-.548.342-.548.682z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5c0 1.103-2.015 2.004-4.5 2.229-2.485.225-4.5.9-4.5 1.516 0 .617 2.015 1.29 4.5 1.516 2.485.225 4.5.913 4.5 2.015M4.5 6c0 1.103 2.015 2.004 4.5 2.229 2.485.225 4.5.9 4.5 1.516 0 .617-2.015 1.29-4.5 1.516C6.515 11.49 4.5 12.177 4.5 13.275" />
    </svg>
);
export const NachosIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75l16.5 16.5M20.25 3.75L3.75 20.25" />
    </svg>
);
export const DrinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 6.75 12 3m0 0L8.25 6.75M12 3v-1.5m3 16.5-7.5-7.5M15 19.5h-6" />
    </svg>
);
export const MugIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5h10.5m-10.5 3h10.5m-10.5 3h10.5M5.25 4.5h13.5c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H5.25c-.621 0-1.125-.504-1.125-1.125V5.625c0-.621.504-1.125 1.125-1.125z" />
    </svg>
);
export const SandwichIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12.75V12A9.75 9.75 0 0 0 12 2.25 9.75 9.75 0 0 0 2.25 12v.75m19.5 0a9.75 9.75 0 0 1-19.5 0m19.5 0v.25c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125v-.25" />
    </svg>
);
export const BowlIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 2.25-3.75 3.75M15.75 10.5l-3.75-3.75M15.75 2.25 12 6M15.75 10.5 12 14.25m3.75-12c.52.26.98.563 1.404.903a.75.75 0 0 1-.36 1.32c-1.353-.615-2.88-1.04-4.512-1.155a.75.75 0 0 1-.693-.693C11.542 3.93 11.967 2.404 12.582 1.08c.135-.29.433-.45.75-.45h2.418Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12 9.75v4.5m4.5-4.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm4.5-4.5v4.5m-9-4.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM7.5 5.25v4.5" />
    </svg>
);
export const FriesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
);
export const DessertIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 12-7.5 7.5-7.5-7.5m15 0-7.5-7.5-7.5 7.5" />
    </svg>
);

export const LocationPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

export const ChevronDoubleLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
    </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 0 1 0 1.905c-.008.379.137.752.43.992l1.004.827a1.125 1.125 0 0 1 .26 1.431l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 0 1 0-1.905c.008-.379-.137-.752-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.431l1.296-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.213-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const PrintIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.044A1.875 1.875 0 0 0 21 16.125V6.875A1.875 1.875 0 0 0 19.125 5H4.875A1.875 1.875 0 0 0 3 6.875v9.25A1.875 1.875 0 0 0 4.875 18h1.044m11.318 0c-.248-.097-.5-.194-.752-.292M6.34 18c-.248-.097-.5-.194-.752-.292m12.072 0c.25.098.504.195.752.292M7.092 18h9.816" />
    </svg>
);

export const ClipboardListIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
    </svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

export const MotorcycleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.5c0 1.933-2.015 3.5-4.5 3.5s-4.5-1.567-4.5-3.5 2.015-3.5 4.5-3.5 4.5 1.567 4.5 3.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75c0 1.5-1.119 2.75-2.5 2.75s-2.5-1.25-2.5-2.75S8.119 16 9.5 16s2.5 1.25 2.5 2.75Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0 1.933-2.015 3.5-4.5 3.5s-4.5-1.567-4.5-3.5 2.015-3.5 4.5-3.5 4.5 1.567 4.5 3.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 11.75 12 15m0 0L8.25 11.75M12 15V3.75m0 0L8.25 7.5M12 3.75 15.75 7.5" />
    </svg>
);

export const MessengerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.615 4.456 8.641.11.077.222.154.333.231.256.18.522.359.79.513.333.205.675.385 1.026.538.128.051.256.103.385.154.41.18.82.333 1.256.462.128.025.256.051.385.077.487.128 1 .231 1.513.308.051 0 .103.025.154.025.513.077 1.026.128 1.539.154h.025c.487.025.974.025 1.462 0h.025c.513-.025 1.026-.077 1.539-.154.051 0 .103-.025.154-.025.513-.077 1.026-.18 1.513-.308.128-.025.256-.051.385-.077.436-.128.846-.282 1.256-.462.128-.051.256-.103.385-.154.359-.154.701-.333 1.026-.538.282-.154.538-.333.79-.513.111-.077.222-.154.333-.231C22.256 17.726 24 14.61 24 11.111 24 4.974 18.627 0 12 0zm1.141 14.026L8.205 9.077l6.308-4.051-4.936 6.41zm-2.282 0l4.936-6.41-6.308 4.051 1.372 2.359z"/>
    </svg>
);
