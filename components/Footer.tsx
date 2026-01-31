import React from 'react';

export const Footer: React.FC = React.memo(() => {
  return (
    <footer id="footer" className="py-20 bg-black border-t border-white/10 pb-40 relative overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-indigo-500/10 blur-3xl float-slower" aria-hidden="true" />
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-[10vw] md:text-[8vw] font-display font-black tracking-tighter leading-none mb-8 bg-gradient-to-br from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent hover:from-indigo-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-500 cursor-pointer">
          LET'S BUILD
        </h2>
        <p className="text-lg md:text-xl text-neutral-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Ready to bring your project to life? Let's create something exceptional together.
        </p>
        <nav aria-label="Social media links">
          <ul className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-sm tracking-widest font-bold">
            <li>
              <a href="mailto:fear75412@gmail.com" aria-label="Send email to fear75412@gmail.com" className="relative hover:text-neutral-400 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">FEAR75412@GMAIL.COM</a>
            </li>
            <li>
              <a href="https://t.me/younghustle45" target="_blank" rel="noopener noreferrer" aria-label="Contact via Telegram (opens in new tab)" className="relative hover:text-neutral-400 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">TELEGRAM</a>
            </li>
            <li>
              <a href="https://github.com/akira777777" target="_blank" rel="noopener noreferrer" aria-label="Visit GitHub profile (opens in new tab)" className="relative hover:text-neutral-400 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">GITHUB</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn profile (opens in new tab)" className="relative hover:text-neutral-400 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">LINKEDIN</a>
            </li>
          </ul>
        </nav>
        <p className="mt-20 text-neutral-600 text-xs">
          © {new Date().getFullYear()} ARTEM DEVELOPER. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
});
