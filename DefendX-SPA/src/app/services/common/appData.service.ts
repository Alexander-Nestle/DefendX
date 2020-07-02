import { Injectable } from '@angular/core';
import { Service } from '../../models/mil/service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rank } from '../../models/mil/rank';
import { Unit } from 'src/app/models/mil/unit';
import { AccountType } from 'src/app/models/user/accountType';
import { Faq } from 'src/app/models/user/faq';

@Injectable()
export class AppDataService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }


  public GetServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.baseUrl + 'appdata/services');
  }

  public GetRanksByServiceId(serviceId: number): Observable<Rank[]>{
    return this.http.get<Rank[]>(this.baseUrl + 'appdata/ranks/' + serviceId);
  }

  public GetUnitsByName(name: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.baseUrl + 'appdata/units', { params: { 'name': name }});
  }

  public GetAccountTypes(): Observable<AccountType[]> {
    return this.http.get<AccountType[]>(this.baseUrl + 'appdata/accountTypes');
  }

  public SaveFaq(newFaq: Faq): Observable<Faq> {
    return this.http.put<Faq>(this.baseUrl + 'appdata/faqs', newFaq);
  }

  public UpdateFaq(faq: Faq): Observable<Faq> {
    return this.http.post<Faq>(this.baseUrl + 'appdata/faqs', faq);
  }

  public DeleteFaq(faq: Faq): Observable<object> {
    let params = new HttpParams();
    params = params.append('id', faq.id.toString());
    params = params.append('accounttypeid', faq.accountTypeId.toString());

    return this.http.delete(this.baseUrl + 'appdata/faqs', {params});
  }
}
