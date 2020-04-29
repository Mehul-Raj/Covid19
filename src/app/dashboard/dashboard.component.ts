import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../service/dashboard.service';
import { Subscription } from 'rxjs';
import { StorageService } from '../../app/service/storage.service';
import * as Chart from 'chart.js';
import { State } from '../shared/State';
import { MatTableDataSource, } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public dethAndRecoverySubscription$: Subscription;
  public totalData: string[];
  public statewise: string[];
  public statewise_length: number;
  public todaysData: any;
  public totalCase: number;
  public totalrecovered: number;
  public totaldeceased: number;
  public totalActive: number;
  public dailyconfirmed: number;
  public dailyrecovered: number;
  public dailydeceased: number;
  public totalActiveNumber = [];
  public totalActiveDate = [];
  public stateList: Array<State> = [];
  public stateListGraph: Array<State> = [];
  public dataSource: any;
  public displayedColumns: string[]
  public testedDate = [];
  public testedNumber = [];
  stateNames: string;
  showGraph: boolean = false;
  setMessage: any = {};
  canvas: any;
  ctx: any;

  _state: string;
  _active: number;
  _confirmed: number;
  _deaths: number;
  _recovered: number;

  constructor(
    private _dethAndRecoveryService: DashboardService,
    private _storage: StorageService
  ) { }

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.dethAndRecoverySubscription$ = this._dethAndRecoveryService.getdethAndRecovery().subscribe(resp => {
      //Total Data Set
      this.totalData = resp;
      console.log(this.totalData);

      //Date wise Data
      this.statewise = resp.statewise;
      //console.log(this.cases_time_series)

      //Length of DateWise Data Array
      this.statewise_length = this.statewise.length;
      //console.log(this.cases_time_series_length)

      //Todays Updates
      this.todaysData = this.statewise[0]
      //console.log(this.todaysData);

      //Total Confirmed Case
      this.totalCase = this.todaysData.confirmed;

      //Total Recovered
      this.totalrecovered = this.todaysData.recovered;

      //Total Deceased
      this.totaldeceased = this.todaysData.deaths;

      //Total Active 
      this.totalActive = this.todaysData.active;

      //New Case
      this.dailyconfirmed = this.todaysData.deltaconfirmed;

      //New Recovered
      this.dailyrecovered = this.todaysData.deltarecovered;

      //New Death
      this.dailydeceased = this.todaysData.deltadeaths;


      //Total Data Graph
      for (let i = 52; i < resp.cases_time_series.length; i++) {
        this.totalActiveNumber.push(resp.cases_time_series[i].totalconfirmed);
        this.totalActiveDate.push(resp.cases_time_series[i].date);
      }

      //Total Tested Date
      for (let k = 12; k < resp.tested.length; k++) {
        if (resp.tested[k].totalsamplestested > 0 ) {
          this.testedNumber.push(resp.tested[k].totalsamplestested);
          let dateString: string = resp.tested[k].updatetimestamp;
          dateString = dateString.slice(0, 5);
          this.testedDate.push(dateString);
        }
      }

      //State Data Graph
      for (let j = 1; j < resp.statewise.length; j++) {
        let stateObj = new State();
        stateObj.active = resp.statewise[j].active;
        stateObj.confirmed = resp.statewise[j].confirmed;
        stateObj.deaths = resp.statewise[j].deaths;
        stateObj.recovered = resp.statewise[j].recovered;
        stateObj.state = resp.statewise[j].state;

        //Add Label
        this.stateList.push(stateObj);

        //Without Lebel
        /*  if (resp.statewise[j].confirmed > 0) {
           this.stateList.push(stateObj);
         } */
      }
      //State Table 
      this.displayedColumns = ['states', 'confirmed', 'active', 'recovered', 'deaths'];
      this.dataSource = new MatTableDataSource(this.stateList);
      this.dataSource.paginator = this.paginator;



      //Graph For Total Data
      this.canvas = document.getElementById('myChart');
      this.ctx = this.canvas.getContext('2d');
      let myChart = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: ["Active", "Recovered", "Death"],
          datasets: [{
            label: 'Total Case',
            data: [this.totalActive, this.totalrecovered, this.totaldeceased],
            backgroundColor: [
              '#0275d8',
              '#5cb85c',
              '#d9534f'
            ],
            borderWidth: 3
          }]
        },
        options: {
          responsive: false,
          display: true
        }
      });

      //Graph For Curve
      this.canvas = document.getElementById('myChart2');
      this.ctx = this.canvas.getContext('2d');
      let myChart2 = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: this.totalActiveDate,
          datasets: [{
            label: 'Total cases.',
            data: this.totalActiveNumber,
            backgroundColor: 'blue',
            borderWidth: 3
          }]
        },
        options: {
          legend: {
            display: false
          },
          responsive: false,
          display: true
        }
      });


      //Total Tessted Graph
      //Graph For Curve
      this.canvas = document.getElementById('myChart3');
      this.ctx = this.canvas.getContext('2d');
      let myCharrt3 = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: this.testedDate,
          datasets: [{
            label: 'Total Tested.',
            data: this.testedNumber,
            backgroundColor: 'blue',
            borderWidth: 3
          }]
        },
        options: {
          legend: {
            display: false
          },
          responsive: false,
          display: true
        }
      });


    },
      err => {
        this.setMessage = { message: 'Server Error /Server Unreachable!', error: true };
      })
  }

  //Show Graph Of State
  show(state: string) {
    this.stateListGraph.splice(0, this.stateListGraph.length);
    this.stateNames = state;
    for (let j = 0; j < this.stateList.length; j++) {
      if (this.stateList[j].state.toUpperCase() == this.stateNames.toUpperCase()) {
        let stateGraphObj = new State();
        stateGraphObj.active = this.stateList[j].active;
        stateGraphObj.confirmed = this.stateList[j].confirmed;
        stateGraphObj.deaths = this.stateList[j].deaths;
        stateGraphObj.recovered = this.stateList[j].recovered;
        stateGraphObj.state = this.stateList[j].state;
        this.stateListGraph.push(stateGraphObj);
      }
    }

    //Graph For State Data
    this.canvas = document.getElementById('stateGraph');
    this.ctx = this.canvas.getContext('2d');
    let stateGraph = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: ["Active", "Recovered", "Death"],
        datasets: [{
          label: this.stateListGraph[0].state,
          data: [this.stateListGraph[0].active, this.stateListGraph[0].recovered, this.stateListGraph[0].deaths],
          backgroundColor: [
            '#0275d8',
            '#5cb85c',
            '#d9534f'
          ],
          borderWidth: 3
        }]
      },
      options: {
        responsive: false,
        display: true
      }
    });
  }

  ngAfterViewInit() {

  }

}