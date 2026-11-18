import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../services/data.service';
import { Olympic } from '../../models/olympic.model';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {

  public titlePage: string = '';
  public totalEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public loadState: 'loading' | 'ready' | 'empty' | 'error' = 'loading';
  public years: string[] = [];
  public medals: number[] = [];

  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadCountry();
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  private loadCountry(): void {
    this.routeSubscription = combineLatest([
      this.route.paramMap,
      this.dataService.getOlympics()
    ]).subscribe({
      next: ([params, countries]) => {
        this.handleCountryData(params.get('id'), countries);
      },
      error: () => this.handleCountryError()
    });
  }

  private handleCountryData(id: string | null, countries: Olympic[]): void {
    if (!countries?.length) {
      this.loadState = 'empty';
      return;
    }

    const selectedCountry = this.findCountry(id, countries);

    if (!selectedCountry) {
      this.router.navigate(['/not-found']);
      return;
    }

    if (!selectedCountry.participations.length) {
      this.loadState = 'empty';
      return;
    }

    this.setCountryDetails(selectedCountry);
    this.loadState = 'ready';
  }

  private findCountry(id: string | null, countries: Olympic[]): Olympic | undefined {
    return countries.find(country => String(country.id) === id);
  }

  private handleCountryError(): void {
    this.loadState = 'error';
  }

  private setCountryDetails(country: Olympic): void {
    const { participations } = country;

    this.titlePage = country.country;
    this.totalEntries = participations.length;
    this.totalMedals = this.dataService.getTotalMedals(country);

    this.totalAthletes = participations.reduce(
      (total, participation) => total + participation.athleteCount,
      0
    );

    this.years = participations.map(
      participation => String(participation.year)
    );

    this.medals = participations.map(
      participation => participation.medalsCount
    );
  }
}