import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, map, Observable } from 'rxjs';
import {
  CarMetric,
  CarProfile,
  InsuranceQuote,
  MaintenanceAlert,
  UserProfile
} from '../models/car-data.models';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private readonly metricsSubject = new BehaviorSubject<CarMetric[]>([]);
  private readonly userProfileSubject = new BehaviorSubject<UserProfile>({
    name: '',
    email: '',
    city: 'Johannesburg, Gauteng'
  });
  private readonly carProfileSubject = new BehaviorSubject<CarProfile>({
    make: 'VW',
    model: 'GTI',
    year: 2022,
    mileage: 48320,
    lastServiceMileage: 42000,
    serviceIntervalKm: 10000,
    drivingStyle: 'Balanced'
  });

  readonly metrics$ = this.metricsSubject.asObservable();
  readonly userProfile$ = this.userProfileSubject.asObservable();
  readonly carProfile$ = this.carProfileSubject.asObservable();
  readonly latestMetric$ = this.metrics$.pipe(map((metrics) => metrics[metrics.length - 1]));

  constructor() {
    this.seedInitialMetrics();
    interval(5000).subscribe(() => this.pushMetric());
  }

  saveUserProfile(profile: UserProfile): void {
    this.userProfileSubject.next(profile);
  }

  saveCarProfile(profile: CarProfile): void {
    this.carProfileSubject.next(profile);
  }

  getAlerts$(metric$: Observable<CarMetric | undefined>): Observable<MaintenanceAlert[]> {
    return metric$.pipe(map((metric) => this.buildAlerts(metric)));
  }

  getInsuranceQuotes(metric: CarMetric | undefined, car: CarProfile): InsuranceQuote[] {
    const baseRisk = metric ? this.calculateInsuranceRisk(metric, car) : 56;

    return [
      { provider: 'OUTsurance', monthlyPrice: 1290, riskScore: baseRisk + 4, reason: 'Comprehensive cover with strong roadside assistance support.' },
      { provider: 'Discovery Insure', monthlyPrice: 1120, riskScore: baseRisk, reason: 'Balanced premium with rewards for safer day-to-day driving.' },
      { provider: 'Hollard', monthlyPrice: 980, riskScore: Math.max(10, baseRisk - 6), reason: 'Usage-based option with lower monthly cost for low-risk drivers.' }
    ].map((quote) => ({
      ...quote,
      monthlyPrice: Math.round(quote.monthlyPrice + (quote.riskScore - 50) * 9)
    }));
  }

  calculateInsuranceRisk(metric: CarMetric, car: CarProfile): number {
    const stylePenalty = car.drivingStyle === 'Aggressive' ? 16 : car.drivingStyle === 'Balanced' ? 8 : 2;
    const rpmPenalty = metric.rpm > 3200 ? 14 : metric.rpm > 2500 ? 8 : 2;
    const fuelPenalty = metric.fuelLevel < 15 ? 10 : 3;
    const batteryPenalty = metric.batteryHealth < 45 ? 14 : metric.batteryHealth < 70 ? 6 : 2;
    const errorPenalty = metric.errorCodes.length * 7;

    return Math.min(98, Math.max(12, stylePenalty + rpmPenalty + fuelPenalty + batteryPenalty + errorPenalty + 22));
  }

  getNextService(car: CarProfile): { nextServiceMileage: number; dueInKm: number; dueNow: boolean; recommendation: string } {
    const nextServiceMileage = car.lastServiceMileage + car.serviceIntervalKm;
    const dueInKm = nextServiceMileage - car.mileage;
    const dueNow = dueInKm <= 0;
    const recommendation = dueNow
      ? 'Service is due now. Book your workshop appointment this week.'
      : dueInKm <= 1500
        ? 'Service is approaching soon. Plan your booking in advance.'
        : 'Service window is healthy based on current mileage.';

    return { nextServiceMileage, dueInKm, dueNow, recommendation };
  }

  private seedInitialMetrics(): void {
    const seed: CarMetric[] = [];
    let base = this.generateBaseMetric();

    for (let i = 0; i < 12; i += 1) {
      base = this.nextMetric(base, false);
      seed.push(base);
    }

    this.metricsSubject.next(seed);
  }

  private pushMetric(): void {
    const history = this.metricsSubject.value;
    const last = history[history.length - 1] ?? this.generateBaseMetric();
    const next = this.nextMetric(last, true);
    const capped = [...history, next].slice(-36);
    this.metricsSubject.next(capped);
  }

  private generateBaseMetric(): CarMetric {
    const now = new Date();
    return {
      timestamp: now,
      rpm: 1850,
      fuelLevel: 68,
      batteryHealth: 82,
      speed: 54,
      coolantTemp: 88,
      odometer: this.carProfileSubject.value.mileage,
      errorCodes: [],
      engineStatus: 'Healthy'
    };
  }

  private nextMetric(previous: CarMetric, advanceClock: boolean): CarMetric {
    const randomDelta = (magnitude: number) => (Math.random() * magnitude * 2) - magnitude;
    const timestamp = advanceClock ? new Date() : new Date(previous.timestamp.getTime() - (12 - this.metricsSubject.value.length) * 5000);

    const rpm = this.clamp(Math.round(previous.rpm + randomDelta(380)), 750, 4200);
    const speed = this.clamp(Math.round(previous.speed + randomDelta(9)), 0, 130);
    const fuelLevel = this.clamp(Math.round((previous.fuelLevel - Math.random() * 0.8) * 10) / 10, 3, 100);
    const batteryHealth = this.clamp(Math.round((previous.batteryHealth - Math.random() * 0.18) * 10) / 10, 24, 100);
    const coolantTemp = this.clamp(Math.round(previous.coolantTemp + randomDelta(3)), 76, 112);
    const odometer = Math.round((previous.odometer + speed / 720) * 10) / 10;

    const possibleCodes = ['P0171', 'P0300', 'P0420', 'P0456'];
    const withCode = Math.random() > 0.78;
    const errorCodes = withCode ? [possibleCodes[Math.floor(Math.random() * possibleCodes.length)]] : [];

    const engineStatus = this.computeStatus({ fuelLevel, batteryHealth, coolantTemp, errorCodes });

    return {
      timestamp,
      rpm,
      speed,
      fuelLevel,
      batteryHealth,
      coolantTemp,
      odometer,
      errorCodes,
      engineStatus
    };
  }

  private buildAlerts(metric: CarMetric | undefined): MaintenanceAlert[] {
    if (!metric) {
      return [];
    }

    const alerts: MaintenanceAlert[] = [];

    if (metric.fuelLevel < 18) {
      alerts.push({
        maintenanceType: 'Fuel Reserve',
        severity: 'Medium',
        status: 'Open',
        message: 'Fuel is below 18%. Refuel soon to avoid low-pressure engine strain.'
      });
    }

    if (metric.batteryHealth < 45) {
      alerts.push({
        maintenanceType: 'Battery Check',
        severity: 'High',
        status: 'Open',
        message: 'Battery health is deteriorating. Schedule a battery test this week.'
      });
    }

    if (metric.coolantTemp > 102) {
      alerts.push({
        maintenanceType: 'Cooling System',
        severity: 'High',
        status: 'Monitoring',
        message: 'Coolant temperature is elevated. Check coolant level and radiator airflow.'
      });
    }

    if (metric.errorCodes.length > 0) {
      alerts.push({
        maintenanceType: 'Diagnostic Trouble Code',
        severity: 'Medium',
        status: 'Open',
        message: `Detected code ${metric.errorCodes[0]}. Review explanation and plan service.`
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        maintenanceType: 'Routine Check',
        severity: 'Low',
        status: 'Monitoring',
        message: 'No active faults. Keep following regular maintenance intervals.'
      });
    }

    return alerts;
  }

  private computeStatus(data: {
    fuelLevel: number;
    batteryHealth: number;
    coolantTemp: number;
    errorCodes: string[];
  }): 'Healthy' | 'Warning' | 'Critical' {
    if (data.errorCodes.includes('P0300') || data.batteryHealth < 30 || data.coolantTemp > 108) {
      return 'Critical';
    }

    if (data.errorCodes.length > 0 || data.fuelLevel < 18 || data.batteryHealth < 45 || data.coolantTemp > 102) {
      return 'Warning';
    }

    return 'Healthy';
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
