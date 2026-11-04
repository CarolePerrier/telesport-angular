import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-medal-chart',
  templateUrl: './medal-chart.component.html',
  styleUrls: ['./medal-chart.component.scss']
})
export class MedalChartComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() type: 'pie' | 'line' = 'pie';
  @Input() labels: string[] = [];
  @Input() values: number[] = [];

  @Output() countrySelected = new EventEmitter<string>();

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.updateChart();
  }

  ngOnChanges(): void {
    this.updateChart();
  }

  private updateChart(): void {
    if (!this.chartCanvas || this.labels.length === 0) return;

    this.chart?.destroy();

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Medals',
          data: this.values,
          backgroundColor: this.type === 'pie'
            ? ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange']
            : '#0b868f'
        }]
      },
      options: {
        aspectRatio: 2.5,
        onClick: (event) => {
          if (this.type !== 'pie' || !this.chart || !event.native) return;

          const points = this.chart.getElementsAtEventForMode(
            event.native,
            'point',
            { intersect: true },
            true
          );

          if (points.length > 0) {
            const country = this.labels[points[0].index];

            if (country) {
              this.countrySelected.emit(country);
            }
          }
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}