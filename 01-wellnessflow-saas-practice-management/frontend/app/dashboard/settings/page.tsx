'use client';

import { useState } from 'react';
import { User, Bell, Shield, CreditCard, Palette, Save } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'branding', label: 'Branding', icon: Palette },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-500">Manage your account and practice preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-2 space-y-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-secondary-600 hover:bg-secondary-50'}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="card">
            {saved && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4 flex items-center gap-2"><Save className="w-4 h-4" /> Settings saved successfully!</div>}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary-900">Profile Information</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-2xl">SC</div>
                  <div>
                    <button className="btn-secondary text-sm">Change Avatar</button>
                    <p className="text-xs text-secondary-500 mt-1">JPG, PNG. Max 2MB</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
                    <input type="text" defaultValue="Dr. Sarah Chen" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                    <input type="email" defaultValue="sarah@wellnessflow.com" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Phone</label>
                    <input type="tel" defaultValue="+1 555-0199" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Specialty</label>
                    <input type="text" defaultValue="Nutrition & Wellness" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Bio</label>
                  <textarea rows={4} defaultValue="Board-certified nutritionist with 10+ years of experience..." className="input-field" />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary-900">Notification Preferences</h3>
                {[
                  { label: 'Email notifications for new appointments', desc: 'Get notified when a client books a session', checked: true },
                  { label: 'SMS reminders before sessions', desc: 'Receive text reminders 24h and 1h before', checked: true },
                  { label: 'Payment confirmations', desc: 'Email when a client pays an invoice', checked: true },
                  { label: 'Weekly analytics summary', desc: 'Monday morning practice performance email', checked: false },
                  { label: 'Marketing and product updates', desc: 'News about new features and wellness tips', checked: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between py-3 border-b border-secondary-50">
                    <div>
                      <p className="font-medium text-secondary-900">{item.label}</p>
                      <p className="text-sm text-secondary-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                      <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary-900">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Current Password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">New Password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Confirm New Password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                </div>
                <div className="pt-4 border-t border-secondary-100">
                  <h4 className="font-medium text-secondary-900 mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-secondary-500 mb-3">Add an extra layer of security to your account</p>
                  <button className="btn-secondary text-sm">Enable 2FA</button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary-900">Billing Information</h3>
                <div className="border border-secondary-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-secondary-900">Professional Plan</p>
                      <p className="text-sm text-secondary-500">$79/month — Renews Feb 15, 2024</p>
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">Active</span>
                  </div>
                  <button className="btn-secondary text-sm">Manage Subscription</button>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900 mb-3">Payment Methods</h4>
                  <div className="flex items-center gap-3 p-3 border border-secondary-100 rounded-lg">
                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">•••• •••• •••• 4242</p>
                      <p className="text-xs text-secondary-500">Expires 12/25</p>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Default</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary-900">Practice Branding</h3>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Practice Name</label>
                  <input type="text" defaultValue="Sarah Chen Wellness" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Brand Color</label>
                  <div className="flex gap-3">
                    {['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((c) => (
                      <button key={c} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }}></button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Custom Domain</label>
                  <input type="text" defaultValue="sarah.wellnessflow.com" className="input-field" />
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-secondary-100 flex justify-end">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
