import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Olympic } from '../../models/olympic.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public totalCountries: number = 0;
  public totalJOs: number = 0;
  public error!:string;
  public titlePage: string = "Medals per Country";
  public countries: string[] = [];
  public medals: number[] = [];
  private olympics: Olympic[] = [];

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getOlympics().subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.totalJOs = new Set(data.flatMap(country => country.participations.map(p => p.year))).size;
          this.totalCountries = data.length;
          this.countries = data.map(country => country.country);
          this.medals = data.map(country => country.participations.reduce((total, p) => total + p.medalsCount, 0));
          this.olympics = data;
        }
      },
      (error:HttpErrorResponse) => {
        this.error = error.message;
      }
    )
  }

  onCountrySelected(countryName: string): void {
    const selectedCountry = this.olympics.find(
      country => country.country === countryName
    );
    if (selectedCountry) {
      this.router.navigate(['/country', selectedCountry.id]);
    }
  }

}

