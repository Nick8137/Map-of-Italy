import { Component, AfterContentInit, Output, EventEmitter, AfterContentChecked } from "@angular/core";
import * as d3 from "d3";

@Component({
	selector: "control",
	templateUrl: "app/control.component.html",
	styleUrls: ["app/control.component.css"]
})
export class ControlComponent implements AfterContentInit, AfterContentChecked {

	svg: any;
	svgWrap: any;
	path: any[];
	private nameCircle: string;
	private color: string;
	private radius: number;
	private pointNumber: number;
	private btnText: string;
	private shipsData = {
		redShips: 0,
		greenShips: 0,
		blueShips: 0
	};
	private targetElem: any;
	private maxValue: number;

	constructor() {
		this.color = "#000";
		this.radius = 50;
		this.maxValue = 50;

		this.path = [
			1,
			"M74,413C115,489 227,494 420,358 C400,400 400,450 450,470 C460,475 500,500 465,570",
			"M74,413 C115,489 350,400 325,540 C325,540 540,480 465,565"
		];
	}

	ngAfterContentInit() {
		this.svg = d3.select("map")
			.select("svg");

		this.svgWrap = d3.select("map")
			.select("div#svg-wrap");

		d3.select("#ship-path-wrap").on("mousedown", (): void => {
			this.shipPathHide();
		});

		d3.select("#cities-wrap").on("mousedown", (): void => {
			this.citiesHide();
		});

		d3.select("#countries-wrap").on("mousedown", (): void => {
			this.countriesHide();
		});

		d3.select("#ship-speed").on("input", (): void => {
			this.shipSpeedChange();
		});
	}

	ngAfterContentChecked() {		
		if (document.getElementById("point-circle")) {
			this.btnText = "Cancel";
		} else {
			this.btnText = "Paint Point";
		}

		this.hoverCirclesStyling();
	}

	addCircle(): void {
		let that: any = this;
		function shipsRGB(): string {
			let redShips: number;
			let greenShips: number;
			let blueShips: number;
			that.shipsData.redShips > 50 ? redShips = 50 : redShips = that.shipsData.redShips;
			that.shipsData.greenShips > 50 ? greenShips = 50 : greenShips = that.shipsData.greenShips;
			that.shipsData.blueShips > 50 ? blueShips = 50 : blueShips = that.shipsData.blueShips;
			let ships: number[] = [redShips, greenShips, blueShips];
			ships = ships.map(ship => {
				return Math.round((ship * 255) / 50);
			});
			return `rgb(${ships[0]}, ${ships[1]}, ${ships[2]})`;
		}

		if (!document.getElementById("point-circle")) {
			this.svg.append("circle")
				.attr("r", (): number => { return this.radius; })
				.attr("fill", shipsRGB)
				.attr("id", "point-circle")
				.attr("fill-opacity", "0.2")
				.attr("stroke", shipsRGB)
				.attr("stroke-width", "1")
				.attr("name", (): string => { return this.nameCircle; })
				.attr("red-ships", (): number => { return this.shipsData.redShips; })
				.attr("green-ships", (): number => { return this.shipsData.greenShips; })
				.attr("blue-ships", (): number => { return this.shipsData.blueShips; })
				.style("cursor", "pointer");
		} else {
			this.svg.select("circle#point-circle")
				.remove();
		}
	}

