import { LayoutDashboard, PlusCircle, PieChart, Settings } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={clsx(
            "flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl",
            active
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "text-muted hover:bg-white hover:text-text hover:shadow-sm"
        )}
    >
        <Icon size={20} />
        <span>{label}</span>
    </button>
);

export const Layout = ({ children, activeTab, setActiveTab }) => {
    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#f8f9fc] border-r border-gray-100 p-6 flex flex-col gap-8 hidden md:flex">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                        E
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">EvFatura</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Genel Bakış"
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    />
                    <SidebarItem
                        icon={PlusCircle}
                        label="Harcama Ekle"
                        active={activeTab === 'add'}
                        onClick={() => setActiveTab('add')}
                    />
                    <SidebarItem
                        icon={PieChart}
                        label="Raporlar"
                        active={activeTab === 'reports'}
                        onClick={() => setActiveTab('reports')}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Bütçe Ayarları"
                        active={activeTab === 'budget'}
                        onClick={() => setActiveTab('budget')}
                    />
                </nav>

                <div className="mt-auto">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="font-semibold mb-1">Premium Plan</h4>
                            <p className="text-xs text-gray-400 mb-3">Tüm özellikler açık</p>
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
