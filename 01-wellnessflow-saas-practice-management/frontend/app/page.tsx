import Link from 'next/link';
import { CheckCircle, Calendar, BarChart3, Shield, Zap, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white border-b border-secondary-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-800">WellnessFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-secondary-600 hover:text-secondary-800 font-medium">Sign In</Link>
              <Link href="/dashboard" className="btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-secondary-900 mb-6">
            Run Your Wellness Practice<br />
            <span className="text-primary-600">Like a Pro</span>
          </h1>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto mb-10">
            All-in-one practice management for nutritionists, health coaches, therapists, and wellness professionals. 
            Scheduling, billing, client portals, and analytics — in one beautiful platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">Start Free Trial</Link>
            <Link href="#pricing" className="btn-secondary text-lg px-8 py-3">View Pricing</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Everything You Need</h2>
            <p className="text-secondary-600 max-w-xl mx-auto">Replace 5+ tools with one integrated platform</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Calendar, title: 'Smart Scheduling', desc: 'Online booking, automated reminders, calendar sync, and group sessions.' },
              { icon: Users, title: 'Client Management', desc: 'Complete client profiles, health goals, session notes, and secure messaging.' },
              { icon: BarChart3, title: 'Business Analytics', desc: 'Revenue tracking, client retention, appointment metrics, and growth insights.' },
              { icon: Shield, title: 'HIPAA Compliant', desc: 'End-to-end encryption, secure data storage, and BAA included.' },
              { icon: Zap, title: 'Telehealth Built-in', desc: 'Launch secure video sessions directly from the platform — no extra apps.' },
              { icon: CheckCircle, title: 'Stripe Payments', desc: 'Invoicing, payment plans, packages, and automated billing.' },
            ].map((f, i) => (
              <div key={i} className="card hover:shadow-md transition-shadow">
                <f.icon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">{f.title}</h3>
                <p className="text-secondary-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-secondary-600">Start free, scale as you grow</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: 29, features: ['Up to 10 clients', 'Basic scheduling', 'Email reminders', 'Stripe payments'] },
              { name: 'Professional', price: 79, popular: true, features: ['Unlimited clients', 'Advanced scheduling', 'Telehealth', 'Analytics', 'Custom branding'] },
              { name: 'Enterprise', price: 199, features: ['Everything in Pro', 'Multi-practitioner', 'API access', 'HIPAA compliance', 'Priority support'] },
            ].map((plan, i) => (
              <div key={i} className={`card ${plan.popular ? 'ring-2 ring-primary-500 relative' : ''}`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>}
                <h3 className="text-xl font-bold text-secondary-900">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-secondary-900">${plan.price}</span>
                  <span className="text-secondary-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2 text-secondary-600">
                      <CheckCircle className="w-4 h-4 text-primary-600" /> {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard" className={`block text-center w-full py-2 rounded-lg font-medium ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
