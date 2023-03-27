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

    //! For Auth Guard canDeactivate
    redirectingAllowed=true

  myCharts: any;
  chartName: any = 'bargraph'
  deleteUserId: number = 1;
  editUserId: number = 0;

  constructor(private formBuilder: FormBuilder, private _chartApi: ApiCallingService) {

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
  saledata: any = [];
  purchasedata: any = [];
  colordata: any = [];
  allUser: any = [];
  deletingUserName: string = '';
  showUpdateButton = false

  CurrentChartType: string = 'bar'

  ngOnInit(): void {
    this.getData('bar')

    // this.bubbleChartRender()
    // this.scatterChartRender()
    // this.lineChartRender()
  }
  getData(barType: any) {
    this.labeldata = [];
    this.colordata = [];
    this.saledata = [];
    this._chartApi.chartApiData().subscribe((data) => {
      this.barChartData = data
      this.allUser = data
      if (this.barChartData != null) {

        for (let index = 0; index < this.barChartData.length; index++) {

          this.labeldata.push(this.barChartData[index].itemName)
          this.saledata.push(Number(this.barChartData[index].saleCost))
          this.purchasedata.push(Number(this.barChartData[index].purchaseCost))
          this.colordata.push(this.barChartData[index].colorCode)
        }
        this.renderPieChart(this.labeldata, this.saledata, this.purchasedata, this.colordata, barType, "showChartHere");
      }
    })

  }

  renderPieChart(labeldata: any, saledata: any, purchasedata: any, colordata: any, type: any, id: any) {
    console.log("labeldata", labeldata);
    console.log("maindata", saledata);
    console.log("colordata", colordata);
    console.log("type", type);
    console.log("id", id);

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
            data: saledata,
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

    this.myCharts.ty = type;
    this.myCharts.data.labels = this.labeldata;
    this.myCharts.data.datasets[0].data = this.saledata;
    this.myCharts.data.datasets[0].backgroundColor = this.colordata;
  }


  //*To get form data 

  chartForm: FormGroup;

  //? Submiting Chart Form Function
  submitChartDetail() {
    this._chartApi.postNewDetailChart(this.chartForm.value).subscribe((data) => {
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
      console.log(this.chartName,"12");

      // this.getData(this.CurrentChartType);
    }
    else {
      console.log(event.target);
      this.chartName = event.target.id
      console.log(event.target.checked, "You Clicked -", event.target.id);
    }

    this.radioBttons.filter(data => {
      if (data.id == this.chartName) {
        console.log(data.type);
        this.getData(data.type);
        this.CurrentChartType = data.type
      }
    })
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
        data: this.saledata,
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

  showChart() {
    this.showUpdateButton = false
  }
  // ? To Remove && Update Api Data functions
  editData(i: any) {
    this.chartForm.patchValue({
      name: i.name,
      itemName: i.itemName,
      year: i.year,
      colorCode: i.colorCode,
      purchaseCost: i.purchaseCost,
      saleCost: i.saleCost,
    })
    this.editUserId = i.id;
    this.showUpdateButton = true
  }
  updateChartDeatils() {
    console.log("You Clicked Update Button");
    this._chartApi.putChartData(this.editUserId, this.chartForm.value).subscribe((data => {
      console.log(data);
      this.chartForm.reset()
      this.getData(this.CurrentChartType);
    }))
  }

  deleteData(id: any, name: any) {
    console.log(id);
    this.deleteUserId = id;
    console.log(name);
    this.deletingUserName = name;
  }

  confirmDelete() {
    this._chartApi.deleteChartData(this.deleteUserId).subscribe((data => {
      this.getData(this.CurrentChartType);
    }))
  }

}
