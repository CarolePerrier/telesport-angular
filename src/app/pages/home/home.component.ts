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
  protected olympics: Olympic[] = [];

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getOlympics().subscribe({
      next: (data) => {
        if (!data?.length) {
          this.loadState = 'empty';
          return;
        } 
        this.setDashboardDetails(data);
        this.loadState = 'ready';
      },
      error: () => {
        this.loadState = 'error';
      }
    });
  }

  onSliceSelected(index: number): void {
    const country = this.olympics[index];
    if (country) {
      this.router.navigate(['/country', country.id]);
    }
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
    this.medals = olympics.map(country => this.dataService.getTotalMedals(country));
  }
}

