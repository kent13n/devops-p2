import { AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../shared/material.module';
import { StudentService } from '../../core/service/student.service';
import { StudentResponse } from '../../core/models/Student';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit, AfterViewInit {
  private studentService = inject(StudentService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<StudentResponse>();
  loading = true;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadStudents();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadStudents(): void {
    this.loading = true;
    this.errorMessage = '';
    this.studentService.findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (students) => {
          this.dataSource.data = students;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors du chargement des étudiants';
        }
      });
  }

  deleteStudent(student: StudentResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Supprimer l'étudiant ${student.firstName} ${student.lastName} ?` }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.studentService.delete(student.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.snackBar.open('Étudiant supprimé avec succès !', 'Fermer', { duration: 3000 });
              this.loadStudents();
            },
            error: (err) => {
              this.snackBar.open(err.error?.message || 'Erreur lors de la suppression', 'Fermer', { duration: 3000 });
            }
          });
      }
    });
  }
}
