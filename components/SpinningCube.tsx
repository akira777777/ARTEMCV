import React from 'react';

const SpinningCube: React.FC = () => {
  return (
    <section className="py-10">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 flex justify-center">
        <div
          className="relative"
          style={{
            minHeight: '220px',
            width: '220px',
            perspective: '1100px'
          }}
        >
          {/* скрытая подпись сбоку */}
          <div
            className="absolute -left-64 top-4 text-white/60 select-none"
            aria-hidden
            style={{
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.06em'
            }}
          >
            Cube 00112
          </div>

          <div className="w-full h-full flex items-center justify-center">
            <div
              className="cube"
              style={{
                width: '180px',
                height: '180px',
                position: 'relative',
                transformStyle: 'preserve-3d',
                animation: 'spin 10s infinite linear'
              }}
            >
                <div
                  className="cube-face front"
                  style={{
                    position: 'absolute',
                    width: '180px',
                    height: '180px',
                    background: 'linear-gradient(45deg, #7af2a1, #6bd8ff, #c58bff, #ffd38d)',
                    backgroundSize: '400% 400%',
                    animation: 'waveColors 4s ease-in-out infinite',
                    transform: 'rotateY(0deg) translateZ(90px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)'
                  }}
                />

                <div
                  className="cube-face back"
                  style={{
                    position: 'absolute',
                    width: '180px',
                    height: '180px',
                    background: 'linear-gradient(45deg, #6bd8ff, #ffd38d, #7af2a1, #c58bff)',
                    backgroundSize: '400% 400%',
                    animation: 'waveColors 4s ease-in-out infinite 1s',
                    transform: 'rotateY(180deg) translateZ(90px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)'
                  }}
                />

                <div
                  className="cube-face right"
                  style={{
                    position: 'absolute',
                    width: '180px',
                    height: '180px',
                    background: 'linear-gradient(45deg, #c58bff, #7af2a1, #6bd8ff, #ffd38d)',
                    backgroundSize: '400% 400%',
                    animation: 'waveColors 4s ease-in-out infinite 2s',
                    transform: 'rotateY(90deg) translateZ(90px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)'
                  }}
                />

                <div
                  className="cube-face left"
                  style={{
                    position: 'absolute',
                    width: '180px',
                    height: '180px',
                    background: 'linear-gradient(45deg, #ffd38d, #c58bff, #7af2a1, #6bd8ff)',
                    backgroundSize: '400% 400%',
                    animation: 'waveColors 4s ease-in-out infinite 3s',
                    transform: 'rotateY(-90deg) translateZ(90px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)'
                  }}
                />

                <div
                  className="cube-face top"
                  style={{
                    position: 'absolute',
                    width: '180px',
                    height: '180px',
                    background: 'linear-gradient(45deg, #6bd8ff, #7af2a1, #ffd38d, #c58bff)',
                    backgroundSize: '400% 400%',
                    animation: 'waveColors 4s ease-in-out infinite 0.5s',
                    transform: 'rotateX(90deg) translateZ(90px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)'
                  }}
                />

                <div
                  className="cube-face bottom"
                  style={{
                    position: 'absolute',
                    width: '180px',
                    height: '180px',
                    background: 'linear-gradient(45deg, #ffd38d, #6bd8ff, #c58bff, #7af2a1)',
                    backgroundSize: '400% 400%',
                    animation: 'waveColors 4s ease-in-out infinite 2.5s',
                    transform: 'rotateX(-90deg) translateZ(90px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)'
                  }}
                />
              </div>
            </div>

            <style>{`
        @keyframes spin {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          25% { transform: rotateX(90deg) rotateY(90deg); }
          50% { transform: rotateX(180deg) rotateY(180deg); }
          75% { transform: rotateX(270deg) rotateY(270deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        
        @keyframes waveColors {
          0% { 
            background-position: 0% 50%;
            filter: hue-rotate(0deg) brightness(1.2);
          }
          25% { 
            background-position: 100% 50%;
            filter: hue-rotate(90deg) brightness(1.5);
          }
          50% { 
            background-position: 100% 100%;
            filter: hue-rotate(180deg) brightness(1.8);
          }
          75% { 
            background-position: 0% 100%;
            filter: hue-rotate(270deg) brightness(1.5);
          }
          100% { 
            background-position: 0% 50%;
            filter: hue-rotate(360deg) brightness(1.2);
          }
        }
        
        .cube-face {
          opacity: 0.9;
          box-shadow: 
            inset 0 0 50px rgba(255, 255, 255, 0.1),
            0 0 30px rgba(255, 255, 255, 0.2);
        }
        
        .cube-face::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
        </div>
      </div>
    </section>
  );
};

export default SpinningCube;
