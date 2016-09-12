import { Component, OnInit, NgZone} from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

declare var google: any;

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.html',
	  styleUrls: ['app/app.css']
})

export class AppComponent implements OnInit{

  orientUrl = "/command/geo/"
  orientUser = "admin"
  orientPassword = "admin"


	map: any;
	query = "select from V";

  lat: string;
  lon: string;
  personName: string;

  constructor(private http: Http, private zone: NgZone) { }

	ngOnInit(): void {
    var controller = this;
		var mapProp = {
            center: new google.maps.LatLng(52.2316019, 19.5103393),
            zoom: 7,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      var map = new google.maps.Map(document.getElementById("map"), mapProp);

      map.addListener("click", function(point: any){
        controller.zone.run(()=> {
          controller.lat = ""+point.latLng.lat();
          controller.lon = ""+point.latLng.lng();
        });
      });
	}

	executeQuery(): void {
    this.orientCommand(
      this.query,
      function(data){ console.log(data) },
      function(e){console.log(e)}
    )
	}

  orientCommand(statement: string, success: (data: any) => void, error: (err: any) => void): void{
    var url = this.orientUrl + "sql/-/100"

    var headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(this.orientUser+":"+this.orientPassword));
    this.http.post(
                  url,
                  JSON.stringify({
                    "command": this.query
                  }),
                  {headers: headers}
        ).toPromise()
         .then(success)
         .catch(error);
  }


  addPerson(): void{

  }

}
