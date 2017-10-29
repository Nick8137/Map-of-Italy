import { Component, AfterContentInit, AfterViewInit, AfterViewChecked, HostListener } from '@angular/core';
import { Data } from "../app/data";
import * as d3 from "d3";

@Component({
	selector: 'map',
	templateUrl: 'app/map.component.html',
	styleUrls: ['app/map.component.css']
})
export class MapComponent implements AfterContentInit, AfterViewInit, AfterViewChecked {

	map: any;
	svg: any;
	data: Data = new Data();

	constructor() {
	}

	ngAfterContentInit() {
		this.svg = d3.select("body")
			.select("map")
			.select("svg");
		this.map = d3.select("body")
			.select("map");

		this.addFilters();
	}

	ngAfterViewInit() {
		this.stylingMap();
		this.addCountries();
		this.addCities();
		this.addShip();
	}

	ngAfterViewChecked() {

	}

	addFilters(): void {
		let shadow: any = this.svg.select("defs")
			.append("filter")
			.attr("id", "shadow")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", "200%")
			.attr("height", "200%");

		shadow.append("feOffset")
			.attr("result", "offOut")
			.attr("in", "SourceGraphic")
			.attr("dx", 0)
			.attr("dy", 0);

		shadow.append("feGaussianBlur")
			.attr("result", "blurOut")
			.attr("in", "offOut")
			.attr("stdDeviation", 5);

		shadow.append("feBlend")
			.attr("in", "SourceGraphic")
			.attr("in2", "blurOut")
			.attr("mode", "normal");

		let lightShadow: any = this.svg.select("defs")
			.append("filter")
			.attr("id", "lightShadow")
			.append("feGaussianBlur")
			.attr("stdDeviation", 5);

		let shadow_2: any = this.svg.select("defs")
			.append("filter")
			.attr("id", "shadow_2")
			.attr("height", "130%");

		shadow_2.append("feGaussianBlur")
			.attr("id", "SourceAlpha")
			.attr("stdDeviation", "3");

		shadow_2.append("feOffset")
			.attr("dx", "2")
			.attr("dy", "2")
			.attr("result", "offsetblur");
		let shadow_2_feMerge: any = shadow_2.append("feMerge");

		shadow_2_feMerge.append("feMergeNode");

		shadow_2_feMerge.append("feMergeNode")
			.attr("in", "SourceGraphic");
	}

	stylingMap(): void {
		this.svg.attr("height", "951px")
			.attr("width", "866px");

		this.svg.select("g#ITA")
			.selectAll("path")
			.attr("stroke-dasharray", "3, 3")
			.attr("stroke", "#d1c2c2")
			.attr("stroke-width", 0.8)
			.attr("fill", "#fff")
			.attr("onmouseover", "evt.target.setAttribute('fill', '#f9f3e0');")
			.attr("onmouseout", "evt.target.setAttribute('fill', '#fff')");

		this.svg.select("g#land")
			.selectAll("path")
			.attr("stroke", "#a0855b")
			.attr("stroke-width", 1.8)
			.style("filter", "url(#shadow_2)");

		this.svg.select("g#context")
			.selectAll("path")
			.attr("stroke-width", 0.4)
			.style("fill", "#f5f0ed");

		this.svg.select("g#graticule")
			.selectAll("path")
			.attr("opacity", "0.2");
	}

	addCountries(): void {
		this.svg.append("g")
			.attr("class", "countries");

		this.svg.select("g.countries")
			.selectAll("text")
			.data(this.data.countries)
			.enter()
			.append("text");

		this.svg.select("g.countries")
			.selectAll("text")
			.data(this.data.countries)
			.text((d: any) => { return d.name })
			.attr("x", (d: any) => { return d.x })
			.attr("y", (d: any) => { return d.y })
			.attr("stroke", "none")
			.style("font-family", "AquilineTwo")
			.style("fill", "#511")
			.style("font-size", "14px")
			.style("fill-opacity", 0.5);
	}

	addCities(): void {
		this.svg.append("g")
			.attr("class", "cities");

		this.svg.select("g.cities")
			.selectAll("text")
			.data(this.data.cities)
			.enter()
			.append("text");

		this.svg.select("g.cities")
			.selectAll("text")
			.data(this.data.cities)
			.text((d: any) => { return d.name })
			.attr("x", (d: any) => { return d.x })
			.attr("y", (d: any) => { return d.y })
			.attr("stroke", "none")
			.style("font-family", "AquilineTwo")
			.style("fill", "#511")
			.style("font-size", "14px")
			.style("fill-opacity", 1);

		this.map.select("div#svg-wrap")
			.selectAll("img")
			.data(this.data.cities)
			.enter()
			.append("img")
			.attr("src", function(d: any): string {
				if (!d.main) {
					return "img/dot.png";
				} else {
					return "img/star.png";
				}
			})
			.attr("class", "city-point")
			.style("position", "absolute")
			.style("cursor", "pointer")
			.style("z-index", 100)
			.style("top", (d: any) => { return ((d.y/768 * 100) - (15/768 * 100)) + "%" })
			.style("left", (d: any) => { return ((d.x/700 * 100) - (10/700 * 100)) + "%" });
	}

	addShip(): void {
		this.svg.select("defs")
			.append("image")
			.attr("href", "img/ship.png")
			.attr("id", "ship")
			.attr("width", 13);

		let shipPath: any = this.svg.append("g")
			.attr("id", "ShipPathAnimation");

		shipPath.append("path")
			.attr("id", "shipPath")
			.attr("stroke", "black")
			.attr("stroke-width", 0.7)
			.attr("stroke-dasharray", "3, 3")
			.attr("opacity", "0.5")
			.attr("d", (): string => {
				let firstCity: any = this.data.cities[4];
				let secondCity: any = this.data.cities[5];
				let thirdCity: any = this.data.cities[7];
				let firstPoint: string = "M" + (<number>firstCity.x - 8)+ "," + (<number>firstCity.y - 10);
				let secondPoint: string = "C" + (<number>firstCity.x + 33) + "," + (<number>firstCity.y + 66) + 
					" " + (<number>firstCity.x + 145) + "," + (<number>firstCity.y + 71) +
					" " + (<number>secondCity.x - 6) + "," + (<number>secondCity.y - 9) +
					" " + "C" + "400,400" + " " + "400,450" + " " + "450,470" +
					" " + "C" + "460,475" + " " + "500,500" + " " + "465,570";
					return firstPoint + secondPoint;
			}).attr("fill", "rgba(0,0,0,0)");

		let shipUse: any = shipPath.append("use")
			.attr("id", "ship-use")
			.attr("y", "-5")
			.attr("xlink:href", "#ship");

		let test: any = document.getElementById("ship-use");

		let shipAnimate: any = shipUse.append("animateMotion")
			.attr("id", "ship-motion")
			.attr("dur", "30s")
			.attr("repeatCount", "indefinite")
			.attr("rotate", "auto");

		shipAnimate.append("mpath")
			.attr("xlink:href", "#shipPath");
	}
}
