import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  setSession=(key,value):void=>{
    window.sessionStorage.setItem(key, value);
  }

 getSession=(key):any=>{
 let value=window.sessionStorage.getItem(key);
 return value;
}

 removeSession=(key):void=>{
  window.sessionStorage.removeItem(key);
}

}
