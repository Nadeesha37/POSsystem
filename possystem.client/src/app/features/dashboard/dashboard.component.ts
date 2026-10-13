import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  dailySales: number = 150600;
  grossProfit: number = 157200;
  transactions: number = 133;
  averageTicket: number = 20.00;
  dailySalesTrend: number = 3.95;
  grossProfitTrend: number = 28;
  avgTicketTrend: number = 5.70;

  ngOnInit(): void {
    this.renderBarChart();
    this.renderLineChart();
  }

  renderBarChart() {
    new Chart("topSellingChart", {
      type: 'bar',
      data: {
        labels: ['Item A', 'Item B', 'Item C', 'Item D'],
        datasets: [{
          label: 'Sales',
          data: [100, 100, 77, 48],
          backgroundColor: '#3b82f6', // UI
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 120 } },
        plugins: { legend: { display: false } }
      }
    });
  }

  renderLineChart() {
    new Chart("salesTrendsChart", {
      type: 'line',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Sales Trends',
          data: [12, 28, 20, 45, 23, 30, 55],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)', // fill
          fill: true,
          tension: 0.4 // curve line
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 60 } },
        plugins: { legend: { display: false } }
      }
    });
  }
}
