export interface User {
  id: string;
  email: string;
  name: string;
  role: 'practitioner' | 'client' | 'admin';
  avatar?: string;
  subscriptionTier?: 'free' | 'starter' | 'professional' | 'enterprise';
  createdAt: string;
}

export interface Client {
  id: string;
  userId: string;
  practitionerId: string;
  healthGoals: string[];
  notes: string;
  lastSession: string;
  status: 'active' | 'inactive' | 'onboarding';
}

export interface Appointment {
  id: string;
  practitionerId: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  type: 'initial' | 'followup' | 'group' | 'telehealth';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

export interface DashboardMetrics {
  totalClients: number;
  activeClients: number;
  monthlyRevenue: number;
  upcomingAppointments: number;
  completionRate: number;
  clientRetention: number;
}

export interface HealthMetric {
  id: string;
  clientId: string;
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'sleep' | 'mood' | 'steps';
  value: number;
  unit: string;
  recordedAt: string;
}
