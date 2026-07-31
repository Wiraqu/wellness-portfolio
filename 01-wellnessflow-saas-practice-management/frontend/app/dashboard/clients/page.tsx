'use client';

import { useState } from 'react';
import { Plus, Search, Mail, Phone, Calendar, TrendingUp, MoreHorizontal, Filter } from 'lucide-react';

const mockClients = [
  { id: 'c1', name: 'Emma Wilson', email: 'emma@email.com', phone: '+1 555-0101', status: 'active', lastSession: '2024-01-10', healthGoals: ['Weight Loss', 'Nutrition'], progress: 78 },
  { id: 'c2', name: 'James Miller', email: 'james@email.com', phone: '+1 555-0102', status: 'active', lastSession: '2024-01-12', healthGoals: ['Muscle Gain', 'Strength'], progress: 65 },
  { id: 'c3', name: 'Sophia Lee', email: 'sophia@email.com', phone: '+1 555-0103', status: 'onboarding', lastSession: '2024-01-08', healthGoals: ['Stress Management'], progress: 30 },
  { id: 'c4', name: 'Michael Brown', email: 'michael@email.com', phone: '+1 555-0104', status: 'active', lastSession: '2024-01-14', healthGoals: ['Cardio Health'], progress: 92 },
  { id: 'c5', name: 'Olivia Davis', email: 'olivia@email.com', phone: '+1 555-0105', status: 'inactive', lastSession: '2023-12-20', healthGoals: ['Sleep Quality'], progress: 45 },
];

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const filtered = mockClients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Clients</h1>
          <p className="text-secondary-500">Manage your client roster and health journeys</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Client</button>
      </div>

      <div className="card">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input type="text" placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <button className="btn-secondary flex items-center gap-2"><Filter className="w-4 h-4" /> Filter</button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <div key={client.id} className="border border-secondary-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-lg">{client.name.charAt(0)}</div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">{client.name}</h3>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      client.status === 'active' ? 'bg-green-50 text-green-700' :
                      client.status === 'onboarding' ? 'bg-blue-50 text-blue-700' :
                      'bg-secondary-100 text-secondary-600'
                    }`}>{client.status}</span>
                  </div>
                </div>
                <button className="p-1 hover:bg-secondary-50 rounded"><MoreHorizontal className="w-4 h-4 text-secondary-400" /></button>
              </div>

              <div className="space-y-2 text-sm text-secondary-600 mb-4">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {client.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {client.phone}</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Last: {client.lastSession}</div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-secondary-500">Progress</span>
                  <span className="font-medium text-secondary-900">{client.progress}%</span>
                </div>
                <div className="w-full bg-secondary-100 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${client.progress}%` }}></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {client.healthGoals.map((goal, i) => (
                  <span key={i} className="px-2 py-1 bg-secondary-50 text-secondary-600 text-xs rounded-md font-medium">{goal}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
