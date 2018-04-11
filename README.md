# agm-buffer-direction

The directive for [@agm/core](https://github.com/SebastianM/angular-google-maps) (not official) creates a route with a given buffer zone.

![agm-buffer-direction](https://image.ibb.co/jkEZhH/agm_buffer_direction.png)

## Installation

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

+ Install @agm/core
  ```bash
  npm install --save @agm/core
  ```

+ Install agm-bufer-direction
  ```bash
  npm install --save agm-buffer-direction
  ```

## Importing Modules

+ @agm/core
+ agm-buffer-direction

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { AgmCoreModule } from '@agm/core';            // @agm/core
import { AgmBufferDirectionModule } from 'agm-buffer-direction';   // agm-buffer-direction

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AgmCoreModule.forRoot({ // @agm/core
            apiKey: 'your key',
        }),
        AgmBufferDirectionModule // agm-buffer-direction
    ],
    providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
+ import part of jsts in angular-cli.json or just in index.html

```js
{
  ...
  "apps": [
    {
      ...
      "scripts": [
        "./node_modules/agm-buffer-direction/jsts/jsts.min.js",
        "./node_modules/agm-buffer-direction/jsts/javascript.util.js"
      ],
      ...
    }
  ],
  ...
}
```

## Usage

+ HTML

  ```html
  <agm-map [latitude]="51.678418" [longitude]="7.809007">
    <agm-buffer-direction
      [origin]="direction.origin"
      [destination]="direction.destination"
      [renderOptions]="directionOptions"
      [waypoints]="waypoints"
      [widthBuffer]="widthBuffer"
      [listenChanges]="listenChanges"
      (getWaypoints)="directionEvent($event)"
    >
    </agm-buffer-direction>
    <agm-polygon
      [paths]="directionBuffer"
      [editable]="false"
      [fillColor]="'#3658b1'"
      [strokeColor]="'#3658b1'"
      [polyDraggable]="false"
      [strokeWeight]="1"
    >
    </agm-polygon>
  </agm-map>
  ```

+ CSS

  ```css
  agm-map{
    height: 90vh;
  }
  ```

+ TS

  ```ts
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
  widthBuffer: number = 10000;
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
  ```