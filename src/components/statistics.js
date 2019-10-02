import {AbstractComponent} from './abstract-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getTotalCost, tripPointTypes} from '../utils.js';
const EURO = String.fromCharCode(8364);
const DIAGRAM_COLOR = `white`;

export class Statistics extends AbstractComponent {
  getTemplate() {
    return `<section class="statistics">
              <h2 class="visually-hidden">Trip statistics</h2>

              <div class="statistics__item statistics__item--money">
                <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
              </div>

              <div class="statistics__item statistics__item--transport">
                <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
              </div>

              <div class="statistics__item statistics__item--time-spend">
                <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
              </div>
            </section>`;
  }

  color() {
    return `white`;
  }

  buildChart(points) {
    const pointTypes = points.map(({type})=>type);
    const unicTypes = pointTypes.filter((type, pos)=>pointTypes.indexOf(type) === pos);
    this._buildMoneyChart(points, unicTypes, getTotalCost);
    this._buildTransportChart(points, unicTypes);
  }

  _buildMoneyChart(points, unicTypes) {
    const sum = [];
    unicTypes.forEach((pointType)=>{
      sum.push(getTotalCost(points.filter(({type}) => type === pointType)));
    });
    const ctx = document.querySelector(`.statistics__chart--money`).getContext(`2d`);
    const moneyChart = new Chart(ctx, {
      type: `horizontalBar`,
      data: {
        labels: unicTypes,
        datasets: [{
          data: sum,
          backgroundColor: DIAGRAM_COLOR,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            anchor: `end`,
            align: `start`,
            formatter: (value) =>{
              return `${EURO} ${value}`;
            }
          }},
        legend: {
          display: false
        },
        title: {
          display: true,
          text: `MONEY`,
          position: `left`},
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  _buildTransportChart(points, unicTypes) {
    const transports = [];
    const quantity = [];

    unicTypes.forEach((type)=>{
      const pointType = tripPointTypes.filter(({name})=>name === type)[0];
      if (pointType.move) {
        transports.push(pointType.name);
      }
    });

    transports.forEach((transport)=>{
      quantity.push(points.filter(({type})=>type === transport).length);
    });


    const ctx = document.querySelector(`.statistics__chart--transport`).getContext(`2d`);
    const transportChart = new Chart(ctx, {
      type: `horizontalBar`,
      data: {
        labels: transports,
        datasets: [{
          data: quantity,
          backgroundColor: DIAGRAM_COLOR,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            anchor: `end`,
            align: `start`,
            formatter: (value) =>{
              return `${value}x`;
            }
          }},
        legend: {
          display: false
        },
        title: {
          display: true,
          text: `TRANSPORT`,
          position: `left`},
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

  }

}
