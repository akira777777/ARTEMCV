import React from 'react';

export const Footer: React.FC = React.memo(() => {
  return (
    <footer id="footer" className="py-20 bg-gradient-to-b from-black to-neutral-950 border-t border-indigo-500/20 pb-40 relative overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-indigo-500/20 blur-3xl float-slower" aria-hidden />
      <div className="absolute top-1/3 left-0 w-[30rem] h-[30rem] rounded-full bg-purple-500/15 blur-3xl float-slow" aria-hidden />
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-[10vw] md:text-[8vw] font-display font-black tracking-tighter leading-none mb-8 bg-gradient-to-br from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent hover:from-indigo-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-500 cursor-pointer">
          LET'S BUILD
        </h2>
        <p className="text-lg md:text-xl text-neutral-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Ready to bring your project to life? Let's create something exceptional together.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-sm tracking-widest font-bold mb-6">
          <a href="mailto:fear75412@gmail.com" className="relative text-neutral-300 hover:text-indigo-400 transition-all duration-300 after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-indigo-400 after:to-purple-400 after:transition-all after:duration-300 hover:after:w-full">FEAR75412@GMAIL.COM</a>
          <a href="https://t.me/younghustle45" target="_blank" rel="noopener noreferrer" className="relative text-neutral-300 hover:text-indigo-400 transition-all duration-300 after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-indigo-400 after:to-purple-400 after:transition-all after:duration-300 hover:after:w-full">TELEGRAM</a>
          <a href="https://github.com/akira777777" target="_blank" rel="noopener noreferrer" className="relative text-neutral-300 hover:text-indigo-400 transition-all duration-300 after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-indigo-400 after:to-purple-400 after:transition-all after:duration-300 hover:after:w-full">GITHUB</a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="relative text-neutral-300 hover:text-indigo-400 transition-all duration-300 after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-indigo-400 after:to-purple-400 after:transition-all after:duration-300 hover:after:w-full">LINKEDIN</a>
        </div>
        <div className="flex justify-center gap-4 mb-12">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent"></div>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
        </div>
        <p className="mt-8 text-neutral-500 text-xs tracking-wider">
          © {new Date().getFullYear()} ARTEM DEVELOPER. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
});
