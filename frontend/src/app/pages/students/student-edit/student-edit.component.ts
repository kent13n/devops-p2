import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../../shared/material.module';
import { StudentService } from '../../../core/service/student.service';
import { StudentRequest, StudentResponse } from '../../../core/models/Student';
import { StudentFormComponent } from '../student-form/student-form.component';

@Component({
  selector: 'app-student-edit',
  standalone: true,
  imports: [CommonModule, MaterialModule, StudentFormComponent],
  templateUrl: './student-edit.component.html'
})
export class StudentEditComponent implements OnInit {
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  student?: StudentResponse;
  loadingStudent = true;
  loading = false;
  errorMessage = '';
  private studentId!: number;

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.studentId) || this.studentId <= 0) {
      this.loadingStudent = false;
      this.errorMessage = 'Identifiant d\'étudiant invalide';
      return;
    }
    this.studentService.findById(this.studentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student) => {
          this.student = student;
          this.loadingStudent = false;
        },
        error: (err) => {
          this.loadingStudent = false;
          this.errorMessage = err.error?.message || 'Étudiant non trouvé';
        }
      });
  }

  onSubmit(studentData: StudentRequest): void {
    this.loading = true;
    this.errorMessage = '';
    this.studentService.update(this.studentId, studentData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Étudiant modifié avec succès !', 'Fermer', { duration: 3000 });
          this.router.navigate(['/students']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/students']);
  }
}
