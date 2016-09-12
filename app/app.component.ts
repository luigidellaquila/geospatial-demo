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

  lat: number;
  lon: number;
  personName: string;

  constructor(private http: Http, private zone: NgZone) { }

	ngOnInit(): void {
    var controller = this;
		var mapProp = {
            center: new google.maps.LatLng(52.231807953759706, 21.013154983520508),
            zoom: 18,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      controller.map = new google.maps.Map(document.getElementById("map"), mapProp);

      controller.map.addListener("click", function(point: any){
        controller.zone.run(()=> {
          controller.lat = point.latLng.lat();
          controller.lon = point.latLng.lng();
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
                    "command": statement
                  }),
                  {headers: headers}
        ).toPromise()
         .then(success)
         .catch(error);
  }


  createPerson(): void{
    var location = {
      "@class": "OPoint",
      coordinates: [this.lon, this.lat]
    }
    var queryString = "insert into Person set name = '"+this.personName+"', location = "+JSON.stringify(location);
    console.log(queryString);
    this.orientCommand(queryString, (res)=>{
      let body = res.json();
      let person = body.result[0];
      this.addPersonToMap(person)
    }, (e)=>{console.log(e)})
  }


  addPersonToMap(personData:any){
    console.log("person")
    console.log(personData)
    let location = personData.location;
    console.log("location")
    console.log(location)
    let coordinates = location.coordinates;
    console.log("coordinates")
    console.log(coordinates)

    let marker = new google.maps.Marker({
          position: {lat:coordinates[1], lng:coordinates[0]},
          map: this.map,
          title: personData.name
        });
  }
}
