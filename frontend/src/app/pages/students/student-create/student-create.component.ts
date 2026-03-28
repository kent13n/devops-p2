import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../../shared/material.module';
import { StudentService } from '../../../core/service/student.service';
import { StudentRequest } from '../../../core/models/Student';
import { StudentFormComponent } from '../student-form/student-form.component';

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [CommonModule, MaterialModule, StudentFormComponent],
  templateUrl: './student-create.component.html'
})
export class StudentCreateComponent {
  private studentService = inject(StudentService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  loading = false;
  errorMessage = '';

  onSubmit(student: StudentRequest): void {
    this.loading = true;
    this.errorMessage = '';
    this.studentService.create(student)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Étudiant ajouté avec succès !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/students']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout';
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/students']);
  }
}
