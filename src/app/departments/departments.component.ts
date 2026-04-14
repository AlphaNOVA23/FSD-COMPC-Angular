import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DepartmentService } from '../core/services/department.service';
import { Department } from '../core/models/department.model';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
  standalone: false
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];

  constructor(
    private departmentService: DepartmentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Only execute the HTTP Request if we are physically in the Browser!
    // Server-Side Rendering (SSR) does not have access to LocalStorage tokens, 
    // so it would falsely trigger a 403 Forbidden intercept!
    if (isPlatformBrowser(this.platformId)) {
      this.departmentService.getDepartments().subscribe({
        next: (data) => {
          this.departments = data;
        },
        error: (err) => {
          console.error('Failed to load departments. Assuming Unauthorized.', err);
        }
      });
    }
  }
}
