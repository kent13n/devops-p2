import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { StudentRequest, StudentResponse } from '../../../core/models/Student';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent implements OnInit {
  @Input() student?: StudentResponse;
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<StudentRequest>();
  @Output() formCancel = new EventEmitter<void>();

  private formBuilder = inject(FormBuilder);
  studentForm: FormGroup = new FormGroup({});
  submitted = false;

  get isEditMode(): boolean {
    return !!this.student;
  }

  get form() {
    return this.studentForm.controls;
  }

  ngOnInit() {
    this.studentForm = this.formBuilder.group({
      firstName: [this.student?.firstName || '', Validators.required],
      lastName: [this.student?.lastName || '', Validators.required],
      email: [this.student?.email || '', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.studentForm.invalid) {
      return;
    }
    const request: StudentRequest = {
      firstName: this.studentForm.get('firstName')?.value,
      lastName: this.studentForm.get('lastName')?.value,
      email: this.studentForm.get('email')?.value
    };
    this.formSubmit.emit(request);
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
