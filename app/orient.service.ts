import {Injectable} from "@angular/core";
import { Headers, Http } from '@angular/http';

@Injectable()
export class OrientService {

  url = "/command/geo/"
  username = "admin";
  password = "admin";

  constructor(private http: Http){}

  command(statement: string, success: (data: any) => void, error: (err: any) => void): void{
    // TODO
  }

}
