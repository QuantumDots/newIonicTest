import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DefaultAsideComponent } from './default-aside.component';

describe('DefaultAsideComponent', () => {
  let component: DefaultAsideComponent;
  let fixture: ComponentFixture<DefaultAsideComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultAsideComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
