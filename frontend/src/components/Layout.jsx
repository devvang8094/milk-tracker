import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Phone, Mail, Instagram } from 'lucide-react';


export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar (Desktop & Mobile) */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
                    <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>


                {/* Admin Footer - Enhanced */}
                <footer className="py-4 border-t border-slate-200 bg-slate-50 mt-auto">
                    <div className="max-w-5xl mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

                            {/* Left: Made By */}
                            <div className="text-slate-500 text-xs font-medium">
                                Made by <span className="text-slate-700 font-bold">Deepak Patidar</span>
                            </div>

                            {/* Right: Contact Links */}
                            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                                <a href="https://wa.me/917878423710" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-500 hover:text-green-600 transition-colors">
                                    <Phone size={14} className="stroke-[2.5]" />
                                    <span>7878423710</span>
                                </a>
                                <a href="mailto:devang8094@gmail.com" className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors">
                                    <Mail size={14} className="stroke-[2.5]" />
                                    <span>devang8094@gmail.com</span>
                                </a>
                                <a href="https://www.instagram.com/devang_8094?igsh=MTB2azIxa3Q1NmVrOQ==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-500 hover:text-pink-600 transition-colors">
                                    <Instagram size={14} className="stroke-[2.5]" />
                                    <span>Instagram</span>
                                </a>
                            </div>

                        </div>

                        {/* Bottom Rights */}
                        <div className="mt-3 pt-3 border-t border-slate-200/60 text-center text-[10px] text-slate-400">
                            All rights reserved to <span className="font-semibold text-slate-500">devang@gmail.com</span>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
