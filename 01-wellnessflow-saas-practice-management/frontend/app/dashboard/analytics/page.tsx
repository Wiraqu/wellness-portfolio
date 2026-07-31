'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const revenueData = [
  { month: 'Jul', revenue: 3200, sessions: 24 },
  { month: 'Aug', revenue: 4100, sessions: 30 },
  { month: 'Sep', revenue: 3800, sessions: 28 },
  { month: 'Oct', revenue: 5200, sessions: 38 },
  { month: 'Nov', revenue: 6100, sessions: 42 },
  { month: 'Dec', revenue: 5800, sessions: 40 },
];

const clientSources = [
  { name: 'Referral', value: 45, color: '#22c55e' },
  { name: 'Social Media', value: 25, color: '#3b82f6' },
  { name: 'Google', value: 20, color: '#f59e0b' },
  { name: 'Direct', value: 10, color: '#8b5cf6' },
];

const retentionData = [
  { month: 'Jul', retained: 85, churned: 15 },
  { month: 'Aug', retained: 87, churned: 13 },
  { month: 'Sep', retained: 84, churned: 16 },
  { month: 'Oct', retained: 89, churned: 11 },
  { month: 'Nov', retained: 91, churned: 9 },
  { month: 'Dec', retained: 93, churned: 7 },
];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Analytics</h1>
        <p className="text-secondary-500">Deep insights into your practice performance</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (YTD)', value: '$28,200', change: '+24%', up: true, icon: DollarSign },
          { label: 'Active Clients', value: '96', change: '+18%', up: true, icon: Users },
          { label: 'Avg. Session Value', value: '$142', change: '+8%', up: true, icon: TrendingUp },
          { label: 'Sessions This Month', value: '42', change: '-5%', up: false, icon: Calendar },
        ].map((stat, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-secondary-500">{stat.label}</p>
              <stat.icon className="w-4 h-4 text-secondary-400" />
            </div>
            <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
            <div className={`flex items-center gap-1 mt-1 text-sm ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
              {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Revenue vs Sessions</h3>
          {mounted && (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#colorRev2)" name="Revenue ($)" />
                <Bar yAxisId="right" dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sessions" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Client Acquisition Sources</h3>
          {mounted && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={clientSources} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {clientSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Client Retention Rate</h3>
        {mounted && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Legend />
              <Bar dataKey="retained" stackId="a" fill="#22c55e" name="Retained" radius={[0, 0, 4, 4]} />
              <Bar dataKey="churned" stackId="a" fill="#ef4444" name="Churned" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
