import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Olympic } from '../../models/olympic.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  public totalCountries: number = 0;
  public totalJOs: number = 0;
  public error!:string;
  public titlePage: string = "Medals per Country";
  public countries: string[] = [];
  public medals: number[] = [];

  constructor(private router: Router, private http:HttpClient) { }

  ngOnInit() {
    this.http.get<Olympic[]>(this.olympicUrl).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.totalJOs = new Set(data.flatMap(country => country.participations.map(p => p.year))).size;
          this.totalCountries = data.length;
          this.countries = data.map(country => country.country);
          this.medals = data.map(country => country.participations.reduce((total, p) => total + p.medalsCount, 0));
        }
      },
      (error:HttpErrorResponse) => {
        this.error = error.message;
      }
    )
  }

  onCountrySelected(country: string): void {
    this.router.navigate(['country', country]);
  }

}

