import { Component, OnInit, NgZone} from '@angular/core';
import { OrientService } from "./orient.service"

import 'rxjs/add/operator/toPromise';

declare var google: any;

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.html',
	  styleUrls: ['app/app.css'],
    providers: [OrientService]
})

export class AppComponent implements OnInit{

	map: any;
	query = "select from V";

  lat: number;
  lon: number;
  personName: string;

  fromMarker:any;

  constructor( private zone: NgZone, private orient: OrientService) { }

	ngOnInit(): void {
    // this.drawMap();
    // this.loadPeople()
    // this.loadEdges()
    // this.loadPOIs()
    // this.loadParks()
	}

	drawMap(){
    //TODO
  }

  createPerson(): void{
    // TODO
  }

  createEdge(from:any, to:any): void{
    // TODO
  }






  /* ----------------------------------------------------------------------------- */
  /* ----------------------------------------------------------------------------- */




  executeQuery(): void {
    let controller = this;
    this.orient.command(
      this.query,
      function(data){
        let body = data.json();
        let result = body.result;
        result.forEach((x:any) => {

          if(x["@class"]==="Person"){
            controller.addPersonToMap(x);
          }else if(x["@class"]==="POI"){
            controller.addPoiToMap(x)
          }else if(x["@class"]==="Natural"){
            controller.addShapeToMap(x)
          }
        });
      },
      function(e){console.log(e)}
    )
  }

  loadEdges(){
    this.orient.command(`
      match {class:Person, as:a}.outE('FriendOf'){as:e}.inV() {class:Person, as:b}
      return a.location.coordinates[0] as fromLng,
      a.location.coordinates[1] as fromLat,
      b.location.coordinates[0] as toLng,
      b.location.coordinates[1] as toLat
      `,
      (data)=>{
        let body = data.json();
        let result = body.result;
        result.forEach((x:any) => {
          this.addEdgeToMap(x.fromLat, x.fromLng, x.toLat, x.toLng);
        })
      },
      (error)=>{console.log(error)});
  }

  loadPeople(){
    let controller = this;
    this.orient.command(
      "select from Person",
      function(data){
        let body = data.json();
        let result = body.result;
        result.forEach((x:any) => {
          controller.addPersonToMap(x);
        });
      },
      function(e){console.log(e)}
    )
  }

  loadPOIs(){
    let controller = this;
    this.orient.command(
      "select from POI where name <> '' limit 1000",
      function(data){
        let body = data.json();
        let result = body.result;
        result.forEach((x:any) => {
          controller.addPoiToMap(x);
        });
      },
      function(e){console.log(e)}
    )
  }

  loadParks(){
    let controller = this;
    this.orient.command(
      "select from Natural where type='park'",
      function(data){
        let body = data.json();
        let result = body.result;
        result.forEach((x:any) => {
          controller.addShapeToMap(x);
        });
      },
      function(e){console.log(e)}
    )
  }

  addPersonToMap(personData:any){
    let location = personData.location;
    let coordinates = location.coordinates;
    let controller = this;
    let marker = new google.maps.Marker({
          position: {lat:coordinates[1], lng:coordinates[0]},
          map: this.map,
          title: personData.name,
          rid: personData["@rid"]
        });
    google.maps.event.addListener(marker, 'click', function() {
      controller.onMarkerClick(marker);
    });
  }

  addPoiToMap(data:any){
    let location = data.location;
    let coordinates = location.coordinates;
    let controller = this;
    let marker = new google.maps.Marker({
      icon: "pin.png",
      position: {lat:coordinates[1], lng:coordinates[0]},
      map: this.map,
      title: data.name,
      rid: data["@rid"]
    });
  }

  addShapeToMap(data:any){
    let coordinates:any[] = [];
    let location = data.location;
    console.log(location.coordinates)
    location.coordinates[0].forEach((x:any) => {
      coordinates.push({lat:x[1], lng:x[0]});
    });
    let controller = this;
    let marker = new google.maps.Polygon({
      paths: coordinates,
      map: this.map,
      clickable: false
    });
  }

  addEdgeBetweenMarkersToMap(from:any, to:any){
    let coordinates = [from.getPosition(), to.getPosition()];
    let path = new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: "#0000ff",
      strokeOpacity: 0.5,
      strokeWeight: 1
    });
    path.setMap(this.map);
  }


  addingEdge = false;
  startAddEdge(){
    this.addingEdge = true;
  }

  addEdgeToMap(fromLat:number, fromLng:number, toLat:number, toLng:number){
      let coordinates = [{lat: fromLat, lng: fromLng}, {lat: toLat, lng: toLng}];
      let path = new google.maps.Polyline({
        path: coordinates,
        geodesic: true,
        strokeColor: "#0000ff",
        strokeOpacity: 0.5,
        strokeWeight: 1
      });

      path.setMap(this.map);
  }

  onMarkerClick(marker:any){
    if(this.addingEdge) {
      if (!this.fromMarker) {
        this.fromMarker = marker;
      } else {
        this.createEdge(this.fromMarker, marker);
        this.fromMarker = null;
        this.addingEdge = false;
      }
    }
  }

}
