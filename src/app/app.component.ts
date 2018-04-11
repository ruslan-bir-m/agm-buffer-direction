import { Component } from '@angular/core';
import { MouseEvent, LatLng, LatLngLiteral } from '@agm/core';
import { AgmPolygon } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  direction = {
    origin: {
      lat: 52.1094468,
      lng: 23.813960500000007
    },
    destination: {
      lat: 52.7840874,
      lng: 27.543941899999936
    }
  };
  directionOptions = {
    suppressMarkers: false,
    draggable: true
  };
  waypoints = [
    {
      location: {
        lat: 53.86395599999999,
        lng: 27.668367200000034
      },
      stopover: false
    } 
  ];
  listenChanges: boolean = true;
  directionBuffer: Array<LatLngLiteral> = [];
  widthBuffer: number = 10000; //m
  directionEvent($event){
    this.directionBuffer = [];    
    if($event && $event.polygon){
      this.directionBuffer = $event.polygon;
      this.waypoints = $event.waypoints;
      this.direction = {
        origin: $event.start,
        destination: $event.end
      }
    } else {
      console.log("Error with direction!");
    }
    this.listenChanges = false;
  }
}
