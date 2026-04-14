import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
  standalone: false
})
export class EmployeeDetailComponent implements OnInit {
  employee: any = null;
  loading = true;
  activeTab: 'identity' | 'organization' | 'payroll' | 'performance' = 'identity';
  
  // Catalogs for assignments
  departments: any[] = [];
  trainings: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(id);
      this.loadCatalogs();
    }
  }

  loadEmployee(id: string): void {
    this.loading = true;
    this.http.get(`/apix/employees/${id}`).subscribe({
      next: (res) => {
        this.employee = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load employee', err);
        this.router.navigate(['/admin']);
      }
    });
  }

  loadCatalogs(): void {
    this.http.get<any[]>('/apix/departments').subscribe(res => this.departments = res);
    this.http.get<any[]>('/apix/training-programs').subscribe(res => this.trainings = res);
  }

  updateIdentity(): void {
    // PATCH with only the name field to avoid sending nested objects
    this.http.patch(`/apix/employees/${this.employee.employeeId}`, {
      employeeName: this.employee.employeeName
    }).subscribe({
      next: (res) => {
        this.employee = res;
        alert('Identity updated successfully');
      },
      error: (err: any) => alert('Update failed: ' + (err.error?.error || err.message))
    });
  }

  assignDepartment(event: Event): void {
    const deptId = (event.target as HTMLSelectElement).value;
    if (!deptId) return;

    this.http.put(`/apix/departments/${deptId}/assign/${this.employee.employeeId}`, {}).subscribe({
      next: () => {
        this.loadEmployee(this.employee.employeeId);
        alert('Department assigned');
      },
      error: (err: any) => alert('Assignment failed: ' + (err.error?.error || err.message))
    });
  }

  updateSalary(): void {
    const salary = this.employee.salary;
    if (!salary) return;

    // PATCH with only the editable fields
    this.http.patch(`/apix/salaries/${salary.salaryId}`, {
      baseSalary: salary.baseSalary,
      bonus: salary.bonus,
      deductions: salary.deductions
    }).subscribe({
      next: (res) => {
        this.employee.salary = res;
        alert('Salary updated');
      },
      error: (err: any) => alert('Salary update failed: ' + (err.error?.error || err.message))
    });
  }

  createPayroll(): void {
    const payload = {
      salary: {
        baseSalary: 0,
        bonus: 0,
        deductions: 0
      }
    };
    
    this.http.patch(`/apix/employees/${this.employee.employeeId}`, payload).subscribe({
      next: (res: any) => {
        this.employee.salary = res.salary;
        alert('Payroll profile initialized successfully');
      },
      error: (err: any) => alert('Payroll initialization failed: ' + (err.error?.error || err.message))
    });
  }

  enrollInTraining(trainingId: string): void {
    if (!trainingId) return;
    const enrollment = {
      employee: { employeeId: this.employee.employeeId },
      trainingProgram: { trainingId: trainingId },
      status: 'In Progress'
    };
    
    this.http.post('/apix/employee-trainings', enrollment).subscribe({
      next: () => {
        this.loadEmployee(this.employee.employeeId);
        alert('Enrolled successfully');
      },
      error: (err: any) => alert('Enrollment failed: ' + (err.error?.error || err.message))
    });
  }

  deleteEmployee(): void {
    if (!confirm(`Are you sure you want to delete ${this.employee.employeeName}? This action cannot be undone.`)) return;
    
    this.http.delete(`/apix/employees/${this.employee.employeeId}`).subscribe({
      next: () => {
        alert('Employee deleted successfully');
        this.router.navigate(['/admin']);
      },
      error: (err: any) => alert('Delete failed: ' + (err.error?.error || err.message))
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
