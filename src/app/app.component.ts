import { Component, AfterContentInit, AfterContentChecked } from "@angular/core";
import { MapComponent } from "../app/map.component";
import { ControlComponent } from "./control.component";
import * as d3 from "d3";

@Component({
	selector: "my-app",
	template: `
		<map></map>
		<control></control>
	`,
	styleUrls: ["app/app.component.css"]
})
export class AppComponent implements AfterContentInit, AfterContentChecked {

	svg: any;

	constructor() {}

	ngAfterContentInit() {
		this.svg = d3.select("map")
			.select("svg");
	}

	ngAfterContentChecked() {
		
	}
}