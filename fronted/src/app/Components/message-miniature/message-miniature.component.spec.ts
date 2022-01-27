import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageMiniatureComponent } from './message-miniature.component';

describe('MessageMiniatureComponent', () => {
  let component: MessageMiniatureComponent;
  let fixture: ComponentFixture<MessageMiniatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageMiniatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageMiniatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
