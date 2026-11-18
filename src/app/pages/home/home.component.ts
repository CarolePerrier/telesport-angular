import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DataService } from '../../services/data.service';
import { Olympic } from '../../models/olympic.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  public totalCountries: number = 0;
  public totalJOs: number = 0;
  public loadState: 'loading' | 'ready' | 'empty' | 'error' = 'loading';
  public titlePage: string = 'Medals per Country';
  public countries: string[] = [];
  public medals: number[] = [];

  protected olympics: Olympic[] = [];

  private olympicsSubscription?: Subscription;

  constructor(
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadOlympics();
  }

  ngOnDestroy(): void {
    this.olympicsSubscription?.unsubscribe();
  }

  private loadOlympics(): void {
    this.olympicsSubscription = this.dataService.getOlympics().subscribe({
      next: (data) => this.handleOlympicsData(data),
      error: () => this.handleOlympicsError()
    });
  }

  private handleOlympicsData(data: Olympic[]): void {
    if (!data?.length) {
      this.loadState = 'empty';
      return;
    }

    this.setDashboardDetails(data);
    this.loadState = 'ready';
  }

  private handleOlympicsError(): void {
    this.loadState = 'error';
  }

  private setDashboardDetails(olympics: Olympic[]): void {
    this.olympics = olympics;

    this.totalCountries = olympics.length;

    const editionYears = new Set(
      olympics.flatMap(country =>
        country.participations.map(participation => participation.year)
      )
    );

    this.totalJOs = editionYears.size;

    this.countries = olympics.map(country => country.country);

    this.medals = olympics.map(country =>
      this.dataService.getTotalMedals(country)
    );
  }

  public onSliceSelected(index: number): void {
    const country = this.olympics[index];

    if (country) {
      this.router.navigate(['/country', country.id]);
    }
  }
}