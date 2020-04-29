import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';


@Component({
  selector: 'app-daily-update',
  templateUrl: './daily-update.component.html',
  styleUrls: ['./daily-update.component.css']
})
export class DailyUpdateComponent implements OnInit {

  public todaysData: any;
  public newCase: number;

  constructor(private _storage: StorageService) { }

  ngOnInit() {
    this.todaysData = this._storage.getSession("todaysData");
  
  }

}
