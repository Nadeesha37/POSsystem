import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';

type Theme = 'modern' | 'emerald' | 'obsidian';
type LandingPage = 'Analytics Dashboard' | 'Sales Register' | 'Inventory' | 'Reports';
type FontChoice = 'Figtree' | 'Georgia,serif' | 'ui-monospace,Menlo,monospace';
type DateFormat = 'ymd' | 'dmy' | 'mdy';
type TimeFormat = '12' | '24';
type NotificationChannel = 'inApp' | 'email' | 'sms';

interface NotificationSetting {
  id: string;
  label: string;
  inApp: boolean;
  email: boolean;
  sms: boolean;
}

interface SettingsConfig {
  theme: Theme;
  dark: boolean;
  landing: LandingPage;
  sidebar: 'expanded' | 'collapsed';
  font: FontChoice;
  fontSize: number;
  density: number;
  language: string;
  timeZone: string;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  currency: string;
  firstDay: string;
  notifications: NotificationSetting[];
  sound: boolean;
  quietStart: string;
  quietEnd: string;
  quietHours: boolean;
  drawerMode: 'Arm on sale' | 'Open manually';
  printer: string;
  cashDrawer: boolean;
  receiptPrinter: boolean;
  barcodeScanner: boolean;
  cardTerminal: boolean;
}

const DEFAULT_SETTINGS: SettingsConfig = {
  theme: 'modern',
  dark: false,
  landing: 'Analytics Dashboard',
  sidebar: 'expanded',
  font: 'Figtree',
  fontSize: 15,
  density: 30,
  language: 'English (US)',
  timeZone: 'Asia/Colombo',
  dateFormat: 'ymd',
  timeFormat: '12',
  currency: 'LKR (Rs)',
  firstDay: 'Monday',
  notifications: [
    { id: 'stock', label: 'Low stock', inApp: true, email: true, sms: false },
    { id: 'order', label: 'Order updates', inApp: true, email: false, sms: false },
    { id: 'daily', label: 'Daily summary', inApp: false, email: true, sms: false },
    { id: 'system', label: 'System updates', inApp: true, email: false, sms: false }
  ],
  sound: true,
  quietStart: '22:00',
  quietEnd: '07:00',
  quietHours: false,
  drawerMode: 'Arm on sale',
  printer: 'Generic',
  cashDrawer: true,
  receiptPrinter: true,
  barcodeScanner: false,
  cardTerminal: false
};

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  @ViewChildren('tabButton') private tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  readonly tabs = [
    'System Preferences',
    'Localization & Layout',
    'Notifications',
    'Hardware Operations'
  ];
  readonly landingPages: LandingPage[] = [
    'Analytics Dashboard',
    'Sales Register',
    'Inventory',
    'Reports'
  ];
  readonly notificationChannels: NotificationChannel[] = ['inApp', 'email', 'sms'];
  readonly channelLabels: Record<NotificationChannel, string> = {
    inApp: 'In-app',
    email: 'Email',
    sms: 'SMS'
  };

  draft = this.cloneSettings(DEFAULT_SETTINGS);
  applied = this.cloneSettings(DEFAULT_SETTINGS);
  activeTab = 0;
  toastMessage = '';

  private toastTimer?: ReturnType<typeof setTimeout>;
  private clockTimer?: ReturnType<typeof setInterval>;
  private previewNow = new Date();

  ngOnInit(): void {
    this.clockTimer = setInterval(() => this.previewNow = new Date(), 30_000);
  }

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
    }
  }

  onTabKeydown(event: KeyboardEvent, index: number): void {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % this.tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index + this.tabs.length - 1) % this.tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = this.tabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      this.activeTab = nextIndex;
      this.tabButtons.get(nextIndex)?.nativeElement.focus();
    }
  }

  applySettings(): void {
    this.applied = this.cloneSettings(this.draft);
    this.showToast('Preview updated (not saved)');
  }

  discardChanges(): void {
    this.draft = this.cloneSettings(this.applied);
    this.showToast('Changes discarded');
  }

  densityDescription(value: number): string {
    const density = this.densityLabel(value);
    return `${density} rows: about ${Math.floor(360 / value)} rows fit in 360 px of table.`;
  }

  densityLabel(value: number): string {
    return value <= 32 ? 'Compact' : value <= 48 ? 'Comfortable' : 'Spacious';
  }

  get activeHardwareCount(): number {
    return [
      this.applied.cashDrawer,
      this.applied.receiptPrinter,
      this.applied.barcodeScanner,
      this.applied.cardTerminal
    ].filter(Boolean).length;
  }

  get previewClock(): string {
    const time = new Intl.DateTimeFormat('en-US', {
      timeZone: this.draft.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: this.draft.timeFormat === '12'
    }).format(this.previewNow).replace(/^24/, '00');
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: this.draft.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(this.previewNow);
    const dateParts: Record<string, string> = {};
    for (const part of parts) {
      dateParts[part.type] = part.value;
    }
    const date = this.draft.dateFormat === 'dmy'
      ? `${dateParts['day']}/${dateParts['month']}/${dateParts['year']}`
      : this.draft.dateFormat === 'mdy'
        ? `${dateParts['month']}/${dateParts['day']}/${dateParts['year']}`
        : `${dateParts['year']}-${dateParts['month']}-${dateParts['day']}`;

    return `${time} | ${date}`;
  }

  get printerStatus(): string {
    return this.draft.receiptPrinter ? `${this.draft.printer} Ready` : 'Printer Off';
  }

  get drawerStatus(): string {
    if (!this.draft.cashDrawer) {
      return 'Drawer Off';
    }
    return this.draft.drawerMode === 'Arm on sale' ? 'Drawer Arm' : 'Drawer Manual';
  }

  trackById(_index: number, setting: NotificationSetting): string {
    return setting.id;
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => this.toastMessage = '', 2200);
  }

  private cloneSettings(settings: SettingsConfig): SettingsConfig {
    return {
      ...settings,
      notifications: settings.notifications.map(notification => ({ ...notification }))
    };
  }

}
