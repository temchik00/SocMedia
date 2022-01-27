import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterChatModalComponent } from './alter-chat-modal.component';

describe('AlterChatModalComponent', () => {
  let component: AlterChatModalComponent;
  let fixture: ComponentFixture<AlterChatModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlterChatModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterChatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
