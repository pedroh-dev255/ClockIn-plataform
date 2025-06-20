// src/components/Loader.tsx

import React from 'react';
import type { CSSProperties } from 'react';

const loaderStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    } as CSSProperties,
    spinner: {
        width: '80px',
        height: '80px',
        border: '10px solid #f3f3f3',
        borderTop: '10px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    } as CSSProperties,
};

export default function Loader() {
    return (
        <>
            <div style={loaderStyles.overlay}>
                <div style={loaderStyles.spinner}></div>
            </div>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </>
    );
}
