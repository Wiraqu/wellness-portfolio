'use client';

import { useEffect, useState } from 'react';
import { Users, Calendar, DollarSign, TrendingUp, Clock, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { DashboardMetrics, Appointment } from '@/types';

const revenueData = [
  { month: 'Jan', revenue: 2400, clients: 12 },
  { month: 'Feb', revenue: 3200, clients: 15 },
  { month: 'Mar', revenue: 4100, clients: 18 },
  { month: 'Apr', revenue: 3800, clients: 20 },
  { month: 'May', revenue: 5200, clients: 24 },
  { month: 'Jun', revenue: 6100, clients: 28 },
];

const mockAppointments: Appointment[] = [
  { id: '1', practitionerId: '1', clientId: 'c1', clientName: 'Emma Wilson', date: '2024-01-15', time: '09:00', duration: 60, type: 'initial', status: 'scheduled' },
  { id: '2', practitionerId: '1', clientId: 'c2', clientName: 'James Miller', date: '2024-01-15', time: '11:00', duration: 45, type: 'followup', status: 'scheduled' },
  { id: '3', practitionerId: '1', clientId: 'c3', clientName: 'Sophia Lee', date: '2024-01-15', time: '14:00', duration: 60, type: 'telehealth', status: 'scheduled' },
  { id: '4', practitionerId: '1', clientId: 'c4', clientName: 'Michael Brown', date: '2024-01-15', time: '16:00', duration: 30, type: 'followup', status: 'completed' },
];

const metrics: DashboardMetrics = {
  totalClients: 128,
  activeClients: 96,
  monthlyRevenue: 6100,
  upcomingAppointments: 8,
  completionRate: 94,
  clientRetention: 87,
};

const statCards = [
  { label: 'Total Clients', value: metrics.totalClients, change: '+12%', up: true, icon: Users, color: 'bg-blue-50 text-blue-600' },
  { label: 'Monthly Revenue', value: `$${metrics.monthlyRevenue.toLocaleString()}`, change: '+18%', up: true, icon: DollarSign, color: 'bg-green-50 text-green-600' },
  { label: 'Upcoming Appts', value: metrics.upcomingAppointments, change: '+3', up: true, icon: Calendar, color: 'bg-purple-50 text-purple-600' },
  { label: 'Completion Rate', value: `${metrics.completionRate}%`, change: '+2%', up: true, icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
];

export default function DashboardOverview() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-500">Welcome back, here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500">{stat.label}</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{stat.change} this month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Revenue Overview</h3>
          {mounted && (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => [`$${v}`, 'Revenue']} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Client Growth</h3>
          {mounted && (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="clients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Today&apos;s Appointments</h3>
          <button className="text-primary-600 text-sm font-medium hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-100">
                <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Client</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Time</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Type</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Duration</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAppointments.map((apt) => (
                <tr key={apt.id} className="border-b border-secondary-50 hover:bg-secondary-50/50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-xs">{apt.clientName.charAt(0)}</div>
                      <span className="font-medium text-secondary-900">{apt.clientName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-secondary-600">
                    <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {apt.time}</div>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      apt.type === 'telehealth' ? 'bg-blue-50 text-blue-700' :
                      apt.type === 'initial' ? 'bg-purple-50 text-purple-700' :
                      'bg-secondary-100 text-secondary-700'
                    }`}>
                      <Activity className="w-3 h-3" /> {apt.type}
                    </span>
                  </td>
                  <td className="py-3 text-secondary-600">{apt.duration} min</td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'scheduled' ? 'bg-yellow-50 text-yellow-700' :
                      apt.status === 'completed' ? 'bg-green-50 text-green-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
