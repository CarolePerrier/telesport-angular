import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DataService } from '../../services/data.service';
import { combineLatest, Subscription } from 'rxjs';


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

constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
  this.routeSubscription = combineLatest([
    this.route.paramMap,
    this.dataService.getOlympics()
  ]).subscribe({
    next: ([params, countries]) => {
      if (!countries?.length) {
        this.loadState = 'empty';
        return;
      }
      const id = params.get('id');
      const selectedCountry = countries.find(
        country => String(country.id) === id
      );

      if (!selectedCountry) {
        this.router.navigate(['/not-found']);
        return;
      }

      const participations = selectedCountry.participations;
      if (!participations.length) {
        this.loadState = 'empty';
        return;
      }
      this.titlePage = selectedCountry.country;
      this.totalEntries = participations.length;
      this.years = participations.map(participation => String(participation.year));
      this.medals = participations.map(participation => participation.medalsCount);
      this.totalMedals = this.medals.reduce((total, count) => total + count, 0);
      this.totalAthletes = participations.reduce(
        (total, participation) => total + participation.athleteCount,
        0
      );
      this.loadState = 'ready';
    },
    error: () => {
      this.loadState = 'error';
    }
  });
}

ngOnDestroy(): void {
  this.routeSubscription?.unsubscribe();
}

}
