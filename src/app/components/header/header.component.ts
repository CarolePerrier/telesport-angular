import { Component, Input } from '@angular/core';

interface HeaderIndicator {
  label: string;
  value: number;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title = '';
  @Input() indicators: HeaderIndicator[] = [];
}
