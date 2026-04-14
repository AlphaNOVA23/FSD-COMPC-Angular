import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from '../core/services/employee.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  standalone: false
})
export class MyProfileComponent implements OnInit {
  employee: any = null;
  loading = true;
  error = false;
  peers: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private http: HttpClient, // Need for generic fetches
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.employeeService.getMyProfile().subscribe({
        next: (data) => {
          this.employee = data;
          this.loading = false;
          if (this.employee.department) {
            this.loadPeers(this.employee.department.departmentId);
          }
        },
        error: (err) => {
          console.error('Failed to load profile', err);
          this.error = true;
          this.loading = false;
        }
      });
    }
  }

  loadPeers(deptId: number): void {
    this.http.get<any[]>(`/apix/departments/${deptId}/employees`).subscribe({
      next: (res: any[]) => {
        // Exclude self
        this.peers = res.filter((p: any) => p.employeeId !== this.employee.employeeId);
      }
    });
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
    window.location.href = '/auth/login';
  }
}
