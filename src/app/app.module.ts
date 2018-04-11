import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';
import { AgmBufferDirectionModule } from './agm-buffer-direction/agm-buffer-direction.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'your-code',libraries: ["places"]
    }),
    AgmBufferDirectionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
