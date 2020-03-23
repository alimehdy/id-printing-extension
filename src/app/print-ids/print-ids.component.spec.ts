import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintIdsComponent } from './print-ids.component';

describe('PrintIdsComponent', () => {
  let component: PrintIdsComponent;
  let fixture: ComponentFixture<PrintIdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintIdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
