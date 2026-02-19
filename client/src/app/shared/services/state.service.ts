import { Injectable, Inject } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class StateService {
  private dataVar = null;

  set data (data: any) { 
    this.dataVar = data;
  }

  get data() { 
     const temp = this.dataVar;
     //this.dataVar = null; 
     return temp;
  }
 
}
 