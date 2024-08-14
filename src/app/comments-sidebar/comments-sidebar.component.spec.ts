import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsSidebarComponent } from './comments-sidebar.component';

describe('CommentsSidebarComponent', () => {
  let component: CommentsSidebarComponent;
  let fixture: ComponentFixture<CommentsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
