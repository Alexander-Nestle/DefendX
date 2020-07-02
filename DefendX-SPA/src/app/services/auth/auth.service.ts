import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { AuthUser } from 'src/app/models/authUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
 // private cachedRequests: Array<HttpRequest<any>> = [];

  constructor(
    private http: HttpClient
  ) { }

  public login(): Observable<AuthUser> {
    return this.http.get<AuthUser>(this.baseUrl + 'auth');
  }
}
