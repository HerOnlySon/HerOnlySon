export interface UserProfile {
  name: string;
  email: string;
  city: string;
}

export interface CarProfile {
  make: string;
  model: string;
  year: number;
  mileage: number;
  lastServiceMileage: number;
  serviceIntervalKm: number;
  drivingStyle: 'Calm' | 'Balanced' | 'Aggressive';
}

export interface CarMetric {
  timestamp: Date;
  rpm: number;
  fuelLevel: number;
  batteryHealth: number;
  speed: number;
  coolantTemp: number;
  odometer: number;
  errorCodes: string[];
  engineStatus: 'Healthy' | 'Warning' | 'Critical';
}

export interface InsuranceQuote {
  provider: string;
  monthlyPrice: number;
  riskScore: number;
  reason: string;
}

export interface MaintenanceAlert {
  maintenanceType: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Monitoring';
  message: string;
}
