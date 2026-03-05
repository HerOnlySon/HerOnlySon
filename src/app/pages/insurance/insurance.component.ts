import { Component } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { TelemetryService } from '../../services/telemetry.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent {
  readonly vm$ = combineLatest([
    this.telemetry.latestMetric$,
    this.telemetry.carProfile$
  ]).pipe(
    map(([metric, car]) => {
      const riskScore = metric ? this.telemetry.calculateInsuranceRisk(metric, car) : 55;
      const quotes = this.telemetry.getInsuranceQuotes(metric, car).sort((a, b) => a.monthlyPrice - b.monthlyPrice);
      return {
        car,
        metric,
        riskScore,
        quotes
      };
    })
  );

  constructor(private readonly telemetry: TelemetryService) {}
}
