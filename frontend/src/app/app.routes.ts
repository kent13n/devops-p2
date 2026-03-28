import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { StudentListComponent } from './pages/students/student-list.component';
import { StudentCreateComponent } from './pages/students/student-create/student-create.component';
import { StudentEditComponent } from './pages/students/student-edit/student-edit.component';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'students',
    pathMatch: 'full'
  },
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/create',
    component: StudentCreateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/:id/edit',
    component: StudentEditComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];
