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
  public loadState: 'loading' | 'ready' | 'empty' | 'error' = 'loading';
  public titlePage: string = "Medals per Country";
  public countries: string[] = [];
  public medals: number[] = [];
  private olympics: Olympic[] = [];

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getOlympics().subscribe({
      next: (data) => {
        if (!data?.length) {
          this.loadState = 'empty';
          return;
        } 

        this.olympics = data;
        this.totalCountries = data.length;
        this.totalJOs = new Set(
          data.flatMap(country =>
            country.participations.map(participation => participation.year)
          )
        ).size;
        this.countries = data.map(country => country.country);
        this.medals = data.map(country =>
          country.participations.reduce(
            (total, participation) => total + participation.medalsCount,
            0
          )
        );

      this.loadState = 'ready';
      },
      error: () => {
        this.loadState = 'error';
      }
    });
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

