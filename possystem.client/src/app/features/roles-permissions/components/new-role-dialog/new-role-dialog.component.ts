import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NewRoleInput, Role } from '../../models/role.model';

@Component({
  selector: 'app-new-role-dialog',
  templateUrl: './new-role-dialog.component.html',
  styleUrls: ['./new-role-dialog.component.css']
})
export class NewRoleDialogComponent implements AfterViewInit {
  @Input() roles: Role[] = [];          // "Copy permissions from" dropdown eka
  @Output() created = new EventEmitter<NewRoleInput>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;

  name = '';
  description = '';
  copyFrom: number | null = null;       // null = Start blank
  attempted = false;                    // Create click kalata passe vitharak validation eka pennna

  ngAfterViewInit(): void {
    this.nameInput.nativeElement.focus();
  }

  get nameError(): string {
    const name = this.name.trim();
    if (!name) return 'Role name is required';
    if (name.length > 40) return 'Role name must be 40 characters or less';

    const taken = this.roles.some(r => r.name.toLowerCase() === name.toLowerCase());
    return taken ? 'A role with this name already exists' : '';
  }

  submit(): void {
    this.attempted = true;
    if (this.nameError) return;

    this.created.emit({
      name: this.name.trim(),
      description: this.description.trim(),
      copyFromRoleId: this.copyFrom
    });
  }
}
