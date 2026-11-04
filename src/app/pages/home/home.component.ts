import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

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

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getOlympics().subscribe(
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

