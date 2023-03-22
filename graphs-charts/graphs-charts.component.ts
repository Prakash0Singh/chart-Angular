import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart, registerables } from 'chart.js'
import { ApiCallingService } from '../services/api-calling.service';
Chart.register(...registerables)
@Component({
  selector: 'app-graphs-charts',
  templateUrl: './graphs-charts.component.html',
  styleUrls: ['./graphs-charts.component.css']
})
export class GraphsChartsComponent implements OnInit {
  myCharts:any;
  chartName: any='barChart'
  
  constructor(private formBuilder: FormBuilder, private _chartApi: ApiCallingService, private _apiCalling: ApiCallingService) {

    this.chartForm = this.formBuilder.group({
      name: [''],
      itemName: ['', [Validators.required]],
      year: ['', [Validators.required]],
      colorCode: [''],
      purchaseCost: [''],
      saleCost: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.maxLength(7)]],
    })
  }

  // name:['',[Validators.required]],
  // itemName:['',[Validators.required]],
  // year:['',[Validators.required]],
  // colorCode:['',[Validators.required]],
  // purchaseCost:['',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.maxLength(7)]],
  // saleCost:['',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.maxLength(7)]],

  barChartData: any = [];
  labeldata: any = [];
  realdata: any = [];
  colordata: any = [];

  ngOnInit(): void {
    this.getData('bar')
  }
  getData(barType:any) {
    this.labeldata=[];
    this.colordata=[];
    this.realdata=[];
    this._chartApi.chartApiData().subscribe((data) => {
      this.barChartData = data
      if (this.barChartData != null) {

        for (let index = 0; index < this.barChartData.length; index++) {

          this.labeldata.push(this.barChartData[index].itemName)
          this.realdata.push(Number(this.barChartData[index].saleCost))
          this.colordata.push(this.barChartData[index].colorCode)
        }
        this.renderPieChart(this.labeldata, this.realdata, this.colordata, barType, "showChartHere");
      }
    })
    this.bubbleChartRender()
    this.scatterChartRender()
    this.lineChartRender()
  }

  renderPieChart(labeldata: any, maindata: any, colordata: any, type: any, id: any) {
    console.log("labeldata",labeldata);
    console.log("maindata",maindata);
    console.log("colordata",colordata);
    console.log("type",type);
    console.log("id",id);

    var chartExist = Chart.getChart("showChartHere");
    // if (chartExist != undefined) {
      chartExist?.destroy();
    // }

  
    this.myCharts =
      new Chart('showChartHere', {
        type: type,
        data: {
          labels: labeldata,
          datasets: [{
            label: 'Sale',
            data: maindata,
            borderWidth: 1,
            backgroundColor: colordata,
            borderColor: ['black']
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      this.myCharts.ty=type;
      this.myCharts.data.labels=this.labeldata;
      this.myCharts.data.datasets[0].data=this.realdata;
      this.myCharts.data.datasets[0].backgroundColor=this.colordata;
  }

  bubbleChartRender() {
    const data = {
      datasets: [{
        label: 'First Dataset',
        data: [{
          x: 20,
          y: 30,
          r: 15
        }, {
          x: 40,
          y: 10,
          r: 10
        }],
        backgroundColor: 'rgb(255, 99, 132)'
      }]
    };

    const myCharts: any = new Chart('bubbleChart', {
      type: 'bubble',
      data: data,
      options: {}
    });
  }

  scatterChartRender() {
    const data = {
      datasets: [{
        label: 'Scatter Dataset',
        data: [{
          x: -10,
          y: 0
        }, {
          x: 0,
          y: 10
        }, {
          x: 10,
          y: 5
        }, {
          x: 0.5,
          y: 5.5
        }],
        backgroundColor: 'rgb(255, 99, 132)'
      }],
    };
    const myCharts: any = new Chart('scatterChart', {
      type: 'scatter',
      data: data,
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom'
          }
        }
      }
    });
  }

  lineChartRender() {
    const data = {
      labels: this.colordata,
      datasets: [{
        label: 'Amount',
        data: this.realdata,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
    const myCharts: any = new Chart('lineChart', {

      type: 'line',
      data: data,
    })
  }

  //*To get form data 

  chartForm: FormGroup;

  //? Submiting Chart Form Function
  submitChartDetail() {
    this._apiCalling.postNewDetailChart(this.chartForm.value).subscribe((data) => {
      console.log(data, "Update-------------->");
      this.chartForm.reset();
      this.showthisTypeChart(this.chartName)
    })
  }
  // ! radio button array of object

  radioBttons: any[] = [
    { id: 'bargraph', label: 'Bar Graph', type: 'bar', chec: true },
    { id: 'piechart', label: 'Pie Chart', type: 'pie', chec: false },
    { id: 'DoughnutChart', label: 'Doughnut Chart', type: 'doughnut', chec: false },
    { id: 'RadarChart', label: 'Radar Chart', type: 'radar', chec: false },
    { id: 'PolarAreaChart', label: 'Polar Area Chart', type: 'polarArea', chec: false }
  ]

  // ! different charts array of object

  showthisTypeChart(event: any) {
    if (event == this.chartName) {

       this.chartName = event
    }
    else {
      console.log(event.target);
    this.chartName = event.target.id
      console.log(event.target.checked, "You Clicked -", event.target.id);
    }

    this.radioBttons.filter(data => {
      if (data.id == this.chartName) {
        this.getData(data.type);
      }
    })
  }

}
