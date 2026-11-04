import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  public titlePage: string = '';
  public totalEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public error!: string;
  public years: string[] = [];
  public medals: number[] = [];

constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {}

  ngOnInit() {
    let countryName: string | null = null;
    this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));
    this.dataService.getOlympics().subscribe(
      (data) => {
        if (data && data.length > 0) {
          const selectedCountry = data.find(country => country.country === countryName);
          if (!selectedCountry) {
            this.router.navigate(['/not-found']);
            return;
          }
          this.titlePage = selectedCountry.country;
          this.totalEntries = selectedCountry.participations.length;
          this.years = selectedCountry.participations.map(p => p.year.toString());
          this.medals = selectedCountry.participations.map(p => p.medalsCount);
          this.totalMedals = this.medals.reduce((total, count) => total + count, 0);
          this.totalAthletes = selectedCountry.participations.reduce((total, p) => total + p.athleteCount, 0);
        }
      },
      (error: HttpErrorResponse) => {
        this.error = error.message;
      }
    );
  }

}
