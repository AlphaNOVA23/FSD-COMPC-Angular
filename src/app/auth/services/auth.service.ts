import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ilogin } from '../models/ilogin';
import { Iregister } from '../models/iregister';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(userData: Iregister): Observable<any> {
    // The proxy takes care of routing /apix/... to http://localhost:8080/api/...
    return this.http.post('/apix/users', userData);
  }

  login(credentials: Ilogin): Observable<any> {
    return this.http.post('/apix/auth', credentials);
  }
}
