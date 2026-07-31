'use client';

import { useState } from 'react';
import { CreditCard, Download, Plus, CheckCircle, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const mockInvoices = [
  { id: 'INV-001', client: 'Emma Wilson', amount: 150, status: 'paid', date: '2024-01-10', service: 'Initial Consultation' },
  { id: 'INV-002', client: 'James Miller', amount: 120, status: 'paid', date: '2024-01-12', service: 'Follow-up Session' },
  { id: 'INV-003', client: 'Sophia Lee', amount: 200, status: 'pending', date: '2024-01-14', service: '3-Session Package' },
  { id: 'INV-004', client: 'Michael Brown', amount: 150, status: 'overdue', date: '2024-01-05', service: 'Initial Consultation' },
];

const mockSubscriptions = [
  { id: 'sub-1', plan: 'Professional', price: 79, interval: 'month', nextBilling: '2024-02-15', status: 'active' },
];

export default function BillingPage() {
  const [tab, setTab] = useState('invoices');
  const totalPaid = mockInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = mockInvoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = mockInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Billing & Payments</h1>
          <p className="text-secondary-500">Manage invoices, subscriptions, and revenue</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Create Invoice</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Total Revenue</p>
              <p className="text-2xl font-bold text-secondary-900">{formatCurrency(totalPaid)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Pending</p>
              <p className="text-2xl font-bold text-secondary-900">{formatCurrency(totalPending)}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg"><Clock className="w-5 h-5 text-yellow-600" /></div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdue)}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg"><AlertCircle className="w-5 h-5 text-red-600" /></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-4 border-b border-secondary-100 mb-4">
          {['invoices', 'subscriptions'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'invoices' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-100">
                  <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Invoice</th>
                  <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Client</th>
                  <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Service</th>
                  <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Date</th>
                  <th className="text-right text-xs font-medium text-secondary-500 uppercase py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-secondary-500 uppercase py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-secondary-50 hover:bg-secondary-50/50">
                    <td className="py-3 font-mono text-sm text-secondary-700">{inv.id}</td>
                    <td className="py-3 font-medium text-secondary-900">{inv.client}</td>
                    <td className="py-3 text-secondary-600">{inv.service}</td>
                    <td className="py-3 text-secondary-600">{inv.date}</td>
                    <td className="py-3 text-right font-medium text-secondary-900">{formatCurrency(inv.amount)}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        inv.status === 'paid' ? 'bg-green-50 text-green-700' :
                        inv.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'subscriptions' && (
          <div className="space-y-4">
            {mockSubscriptions.map((sub) => (
              <div key={sub.id} className="border border-secondary-100 rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-50 rounded-lg"><CreditCard className="w-5 h-5 text-primary-600" /></div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">{sub.plan} Plan</h3>
                    <p className="text-sm text-secondary-500">Next billing: {sub.nextBilling}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-secondary-900">{formatCurrency(sub.price)}<span className="text-sm font-normal text-secondary-500">/{sub.interval}</span></p>
                  <span className="inline-flex px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium">{sub.status}</span>
                </div>
              </div>
            ))}
            <div className="bg-primary-50 rounded-xl p-5">
              <h3 className="font-semibold text-secondary-900 mb-2">Upgrade your plan</h3>
              <p className="text-sm text-secondary-600 mb-4">Get more features with the Enterprise plan.</p>
              <button className="btn-primary text-sm flex items-center gap-1">View Plans <ArrowUpRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
