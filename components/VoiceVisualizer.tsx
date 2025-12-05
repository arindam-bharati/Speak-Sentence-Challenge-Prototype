import React from 'react';

export const VoiceVisualizer: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-1 h-12">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="waveform-bar bg-blue-500 rounded-full w-2"
          style={{
            animationDuration: `${0.4 + Math.random() * 0.5}s`,
            height: '20%'
          }}
        ></div>
      ))}
    </div>
  );
};
