import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMiniatureComponent } from './chat-miniature.component';

describe('ChatMiniatureComponent', () => {
  let component: ChatMiniatureComponent;
  let fixture: ComponentFixture<ChatMiniatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatMiniatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMiniatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
