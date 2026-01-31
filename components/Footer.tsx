import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="py-20 bg-black border-t border-white/10 pb-40 relative overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-indigo-500/10 blur-3xl float-slower" aria-hidden />
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-[10vw] font-display font-black tracking-tighter leading-none mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer bg-[length:200%_200%] motion-safe:animate-[subtlePan_12s_ease-in-out_infinite]">
          LET'S TALK
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-sm tracking-widest font-bold">
          <a href="mailto:hello@infinite.studio" className="relative hover:text-neutral-400 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">HELLO@INFINITE.STUDIO</a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="relative hover:text-neutral-400 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">INSTAGRAM</a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="relative hover:text-neutral-400 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">TWITTER</a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="relative hover:text-neutral-400 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">LINKEDIN</a>
        </div>
        <p className="mt-20 text-neutral-600 text-xs">
          © {new Date().getFullYear()} INFINITE STUDIO. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};
