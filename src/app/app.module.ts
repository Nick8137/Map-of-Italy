import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";

import { MapComponent } from "./map.component";
import { ControlComponent } from "./control.component";
import { AppComponent }  from './app.component';
import { MapDirective } from "./map.directive";

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, MapComponent, ControlComponent, MapDirective ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
