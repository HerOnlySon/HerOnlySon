import { Injectable } from '@angular/core';
import { CarMetric } from '../models/car-data.models';

@Injectable({
  providedIn: 'root'
})
export class AiInsightsService {
  private readonly explanations: Record<string, string> = {
    P0171: 'The engine is running too lean, meaning it gets too much air and not enough fuel.',
    P0300: 'Your engine is misfiring randomly, which can reduce power and increase fuel use.',
    P0420: 'The catalytic converter is not cleaning emissions efficiently and may be aging.',
    P0456: 'There is a very small leak in the evaporative emissions system, often from fuel cap seals.'
  };

  explainErrorCode(code: string): string {
    return this.explanations[code] ?? 'The code indicates a non-critical diagnostic event. A service centre scan is recommended.';
  }

  suggestMaintenance(metric: CarMetric | undefined): string {
    if (!metric) {
      return 'Connect to telemetry to get tailored maintenance advice.';
    }

    if (metric.batteryHealth < 45) {
      return 'Prioritize a battery and alternator test. Low battery health can trigger cascading electronics faults.';
    }

    if (metric.fuelLevel < 20) {
      return 'Refuel in the next trip window. Persistently low fuel levels can overwork the fuel pump.';
    }

    if (metric.errorCodes.length > 0) {
      return 'Book a diagnostic session within 72 hours and avoid hard acceleration until the code is cleared.';
    }

    return 'Vehicle health is stable. Keep up with oil, tire pressure, and filter checks at scheduled intervals.';
  }

  predictBreakdownRisk(history: CarMetric[]): { score: number; summary: string } {
    if (history.length === 0) {
      return { score: 0, summary: 'No telemetry history available yet.' };
    }

    const latest = history[history.length - 1];
    const avgRpm = history.reduce((sum, metric) => sum + metric.rpm, 0) / history.length;
    const avgBattery = history.reduce((sum, metric) => sum + metric.batteryHealth, 0) / history.length;
    const withCodes = history.filter((metric) => metric.errorCodes.length > 0).length;

    const score = Math.min(
      100,
      Math.round(
        (latest.engineStatus === 'Critical' ? 42 : latest.engineStatus === 'Warning' ? 24 : 8) +
        (avgRpm > 2800 ? 16 : 7) +
        (avgBattery < 50 ? 22 : 8) +
        withCodes * 2.4
      )
    );

    const summary = score > 70
      ? 'High near-term risk. Schedule diagnostics and avoid long-distance trips until resolved.'
      : score > 40
        ? 'Moderate risk. Continue monitoring and service known trouble codes soon.'
        : 'Low risk trend. Current driving and vehicle health indicators are stable.';

    return { score, summary };
  }
}