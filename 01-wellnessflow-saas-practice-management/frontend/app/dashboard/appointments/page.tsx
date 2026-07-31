'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Calendar, Clock, Video, MapPin, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import type { Appointment } from '@/types';

const mockAppointments: Appointment[] = [
  { id: '1', practitionerId: '1', clientId: 'c1', clientName: 'Emma Wilson', date: '2024-01-15', time: '09:00', duration: 60, type: 'initial', status: 'scheduled', notes: 'First consultation - nutrition plan' },
  { id: '2', practitionerId: '1', clientId: 'c2', clientName: 'James Miller', date: '2024-01-15', time: '11:00', duration: 45, type: 'followup', status: 'scheduled' },
  { id: '3', practitionerId: '1', clientId: 'c3', clientName: 'Sophia Lee', date: '2024-01-15', time: '14:00', duration: 60, type: 'telehealth', status: 'scheduled' },
  { id: '4', practitionerId: '1', clientId: 'c4', clientName: 'Michael Brown', date: '2024-01-14', time: '10:00', duration: 30, type: 'followup', status: 'completed' },
  { id: '5', practitionerId: '1', clientId: 'c5', clientName: 'Olivia Davis', date: '2024-01-14', time: '16:00', duration: 60, type: 'group', status: 'cancelled' },
];

export default function AppointmentsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = mockAppointments.filter(a => {
    const matchFilter = filter === 'all' || a.status === filter;
    const matchSearch = a.clientName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Appointments</h1>
          <p className="text-secondary-500">Manage your schedule and client sessions</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Appointment
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input type="text" placeholder="Search appointments..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex gap-2">
            {['all', 'scheduled', 'completed', 'cancelled'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-100">
                <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Client</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Date & Time</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Type</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Duration</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Status</th>
                <th className="text-right text-xs font-medium text-secondary-500 uppercase py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt.id} className="border-b border-secondary-50 hover:bg-secondary-50/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm">{apt.clientName.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-secondary-900">{apt.clientName}</p>
                        {apt.notes && <p className="text-xs text-secondary-500">{apt.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 text-secondary-600">
                      <Calendar className="w-4 h-4" /> {apt.date}
                      <Clock className="w-4 h-4 ml-2" /> {apt.time}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      apt.type === 'telehealth' ? 'bg-blue-50 text-blue-700' :
                      apt.type === 'initial' ? 'bg-purple-50 text-purple-700' :
                      apt.type === 'group' ? 'bg-orange-50 text-orange-700' :
                      'bg-secondary-100 text-secondary-700'
                    }`}>
                      {apt.type === 'telehealth' && <Video className="w-3 h-3" />}
                      {apt.type === 'initial' && <MapPin className="w-3 h-3" />}
                      {apt.type}
                    </span>
                  </td>
                  <td className="py-4 text-secondary-600">{apt.duration} min</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'scheduled' ? 'bg-yellow-50 text-yellow-700' :
                      apt.status === 'completed' ? 'bg-green-50 text-green-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {apt.status === 'scheduled' && <Clock className="w-3 h-3" />}
                      {apt.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      {apt.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-2 hover:bg-secondary-100 rounded-lg"><MoreHorizontal className="w-4 h-4 text-secondary-500" /></button>
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
