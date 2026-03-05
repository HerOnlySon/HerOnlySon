import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { CarProfile, UserProfile } from '../../models/car-data.models';
import { TelemetryService } from '../../services/telemetry.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  private readonly destroyRef = inject(DestroyRef);
  isSaving = false;

  userForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    city: ['', [Validators.required]]
  });

  carForm = this.fb.group({
    make: ['', [Validators.required]],
    model: ['', [Validators.required]],
    year: [2021, [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear() + 1)]],
    mileage: [0, [Validators.required, Validators.min(0)]],
    lastServiceMileage: [0, [Validators.required, Validators.min(0)]],
    serviceIntervalKm: [10000, [Validators.required, Validators.min(1000)]],
    drivingStyle: ['Balanced' as CarProfile['drivingStyle'], [Validators.required]]
  });

  readonly profile$ = combineLatest([this.telemetry.userProfile$, this.telemetry.carProfile$]);

  constructor(
    private readonly fb: FormBuilder,
    private readonly telemetry: TelemetryService
  ) {
    this.profile$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([user, car]) => {
        this.userForm.patchValue(user, { emitEvent: false });
        this.carForm.patchValue(car, { emitEvent: false });
      });
  }

  saveProfiles(): void {
    if (this.userForm.invalid || this.carForm.invalid) {
      this.userForm.markAllAsTouched();
      this.carForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    window.setTimeout(() => {
      this.telemetry.saveUserProfile(this.userForm.getRawValue() as UserProfile);
      this.telemetry.saveCarProfile(this.carForm.getRawValue() as CarProfile);
      this.isSaving = false;
    }, 320);
  }
}
