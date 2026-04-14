import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: false
})
export class AdminDashboardComponent implements OnInit {
  activeSection: string = 'departments';
  data: any[] = [];
  loading = false;
  searchTerm: string = '';
  
  // Sort State
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Modal State
  showModal = false;
  isEditing = false;
  modalEntity: any = {};
  saving = false;

  // Reference catalogs for dropdowns
  allDepartments: any[] = [];
  allEmployees: any[] = [];
  allDepartmentHeads: any[] = [];
  allProjects: any[] = [];

  // Dropdown configs per entity field
  dropdownOptions: { [field: string]: { value: any, label: string }[] } = {};

  sections = [
    { key: 'employees',       label: 'Employees',        icon: 'users',      endpoint: '/apix/employees' },
    { key: 'departments',     label: 'Departments',      icon: 'building',   endpoint: '/apix/departments' },
    { key: 'department-heads', label: 'Department Heads', icon: 'briefcase',  endpoint: '/apix/department-heads' },
    { key: 'projects',        label: 'Projects',         icon: 'folder',     endpoint: '/apix/projects' },
    { key: 'responsibilities', label: 'Responsibilities', icon: 'clipboard',  endpoint: '/apix/responsibilities' },
    { key: 'clients',         label: 'Clients',          icon: 'handshake',  endpoint: '/apix/clients' },
    { key: 'salaries',        label: 'Salaries',         icon: 'wallet',     endpoint: '/apix/salaries' },
    { key: 'shifts',          icon: 'clock',      label: 'Shifts',           endpoint: '/apix/shifts' },
    { key: 'timesheets',      label: 'Timesheets',       icon: 'clipboard',  endpoint: '/apix/timesheets' },
    { key: 'leaves',          label: 'Leave Requests',   icon: 'calendar',   endpoint: '/apix/leaves' },
    { key: 'leave-types',     label: 'Leave Types',      icon: 'bookmark',   endpoint: '/apix/leave-types' },
    { key: 'tasks',           label: 'Tasks',            icon: 'check',      endpoint: '/apix/tasks' },
    { key: 'training-programs', label: 'Training Programs', icon: 'book',    endpoint: '/apix/training-programs' },
    { key: 'employee-trainings', label: 'Enrollments',   icon: 'graduate',   endpoint: '/apix/employee-trainings' },
    { key: 'training-feedbacks', label: 'Training Feedback', icon: 'message', endpoint: '/apix/training-feedbacks' },
    { key: 'evaluations',     label: 'Evaluations',      icon: 'chart',      endpoint: '/apix/performance-evaluations' },
    { key: 'perf-feedback',   label: 'Perf. Feedback',   icon: 'edit',       endpoint: '/apix/performance-feedbacks' },
  ];

