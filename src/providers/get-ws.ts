import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the GetWS provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GetWS {
  data: any;
  constructor(public http: Http) {
    this.data = null;
    console.log('Hello GetWS Provider');
  }

  load(url) {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  loadString(url) {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get(url)
        .map(res => res.text())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
}
