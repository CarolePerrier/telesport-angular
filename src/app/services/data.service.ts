import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Olympic } from '../models/olympic.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly olympicUrl = './assets/mock/olympic.json';

  constructor(private http: HttpClient) {}
    getOlympics(): Observable<Olympic[]> {
      return this.http.get<Olympic[]>(this.olympicUrl);
    }
    getTotalMedals(country: Olympic): number {
      return country.participations.reduce(
        (total, participation) => total + participation.medalsCount, 0
      );
    }
}
