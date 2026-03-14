import React from 'react';

export default function VisualizerControls({
    onNext,
    onReset,
    status
}) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 p-4 bg-[var(--viz-bg-inactive)]/30 rounded-2xl border border-white/5">
            {/* Playback Controls */}
            <div className="flex gap-4">
                <button 
                    onClick={onNext} 
                    disabled={status === 'Over' || status === 'Found'}
                    className="btn-primary px-8 shadow-brand-600/20"
                >
                    {status === 'Wait' ? 'Start' : 'Next Step'}
                </button>
                
                <button 
                    onClick={onReset} 
                    className="btn-secondary px-8"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
