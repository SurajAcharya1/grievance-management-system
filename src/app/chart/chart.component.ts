import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import Chart from "chart.js/auto";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  chart: any = [];
  @Input() label!: string[];
  @Input() data!: number[];
  @Input() chartType!: 'bar' | 'bubble' | 'doughnut' | 'line' | 'pie' | 'polarArea' | 'radar' | 'scatter';
  colorMap = {
    'Positive': 'rgba(75, 192, 192, 1)',
    'Negative': 'rgb(250,80,80, 1)',
    'Neutral': 'rgba(255, 206, 86, 1)',
  }
  @Output() sentimentTypeEmitter: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
    this.initializeChart();
  }

  ngOnDestroy() {
    this.chart.destroy();
  }
  initializeChart() {
    const backgroundColor = this.label.map(value => {
      if (value in this.colorMap) {
        return this.colorMap[value as keyof typeof this.colorMap];
      }
      return 'rgba(0, 0, 0, 0)'; // Default color if not found
    });
    const data = {
      labels: this.label,
      datasets: [
        {
          label: 'Grievance Sentiment',
          data: this.data,
          backgroundColor: backgroundColor,
          borderWidth: 2,
        }
      ],
    };

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: this.chartType,
        data: data,
        options: {
          indexAxis: 'y',
          scales: {
            y: {
              beginAtZero: true,
            }
          },
          aspectRatio: 3,
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const clickedElement = elements[0];
              const datasetIndex = clickedElement.datasetIndex;
              const index = clickedElement.index;
              const label = data.labels[index];
              const labelValue = data.datasets[datasetIndex].data[index];
              this.sentimentTypeEmitter.emit(label);
            }
          }
        },
      });
    } else {
      console.error('Unable to get canvas context');
    }
  }

}
