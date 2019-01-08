import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthboundGridComponent } from './earthbound-grid.component';

describe('EarthboundGridComponent', () => {
  let component: EarthboundGridComponent;
  let fixture: ComponentFixture<EarthboundGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarthboundGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarthboundGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
