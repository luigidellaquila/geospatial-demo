import { Component, OnInit } from '@angular/core';
declare var google: any;

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.html',
	  styleUrls: ['app/app.css']
})

export class AppComponent implements OnInit{

	map: any;
	query = "select from V";

	ngOnInit(): void {
		var mapProp = {
            center: new google.maps.LatLng(52.2316019, 19.5103393),
            zoom: 7,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      var map = new google.maps.Map(document.getElementById("map"), mapProp);
	}

	executeQuery(): void{
    //TODO
	}

}
