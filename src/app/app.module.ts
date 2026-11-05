import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryComponent } from "./pages/country/country.component";
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { MedalChartComponent } from './components/medal-chart/medal-chart.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, CountryComponent, StatsCardComponent, MedalChartComponent, HeaderComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
