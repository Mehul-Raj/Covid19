import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
 // baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  //get Deaths and Recoveries
  getdethAndRecovery(): Observable<any> {
    return this.http.get('https://api.covid19india.org/data.json');
  }
}
