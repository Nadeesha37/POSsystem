import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDtlRptComponent } from './login-dtl-rpt.component';

describe('LoginDtlRptComponent', () => {
  let component: LoginDtlRptComponent;
  let fixture: ComponentFixture<LoginDtlRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginDtlRptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginDtlRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
