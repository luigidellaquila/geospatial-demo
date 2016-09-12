import {Injectable} from "@angular/core";
import { Headers, Http } from '@angular/http';

@Injectable()
export class OrientService {

  url = "/command/geo/"
  username = "admin";
  password = "admin";

  constructor(private http: Http){}

  command(statement: string, success: (data: any) => void, error: (err: any) => void): void{
    var url = this.url + "sql/-/-1"
    var headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(this.username+":"+this.password));
    this.http.post(
      url,
      JSON.stringify({
        "command": statement
      }),
      {headers: headers}
    ).toPromise()
      .then(success)
      .catch(error);
  }

}
