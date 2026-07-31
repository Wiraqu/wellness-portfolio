'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Calendar, Users, CreditCard, BarChart3, Settings, LogOut, Zap, ChevronRight, Bell, Search } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/login'); return; }
    if (userData) setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      <aside className={`bg-white border-r border-secondary-100 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center px-4 border-b border-secondary-100">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && <span className="ml-3 font-bold text-secondary-800">WellnessFlow</span>}
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-700' : 'text-secondary-600 hover:bg-secondary-50'}`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
                {isActive && sidebarOpen && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-3 border-t border-secondary-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-secondary-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-secondary-100 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-secondary-50 rounded-lg">
            <ChevronRight className={`w-5 h-5 text-secondary-500 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input type="text" placeholder="Search clients, appointments..." className="pl-10 pr-4 py-2 rounded-lg border border-secondary-200 text-sm w-64 focus:outline-none focus:border-primary-500" />
            </div>
            <button className="relative p-2 hover:bg-secondary-50 rounded-lg">
              <Bell className="w-5 h-5 text-secondary-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm">{user?.name?.charAt(0)}</div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-secondary-900">{user?.name}</p>
                <p className="text-xs text-secondary-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
