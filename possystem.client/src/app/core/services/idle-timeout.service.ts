import { Injectable, NgZone } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class IdleTimeoutService {
  private readonly IDLE_MS = 15 * 60 * 1000;
  private readonly events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
  private readonly onActivity = () => this.restartTimer();
  private timer?: ReturnType<typeof setTimeout>;
  private running = false;

  constructor(private auth: AuthService, private zone: NgZone) {}

  start(): void {
    if (this.running) return;
    this.running = true;


    this.zone.runOutsideAngular(() => {
      this.events.forEach(e => window.addEventListener(e, this.onActivity, { passive: true }));
    });
    this.restartTimer();
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    this.events.forEach(e => window.removeEventListener(e, this.onActivity));
    clearTimeout(this.timer);
  }

  private restartTimer(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.zone.run(() => {
        this.stop();
        this.auth.logout();
      });
    }, this.IDLE_MS);
  }
}
