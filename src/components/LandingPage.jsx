import React from 'react';
import { Camera, Sparkles, Printer, ArrowRight, FileText, Phone, Mail, Github, User } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-background overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-10 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Text Content (Left) */}
            <div className="col-span-6 flex flex-col justify-center text-center lg:text-left mb-16 lg:mb-0">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-1.5 mb-6 mx-auto lg:mx-0 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-sm font-medium text-amber-700">Resume Builder & AI Tools Coming Soon</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                Simplify Your <br className="hidden lg:block"/>
                <span className="text-primary">Printing Operations.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Stop manually dragging images in MS Office. Automate your 2x2 and 1x1 layouts, remove backgrounds, and prepare documents for print in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-primary hover:bg-indigo-700 text-white h-12 px-8 rounded-full font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
                  Start Layout Engine
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </button>
                <button className="bg-surface text-slate-700 border border-slate-200 hover:border-primary/50 hover:bg-indigo-50/50 h-12 px-8 rounded-full font-semibold transition-all">
                  Contact Developer
                </button>
              </div>
            </div>

            {/* Visual Mockup (Right) */}
            <div className="col-span-6 relative">
              {/* Decorative blob behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-100/40 to-purple-100/40 rounded-full blur-3xl -z-10"></div>
              
              {/* The "Paper" Mockup */}
              <div className="bg-paper rounded-xl shadow-2xl border border-slate-100 p-6 relative transform lg:rotate-3 hover:rotate-0 transition-all duration-500 max-w-md mx-auto">
                {/* Header mockup */}
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                   <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                      <div className="h-3 w-3 rounded-full bg-success"></div>
                   </div>
                   <span className="text-xs font-mono text-slate-400">A4 Layout Preview</span>
                </div>
                
                {/* Grid mockup representing the output */}
                <div className="space-y-6 opacity-90">
                   {/* 2x2 rows */}
                   <div className="grid grid-cols-4 gap-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="aspect-square rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                           {i === 1 && <div className="w-full h-full bg-indigo-200 rounded-md animate-pulse"></div>}
                        </div>
                      ))}
                   </div>
                   {/* 1x1 rows */}
                   <div className="grid grid-cols-5 gap-3">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="aspect-square rounded-sm bg-slate-50 border border-slate-100"></div>
                      ))}
                   </div>
                </div>
                
                {/* Floating Badge */}
                 <div className="absolute -bottom-5 -right-5 bg-surface border border-slate-100 shadow-lg p-3 rounded-xl flex items-center gap-3 animate-bounce-slow">
                    <div className="bg-success/10 p-2 rounded-full text-success">
                       <Printer size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">Print Ready</p>
                       <p className="text-xs text-slate-500">No MS Word Needed</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-surface border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Built for Printing Shops.</h2>
            <p className="text-slate-600 text-lg">
              Maximize your shop's efficiency. Replace manual editing with automated tools designed for high-volume printing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {/* Feature 1: Layout Engine (Live) */}
            <div className="flex flex-col items-center text-center relative">
              <div className="bg-indigo-50 h-16 w-16 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                <Printer size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Auto-Layout Engine</h3>
              <p className="text-slate-600 leading-relaxed">
                Automatically arrange 2x2 and 1x1 photos on an A4 canvas. No more resizing images in Word or PowerPoint.
              </p>
            </div>
            
            {/* Feature 2: AI Features (Coming Soon) */}
            <div className="flex flex-col items-center text-center relative opacity-75">
              <div className="absolute -top-3 right-10 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full border border-amber-200">
                COMING SOON
              </div>
              <div className="bg-slate-50 h-16 w-16 rounded-2xl flex items-center justify-center text-slate-400 mb-6 shadow-sm border border-slate-100">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">AI Background Tools</h3>
              <p className="text-slate-500 leading-relaxed">
                Advanced background removal and automatic formal attire generation to speed up your editing workflow.
              </p>
            </div>

             {/* Feature 3: Resume Builder (Coming Soon) */}
             <div className="flex flex-col items-center text-center relative opacity-75">
              <div className="absolute -top-3 right-10 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full border border-amber-200">
                COMING SOON
              </div>
              <div className="bg-slate-50 h-16 w-16 rounded-2xl flex items-center justify-center text-slate-400 mb-6 shadow-sm border border-slate-100">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">Resume Builder</h3>
              <p className="text-slate-500 leading-relaxed">
                Offer value-added services to your customers by generating professional CVs and layouts instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- DEVELOPER / CONTACT FOOTER --- */}
      <footer className="py-16 bg-slate-50 border-t border-slate-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Brand Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                    <Camera size={20} />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">PortraCV</span>
                </div>
                <p className="text-slate-600 mb-6 max-w-sm">
                  The ultimate SaaS solution for printing shops to modernize operations and increase productivity.
                </p>
                <div className="flex gap-4">
                  <a href="https://github.com/Necookie" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
                    <Github size={24} />
                  </a>
                </div>
              </div>

              {/* Developer Contact Card */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Developer Contact</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User size={20} className="text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">Dheyn Michael Orlanda</p>
                      <p className="text-sm text-slate-500">Lead Developer (Necookie.dev)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-primary" />
                    <a href="mailto:Dheyn.main@gmail.com" className="text-slate-600 hover:text-primary transition-colors">
                      Dheyn.main@gmail.com
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-primary" />
                    <span className="text-slate-600">+63 995 492 2742</span>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
               © {new Date().getFullYear()} Necookie.dev. All rights reserved.
            </div>
         </div>
      </footer>

    </div>
  );
}