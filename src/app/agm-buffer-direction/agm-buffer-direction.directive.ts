import { Directive, Input, Output, OnChanges, OnInit, EventEmitter, SimpleChanges } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';

/* JSTS import angular-cli.json like */
declare var jsts: any;
declare var google: any;

@Directive({
  selector: 'agm-buffer-direction'
})
export class AgmBufferDirection implements OnChanges, OnInit{

  @Input() origin: { lat: Number, lng: Number };
  @Input() destination: { lat: Number, lng: Number };
  @Input() waypoints: any[] = [];
  @Input() travelMode: string = 'DRIVING';
  @Input() optimizeWaypoints: boolean = true;
  @Input() visible: boolean = true;
  @Input() renderOptions: any;
  @Input() panel: object | undefined;
  @Input() widthBuffer: number = 0;
  @Input() listenChanges: boolean;
  @Output() getWaypoints = new EventEmitter();

  public directionsService: any = undefined;
  public directionsDisplay: any = undefined;
  data = {};
  listenCustom: any;

  constructor(private gmapsApi: GoogleMapsAPIWrapper) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    //When origin and destination come from modal windows
    if(this.listenChanges && changes.origin && changes.destination){
      this.directionDraw();
    }
    //If use buffer in modal window, must to concatenate all "IF" and call "this.directionDraw()" once.
    //When changed weightBuffer we make new directionDraw for calculate buffer coords    
    if(changes.widthBuffer && changes.widthBuffer.currentValue !== changes.widthBuffer.previousValue){
      this.directionDraw();
    }
  }
  // This event is fired when the user creating or updating this direction
  private directionDraw() {
    var that = this;
    if(this.origin.lat !== null && this.origin.lng !== null && this.destination.lat !== null && this.destination.lng !== null){
      this.gmapsApi.getNativeMap().then(map => {
        if (typeof this.directionsDisplay === 'undefined') {
          this.directionsDisplay = new google.maps.DirectionsRenderer(this.renderOptions);
          this.directionsDisplay.setMap(map);
        }
        if (typeof this.directionsService === 'undefined') {
          this.directionsService = new google.maps.DirectionsService;
        }
        if (typeof this.panel === 'undefined') {
          this.directionsDisplay.setPanel(null);
        } else {
          this.directionsDisplay.setPanel(this.panel);
        }

        this.directionsService.route({
          origin: this.origin,
          destination: this.destination,
          waypoints: this.waypoints,
          optimizeWaypoints: this.optimizeWaypoints,
          travelMode: this.travelMode
        }, (response: any, status: any) => {
          if (status === 'OK') {
            this.directionsDisplay.setDirections(response);
            if(that.listenCustom) that.listenCustom.remove();          
            that.listenCustom = this.directionsDisplay.addListener('directions_changed', function(){
              var w = [], wp;
              var route = response.routes[0];
              /* Get leg !ONLY 1 LEG! because in all waypoints "stopover: false".
                If you want "stopover: true" you must edit cicle for (dowm) */
              var rleg = that.directionsDisplay.directions.routes[0].legs[0]; 
              wp = rleg.via_waypoints; //Waypoints
              /* Conver waypoints to true signature */
              for(let i = 0; i < wp.length; i++){
                w[i] = { 
                  location: { lat: wp[i].lat(), lng: wp[i].lng() },
                  stopover: false
                }
              }
              var overviewPathGeo = []; // Array direction's coordinates
              /* Get the array of direction's coordinates */
              for (let j = 0; j < rleg.steps.length; j++) {
                var nextSegment = rleg.steps[j].path;
                for (let k = 0; k < nextSegment.length; k++) {
                  overviewPathGeo.push(
                    [nextSegment[k].lng(), nextSegment[k].lat()]
                  );
                }
              }
                        
              function generatePolygon(overviewPath: any[]) {     
                if(overviewPath && overviewPath.length>= 0){
                  // var last_width_long = 200; //var
                  var distance = that.widthBuffer / 1000;  //en km.
                  distance = (distance / 111.12);
                  var geoInput = {
                    type: "LineString",
                    coordinates: overviewPath
                  };
                  /* BLACK MAGIC IN JSTS! THANKS YOU! */
                  var geometry = new jsts.io.GeoJSONReader().read(geoInput).buffer(distance);
                  var polygon = new jsts.io.GeoJSONWriter().write(geometry);
                  var areaCoordinates = []; // Array for output of ploygon's coordinates
                  /* SWAP PARAMETERS from "lng,lat" to "lat,lng" and make type "LatLngLiteral" */
                  for (let i = 0; i < polygon.coordinates[0].length; i++) {
                    var coordinate = polygon.coordinates[0][i];
                    areaCoordinates.push({lat: coordinate[1], lng: coordinate[0]});
                  }
                  return areaCoordinates;
                }else return false;
              };

              that.data = { // Generate response
                start : {'lat': rleg.start_location.lat(), 'lng': rleg.start_location.lng()},
                end : {'lat': rleg.end_location.lat(), 'lng': rleg.end_location.lng()},
                waypoints: w,
                polygon: generatePolygon(overviewPathGeo)
              };
              that.getWaypoints.emit(that.data);
            });
          }
        });
      });
    }
  }
}
