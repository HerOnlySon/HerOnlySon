import { Component } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { AiInsightsService } from '../../services/ai-insights.service';
import { TelemetryService } from '../../services/telemetry.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  projectedMileage = 12000;

  readonly report$ = combineLatest([
    this.telemetry.metrics$,
    this.telemetry.userProfile$,
    this.telemetry.carProfile$
  ]).pipe(
    map(([history, user, car]) => {
      const latest = history[history.length - 1];
      const risk = this.ai.predictBreakdownRisk(history);
      const avgFuel = history.length
        ? history.reduce((sum, metric) => sum + metric.fuelLevel, 0) / history.length
        : 0;
      const projectedRisk = Math.min(100, risk.score + Math.round(this.projectedMileage / 1500));

      return {
        user,
        car,
        latest,
        risk,
        avgFuel,
        projectedRisk
      };
    })
  );

  constructor(
    private readonly telemetry: TelemetryService,
    private readonly ai: AiInsightsService
  ) {}
}