  iconPaths: { [key: string]: string } = {
    users:     'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    building:  'M3 21h18M3 7v14M21 7v14M6 11h.01M6 15h.01M6 7h.01M10 11h.01M10 15h.01M10 7h.01M14 11h.01M14 15h.01M14 7h.01M18 11h.01M18 15h.01M18 7h.01M3 7l9-4 9 4',
    briefcase: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2',
    folder:    'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
    handshake: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 11l2 2 4-4',
    wallet:    'M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0z',
    clock:     'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2',
    bookmark:  'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
    check:     'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
    clipboard: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z',
    calendar:  'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18',
    book:      'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z',
    graduate:  'M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5',
    message:   'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    chart:     'M18 20V10M12 20V4M6 20v-6',
    edit:      'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
    trash:     'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    plus:      'M12 5v14M5 12h14'
  };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadReferenceData();
      this.loadSection('employees');
    }
  }

  loadReferenceData(): void {
    this.http.get<any[]>('/apix/departments').subscribe({
      next: (res) => {
        this.allDepartments = res;
        this.buildDropdownOptions(this.activeSection);
      },
      error: () => {}
    });
    this.http.get<any[]>('/apix/employees').subscribe({
      next: (res) => {
        this.allEmployees = res;
        this.buildDropdownOptions(this.activeSection);
      },
      error: () => {}
    });
    this.http.get<any[]>('/apix/department-heads').subscribe({
      next: (res) => {
        this.allDepartmentHeads = res;
        this.buildDropdownOptions(this.activeSection);
      },
      error: () => {}
    });
    this.http.get<any[]>('/apix/projects').subscribe({
      next: (res) => {
        this.allProjects = res;
        this.buildDropdownOptions(this.activeSection);
      },
      error: () => {}
    });
  }

  loadSection(key: string): void {
    this.activeSection = key;
    this.loading = true;
    this.searchTerm = '';
    this.sortColumn = '';
    this.data = [];
    this.buildDropdownOptions(key);

    const section = this.sections.find(s => s.key === key);
    if (!section) return;

    this.http.get<any[]>(section.endpoint).subscribe({
      next: (res: any[]) => {
        this.data = res;
        if (this.data.length > 0) {
          const idKey = this.getIdKey(this.data[0]);
          if (idKey) {
            this.sortColumn = idKey;
            this.sortDirection = 'asc';
          }
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error(`Failed to load ${key}`, err);
        this.data = [];
        this.loading = false;
      }
    });
  }

  buildDropdownOptions(sectionKey: string): void {
    this.dropdownOptions = {};
    
    if (sectionKey === 'employees') {
      this.dropdownOptions['departmentId'] = this.allDepartments.map(d => ({
        value: d.departmentId,
        label: `${d.departmentName} (ID: ${d.departmentId})`
      }));
      this.dropdownOptions['headRole'] = [
        { value: 'Manager', label: 'Manager' },
        { value: 'Director', label: 'Director' },
        { value: 'VP', label: 'VP' },
        { value: 'Senior Manager', label: 'Senior Manager' },
        { value: 'Chief Officer', label: 'Chief Officer' },
        { value: 'CTO', label: 'CTO' },
        { value: 'Sales Lead', label: 'Sales Lead' },
        { value: 'Engineering Head', label: 'Engineering Head' }
      ];
    }
    
    if (sectionKey === 'departments') {
      this.dropdownOptions['headId'] = this.allDepartmentHeads.map(h => ({
        value: h.headId,
        label: `${h.headRole} (ID: ${h.headId})`
      }));
    }
    
    if (sectionKey === 'employee-trainings') {
      this.dropdownOptions['grade'] = [
        { value: 'A', label: 'A' }, { value: 'B', label: 'B' },
        { value: 'C', label: 'C' }, { value: 'D', label: 'D' }, { value: 'F', label: 'F' }
      ];
      this.dropdownOptions['status'] = [
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Failed', label: 'Failed' },
        { value: 'Withdrawn', label: 'Withdrawn' }
      ];
    }
    if (sectionKey === 'department-heads') {
      this.dropdownOptions['headRole'] = [
        { value: 'Manager', label: 'Manager' },
        { value: 'Director', label: 'Director' },
        { value: 'VP', label: 'VP' },
        { value: 'Senior Manager', label: 'Senior Manager' },
        { value: 'Chief Officer', label: 'Chief Officer' },
        { value: 'CTO', label: 'CTO' },
        { value: 'Sales Lead', label: 'Sales Lead' },
        { value: 'Engineering Head', label: 'Engineering Head' }
      ];
    }
    if (sectionKey === 'responsibilities') {
      this.dropdownOptions['employeeId'] = this.allEmployees.map(e => ({
        value: e.employeeId,
        label: `${e.employeeName} (ID: ${e.employeeId})`
      }));
      this.dropdownOptions['projectId'] = this.allProjects.map(p => ({
        value: p.projectId,
        label: `${p.projectName} (ID: ${p.projectId})`
      }));
      this.dropdownOptions['responsibilityType'] = [
        { value: 'Developer', label: 'Developer' },
        { value: 'Tester', label: 'Tester' },
        { value: 'Analyst', label: 'Analyst' },
        { value: 'Designer', label: 'Designer' },
        { value: 'Team Lead', label: 'Team Lead' },
        { value: 'Project Manager', label: 'Project Manager' }
      ];
      this.dropdownOptions['clearanceLevel'] = [
        { value: 'Level 1', label: 'Level 1' },
        { value: 'Level 2', label: 'Level 2' },
        { value: 'Level 3', label: 'Level 3' },
        { value: 'Confidential', label: 'Confidential' }
      ];
    }
  }

  isDropdownField(key: string): boolean {
    return key in this.dropdownOptions;
  }

  getDropdownOptions(key: string): { value: any, label: string }[] {
    return this.dropdownOptions[key] || [];
  }

  // Sort
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  get filteredData(): any[] {
    let result = this.data;

    // Filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter((item: any) => {
        return Object.values(item).some((val: any) => 
          String(val).toLowerCase().includes(term)
        );
      });
    }

    // Sort
    if (this.sortColumn) {
      result = [...result].sort((a: any, b: any) => {
        const valA = this.getNestedValue(a, this.sortColumn);
        const valB = this.getNestedValue(b, this.sortColumn);
        
        if (valA == null && valB == null) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;
        
        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else {
          comparison = String(valA).localeCompare(String(valB));
        }
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    return result;
  }

  deleteRecord(id: any): void {
    if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;
    
    const section = this.sections.find(s => s.key === this.activeSection);
    if (!section) return;

    this.http.delete(`${section.endpoint}/${id}`).subscribe({
      next: () => {
        this.data = this.data.filter((item: any) => {
          const idKey = this.getIdKey(item);
          return item[idKey] !== id;
        });
      },
      error: (err: any) => alert('Failed to delete record: ' + (err.error?.error || err.message))
    });
  }

  // MODAL LOGIC
  openCreateModal(): void {
    this.isEditing = false;
    this.modalEntity = {};

    if (this.data.length > 0) {
      const sample = this.data[0];
      Object.keys(sample).forEach(k => {
        const val = sample[k];
        if (val === null || val === undefined || typeof val !== 'object') {
          this.modalEntity[k] = null;
        }
      });
      const idKey = this.getIdKey(sample);
      if (idKey) {
        // DO NOT pre-fill IDs for new records since they are generated by DB
        delete this.modalEntity[idKey];
      }
      
      // Inject proxies
      if (this.activeSection === 'employees') {
        this.modalEntity['departmentId'] = '';
        this.modalEntity['headRole'] = '';
      }
      if (this.activeSection === 'departments') {
        this.modalEntity['headId'] = '';
      }
      if (this.activeSection === 'responsibilities') {
        this.modalEntity['employeeId'] = '';
        this.modalEntity['projectId'] = '';
      }
    }
    this.showModal = true;
  }

  openEditModal(item: any): void {
    this.isEditing = true;
    this.modalEntity = {};
    Object.keys(item).forEach(k => {
      const val = item[k];
      if (val === null || val === undefined || typeof val !== 'object') {
        this.modalEntity[k] = val;
      }
    });

    // Inject proxies
    if (this.activeSection === 'employees') {
      this.modalEntity['departmentId'] = item.department?.departmentId || '';
      this.modalEntity['headRole'] = item.departmentHeadRole?.headRole || '';
    }
    if (this.activeSection === 'departments') {
      this.modalEntity['headId'] = item.departmentHead?.headId || '';
    }
    if (this.activeSection === 'responsibilities') {
      this.modalEntity['employeeId'] = item.employee?.employeeId || '';
      this.modalEntity['projectId'] = item.project?.projectId || '';
    }

    this.showModal = true;
  }

  getModalKeys(): string[] {
    if (!this.modalEntity) return [];
    return Object.keys(this.modalEntity);
  }

  closeModal(): void {
    this.showModal = false;
    this.modalEntity = {};
  }

  saveRecord(): void {
    const section = this.sections.find(s => s.key === this.activeSection);
    if (!section) return;

    this.saving = true;
    
    // Format payload proxies
    const payload = { ...this.modalEntity };
    if (this.activeSection === 'employees') {
      if (payload.departmentId !== undefined) {
        if (payload.departmentId) payload.department = { departmentId: payload.departmentId };
        delete payload.departmentId;
      }
      if (payload.headRole !== undefined) {
        if (payload.headRole) payload.departmentHeadRole = { headRole: payload.headRole };
        delete payload.headRole;
      }
    }
    if (this.activeSection === 'departments') {
      if (payload.headId !== undefined) {
        if (payload.headId) payload.departmentHead = { headId: payload.headId };
        delete payload.headId;
      }
    }
    if (this.activeSection === 'responsibilities') {
      if (payload.employeeId !== undefined) {
        if (payload.employeeId) payload.employee = { employeeId: payload.employeeId };
        delete payload.employeeId;
      }
      if (payload.projectId !== undefined) {
        if (payload.projectId) payload.project = { projectId: payload.projectId };
        delete payload.projectId;
      }
    }

    if (this.isEditing) {
      const idKey = this.getIdKey(this.modalEntity);
      const id = this.modalEntity[idKey];
      this.http.patch(`${section.endpoint}/${id}`, payload).subscribe({
        next: () => {
          this.closeModal();
          this.saving = false;
          // Reload section to fetch fully materialized relations (e.g. department names)
          this.loadSection(this.activeSection);
        },
        error: (err: any) => {
          alert('Failed to update: ' + (err.error?.error || err.message));
          this.saving = false;
        }
      });
    } else {
      this.http.post(section.endpoint, payload).subscribe({
        next: () => {
          this.closeModal();
          this.saving = false;
          this.loadSection(this.activeSection);
        },
        error: (err: any) => {
          alert('Failed to create: ' + (err.error?.error || err.message));
          this.saving = false;
        }
      });
    }
  }

  getIdKey(item: any): string {
    if ('employeeId' in item) return 'employeeId';
    if ('departmentId' in item) return 'departmentId';
    if ('headId' in item) return 'headId';
    if ('projectId' in item) return 'projectId';
    if ('clientId' in item) return 'clientId';
    if ('salaryId' in item) return 'salaryId';
    if ('shiftId' in item) return 'shiftId';
    if ('timesheetId' in item) return 'timesheetId';
    if ('leaveId' in item) return 'leaveId';
    if ('trainingId' in item) return 'trainingId';
    if ('employeeTrainingId' in item) return 'employeeTrainingId';
    if ('feedbackId' in item) return 'feedbackId';
    if ('evaluationId' in item) return 'evaluationId';
    return Object.keys(item)[0];
  }

  get activeLabel(): string {
    return this.sections.find(s => s.key === this.activeSection)?.label || '';
  }

  getKeys(obj: any): string[] {
    if (!this.data || this.data.length === 0) return [];
    
    // Instead of relying purely on obj (first row), scan until we find non-null representative structure
    // We basically build a superset of keys or find the most complete object
    const sample = this.data.find(d => Object.keys(d).length > 0) || obj;
    if (!sample) return [];

    const keys: string[] = [];
    Object.keys(sample).forEach(k => {
      // Find the first non-null occurrence of this field in the entire dataset
      const firstNonNullItem = this.data.find(d => d[k] !== null && d[k] !== undefined);
      const val = firstNonNullItem ? firstNonNullItem[k] : sample[k];

      if (val === null || val === undefined || typeof val !== 'object') {
        keys.push(k);
      } else if (typeof val === 'object' && !Array.isArray(val)) {
        const nested = val as any;
        const idKey = Object.keys(nested).find(nk => nk.toLowerCase().endsWith('id'));
        if (idKey) keys.push(`${k}.${idKey}`);
        const nameKey = Object.keys(nested).find(nk => nk.toLowerCase().endsWith('name'));
        if (nameKey) keys.push(`${k}.${nameKey}`);
        const roleKey = Object.keys(nested).find(nk => nk.toLowerCase().endsWith('role'));
        if (roleKey) keys.push(`${k}.${roleKey}`);
      }
    });
    // Remove duplicates and filter out redundant ID mappings embedded inside one-to-one nested relations
    return [...new Set(keys)].filter(k => k !== 'positionDetails.employeeId');
  }

  getNestedValue(obj: any, key: string): any {
    let val = obj;
    if (!key.includes('.')) {
      val = obj[key];
    } else {
      const parts = key.split('.');
      for (const part of parts) {
        if (val == null) return '—';
        val = val[part];
      }
    }
    
    // Globally prevent [object Object] DOM leakage
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      return val.headRole || val.programName || val.departmentName || val.employeeName || val.name || val.role || val.title || val.status || JSON.stringify(val);
    }
    return val;
  }

  formatHeader(key: string): string {
    const lastPart = key.includes('.') ? key.split('.').pop()! : key;
    return lastPart.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }
}
