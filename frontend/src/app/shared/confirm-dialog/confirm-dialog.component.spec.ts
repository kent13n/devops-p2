import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let dialogRefSpy: jest.Mocked<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = { close: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: MAT_DIALOG_DATA, useValue: { message: 'Confirmer ?' } },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();
  });

  it('should close with false on cancel', () => {
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.componentInstance.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should close with true on confirm', () => {
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.componentInstance.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
