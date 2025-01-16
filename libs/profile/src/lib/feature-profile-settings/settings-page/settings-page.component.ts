import { ChangeDetectionStrategy } from '@angular/core';
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Component, effect, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AvatarUploadComponent, ProfileHeaderComponent } from './../../ui';

//@ts-ignore
import { AuthService } from '@tt/auth';
import { StackInputComponent, SvgIconComponent } from '@tt/common-ui';
import { ProfileService } from '@tt/data-access/profile';
import { AddressInputComponent } from "@tt/common-ui";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    AvatarUploadComponent,
    StackInputComponent,
    RouterLink,
    SvgIconComponent,
    AddressInputComponent
],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  authService = inject(AuthService);
  router = inject(Router);
  me = this.profileService.me;

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    description: [''],
    stack: [''],
    city: [null]
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
      });
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();


    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }

    firstValueFrom(
      //@ts-ignore
      this.profileService.patchProfile({
        ...this.form.value,
      })
    );
  }

  onExit() {
    //@ts-ignore
    this.authService.logout();
  }
}
