import React from 'react';

const SpinningCube: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-black relative" style={{ minHeight: '320px' }}>
          <div
            className="w-full h-full relative"
            style={{
              backgroundColor: '#000000',
              perspective: '1000px'
            }}
          >
            <div
              className="absolute top-6 left-6 z-10 text-white"
              style={{
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                letterSpacing: '0.02em'
              }}
            >
              Cube 00112
            </div>

            <div className="w-full h-full flex items-center justify-center">
              <div
                className="cube"
                style={{
                  width: '200px',
                  height: '200px',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  animation: 'spin 8s infinite linear'
                }}
              >
                <div
                  className="cube-face front"
                  style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: 'linear-gradient(45deg, #ff0080, #00ff80, #8000ff, #ff8000)',
                    backgroundSize: '400% 400%',
                    animation: 'waveColors 4s ease-in-out infinite',
                    transform: 'rotateY(0deg) translateZ(100px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                />

                <div
                  className="cube-face back"
                  style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: 'linear-gradient(45deg, #00ff80, #8000ff, #ff8000, #ff0080)',
                    backgroundSize: '400% 400%',
                    animation: 'waveColors 4s ease-in-out infinite 1s',
                    transform: 'rotateY(180deg) translateZ(100px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                />

                <div
                  className="cube-face right"
                  style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: 'linear-gradient(45deg, #8000ff, #ff8000, #ff0080, #00ff80)',
                    backgroundSize: '400% 400%',
                    animation: 'waveColors 4s ease-in-out infinite 2s',
                    transform: 'rotateY(90deg) translateZ(100px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                />

                <div
                  className="cube-face left"
                  style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: 'linear-gradient(45deg, #ff8000, #ff0080, #00ff80, #8000ff)',
                    backgroundSize: '400% 400%',
                    animation: 'waveColors 4s ease-in-out infinite 3s',
                    transform: 'rotateY(-90deg) translateZ(100px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                />

                <div
                  className="cube-face top"
                  style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: 'linear-gradient(45deg, #ff0080, #8000ff, #00ff80, #ff8000)',
                    backgroundSize: '400% 400%',
                    animation: 'waveColors 4s ease-in-out infinite 0.5s',
                    transform: 'rotateX(90deg) translateZ(100px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                />

                <div
                  className="cube-face bottom"
                  style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: 'linear-gradient(45deg, #00ff80, #ff0080, #ff8000, #8000ff)',
                    backgroundSize: '400% 400%',
                    animation: 'waveColors 4s ease-in-out infinite 2.5s',
                    transform: 'rotateX(-90deg) translateZ(100px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
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
      </div>
    </section>
  );
};

export default SpinningCube;
