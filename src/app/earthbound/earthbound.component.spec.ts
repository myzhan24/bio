import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthboundComponent } from './earthbound.component';

describe('EarthboundComponent', () => {
  let component: EarthboundComponent;
  let fixture: ComponentFixture<EarthboundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarthboundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarthboundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
