import { Component, OnInit} from '@angular/core';
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

  constructor(private http: Http) { }

	ngOnInit(): void {
    var controller = this;
		var mapProp = {
            center: new google.maps.LatLng(52.2316019, 19.5103393),
            zoom: 7,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      var map = new google.maps.Map(document.getElementById("map"), mapProp);

      map.addListener("click", function(point: any){
        console.log(controller.personName)
        console.log(point)
        console.log(point.latLng)
        console.log(point.latLng.lat())
        console.log(point.latLng.lng())
        alert(controller.lat)
        controller.lat = ""+point.latLng.lat();
        controller.lon = ""+point.latLng.lng();
      });
	}



	executeQuery(): void {
    this.lat = "foo";
    var url = this.orientUrl + "sql/-/-1"

    var headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(this.orientUser+":"+this.orientPassword));
    this.http.post(url, JSON.stringify({
          "command": this.query
        }), {headers: headers}).toPromise()
         .then(function(data: any){console.log(data)})
        //  .catch(function(e){console.log(e)});

	}

  test(): void {
    console.log(this.lat)
  }
}
