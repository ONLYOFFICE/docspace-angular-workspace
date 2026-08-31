import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocspaceAngular } from './docspace-angular';

describe('DocspaceAngular', () => {
  let component: DocspaceAngular;
  let fixture: ComponentFixture<DocspaceAngular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocspaceAngular]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocspaceAngular);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
