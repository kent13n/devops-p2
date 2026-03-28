import { Component } from '@angular/core';

@Component({
  selector: 'app-student-list',
  standalone: true,
  template: `
    <div class="card m-3">
      <h5 class="card-header">Liste des étudiants</h5>
      <div class="card-body">
        <p>À venir...</p>
      </div>
    </div>
  `
})
export class StudentListComponent {}
