import { Component } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { MaintenanceAlert } from '../../models/car-data.models';
import { AiInsightsService } from '../../services/ai-insights.service';
import { TelemetryService } from '../../services/telemetry.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  readonly vm$ = combineLatest([
    this.telemetry.metrics$,
    this.telemetry.latestMetric$,
    this.telemetry.getAlerts$(this.telemetry.latestMetric$),
    this.telemetry.carProfile$
  ]).pipe(
    map(([history, latest, alerts, car]) => {
      const risk = this.ai.predictBreakdownRisk(history);
      const chartWindow = history.slice(-12);

      return {
        latest,
        car,
        history,
        alerts,
        risk,
        service: this.telemetry.getNextService(car),
        maintenanceTip: this.ai.suggestMaintenance(latest),
        rpmPoints: this.toPoints(chartWindow.map((metric) => metric.rpm), 700, 4200),
        fuelPoints: this.toPoints(chartWindow.map((metric) => metric.fuelLevel), 0, 100),
        batteryPoints: this.toPoints(chartWindow.map((metric) => metric.batteryHealth), 0, 100),
        explainedCodes: this.getCodeExplanations(latest?.errorCodes ?? []),
        lastUpdated: latest?.timestamp
      };
    })
  );

  constructor(
    private readonly telemetry: TelemetryService,
    private readonly ai: AiInsightsService
  ) {}

  trackByAlert(_: number, alert: MaintenanceAlert): string {
    return `${alert.maintenanceType}-${alert.severity}`;
  }

  private getCodeExplanations(codes: string[]): Array<{ code: string; explanation: string }> {
    return codes.map((code) => ({
      code,
      explanation: this.ai.explainErrorCode(code)
    }));
  }

  private toPoints(values: number[], min: number, max: number): string {
    if (values.length === 0) {
      return '';
    }

    const width = 340;
    const height = 130;

    return values
      .map((value, index) => {
        const x = (index / (values.length - 1 || 1)) * width;
        const normalized = (value - min) / (max - min);
        const y = height - (normalized * height);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }
}
