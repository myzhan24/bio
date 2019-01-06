import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthboundCardComponent } from './earthbound-card.component';

describe('EarthboundCardComponent', () => {
  let component: EarthboundCardComponent;
  let fixture: ComponentFixture<EarthboundCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarthboundCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarthboundCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