	hoverCirclesStyling(): void {
		let that: any = this;

		function mouseOver(): void {
			d3.select(<any>event.target).transition()
					.duration(200)
					.delay(0)
					.attr("fill-opacity", "0.25")
					.attr("stroke-width", "1.5");
		}

		function mouseLeave(): void {
			d3.select(<any>event.target).transition()
					.duration(200)
					.attr("fill-opacity", "0.2")
					.attr("stroke-width", "1");
		}

		function appendDiv(elem: string, attr: string[]): void {
			that.svg.selectAll(elem)
				.on("mouseover", (): void => {
					if (elem === "circle.painted-point") {
						mouseOver();
					}
					that.svgWrap.append("div")
						.attr("id", "circle-desc")
						.text((): string => {
							let meta_data: string = (<any>event.target).getAttribute(attr[0]);
							meta_data == null ? meta_data = "" : meta_data;
							for (let i = 1; i < attr.length; i++) {
								meta_data += " " + (<any>event.target).getAttribute(attr[i]);
							}
							return meta_data;
						})
						.style("padding", "10px")
						.style("position", "absolute")
						.style("z-index", "1000")
						.style("border", "1px solid #000")
						.style("border-radius", "5px")
						.style("background", "#fff");
				}).on("mousemove", (): void => {
					that.svgWrap.select("#circle-desc")
						.style("top", (): string => {
							let y: string = (<any>event).pageY;
							return y + "px";
						}).style("left", (): string => {
							let x: string = (<any>event).pageX;
							return x + "px";
						});
				}).on("mouseleave", (): void => {
					if (elem === "circle.painted-point") {
						mouseLeave();
					}
					that.svgWrap.select("#circle-desc")
						.remove();
				});
		}

		appendDiv("circle.painted-point", ["name", "red-ships", "green-ships", "blue-ships"]);
		appendDiv("circle.ship", ["cx", "cy"]);
	}

	shipPathHide(): void {
		if ((<any>document.getElementById("ship-path")).checked) {
				this.svg.select("#ShipPathAnimation")
					.transition()
					.duration(500)
					.style("opacity", "0");
			} else if (!(<any>document.getElementById("ship-path")).checked) {
				this.svg.select("#ShipPathAnimation")
					.transition()
					.duration(500)
					.style("opacity", "1");
			}
	}

	citiesHide(): void {
		if ((<any>document.getElementById("cities")).checked) {
				this.svgWrap.selectAll("img.city-point")
					.transition()
					.duration(500)
					.style("opacity", "0");

				this.svg.select("g.cities")
					.selectAll("text")
					.transition()
					.duration(500)
					.style("opacity", "0");
			} else if (!(<any>document.getElementById("cities")).checked) {
				this.svgWrap.selectAll("img.city-point")
					.transition()
					.duration(500)
					.style("opacity", "1");

				this.svg.select("g.cities")
					.selectAll("text")
					.transition()
					.duration(500)
					.style("opacity", "1");
			}
	}

	countriesHide(): void {
		if ((<any>document.getElementById("countries")).checked) {
				this.svg.select("g.countries")
					.selectAll("text")
					.transition()
					.duration(500)
					.style("opacity", "0");
			} else if (!(<any>document.getElementById("countries")).checked) {
				this.svg.select("g.countries")
					.selectAll("text")
					.transition()
					.duration(500)
					.style("opacity", "1");
			}
	}

	shipSpeedChange(): void {
		this.svg.select("#ShipPathAnimation")
			.style("opacity", "0");

		d3.select("#ship-speed").on("mouseup", (): void => {
			this.svg.select("#ShipPathAnimation")
				.transition()
				.duration(500)
				.style("opacity", (): number => {
					if (!(<any>document.getElementById("ship-path")).checked) {
						return 0;
					} else return 1;
				});
		});

		let speed: number = (<any>document.getElementById("ship-speed")).value;
			
		this.svg.select("#ship-motion")
			.attr("dur", (): number => {
				return 70 - speed;
			});
	}

	changeShipPath(): void {
		this.svg.select("#shipPath")
			.transition()
			.duration(1000)
			.attr("d", (): string => {
				this.path[0] += 1;
				if (this.path[0] >= this.path.length) {
					this.path[0] = 1;
				}
				return this.path[this.path[0]]
			});
	}

	hidePoints(): void {
		if (d3.select("#hide-points").text() === "Hide Points") {
			this.svg.selectAll("circle")
			.transition()
			.duration(500)
			.attr("opacity", "0");
			d3.select("#hide-points").text("Show Points");
		} else if (d3.select("#hide-points").text() === "Show Points") {
			this.svg.selectAll("circle")
				.transition()
				.duration(500)
				.attr("opacity", "0.7");
			d3.select("#hide-points").text("Hide Points");
		}
	}

	deleteAllPoints(): void {
		this.svg.selectAll("circle")
			.transition()
			.duration(500)
			.attr("opacity", "0")
			.remove();
	}
}