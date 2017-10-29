import { Directive, HostListener, AfterContentInit } from "@angular/core";
import * as d3 from "d3";

@Directive({
	selector: "[map]"
})
export class MapDirective implements AfterContentInit {
	private svg: any;
	private svgWrap: any;


	ngAfterContentInit() {
		this.svg = d3.select("map")
			.select("svg");

		this.svgWrap = d3.select("map")
			.select("div.svg-wrap");
	}

	randomInteger(min: number, max: number): number {
		var rand: number = min - 0.5 + Math.random() * (max - min + 1);
		rand = Math.round(rand);
		return rand;
	}

	randomCoord(r: number, x: number, y: number): number[] {
		let min_x: number = Number(x) - Number(r);
		let max_x: number = Number(x) + Number(r);
		let rand_x: number = this.randomInteger(min_x, max_x);

		let min_y: number = Number(y) - Number(r);
		let max_y: number = Number(y) + Number(r);
		let rand_y: number = this.randomInteger(min_y, max_y);

		let c: number = Math.sqrt(Math.pow(x - rand_x, 2) + Math.pow(y - rand_y, 2));

		if (c > r * 0.92) {
			return this.randomCoord(r, x, y);
		} else {
			return [rand_x, rand_y];
		}			
	}

	@HostListener("mousemove", ["$event"])
	circleMove(event: MouseEvent) {
		if (document.getElementById("point-circle")) {
			this.svg.select("#point-circle")
				.attr("cx", (): number => {
					return Math.round((event.pageX) / 870 * 700);
				})
				.attr("cy", (): number => {
					return Math.round((event.pageY) / 959 * 768);
				});
		}
	}

	@HostListener("mousedown")
	circlePaint() {
		let point: any = document.getElementById("point-circle");
		if (point) {

			let r_point: number = point.getAttribute("r");
			let cx_point: string = point.getAttribute("cx");
			let cy_point: string = point.getAttribute("cy");

			let redShips: number = point.getAttribute("red-ships");
			redShips > 50 ? redShips = 50 : redShips;
			let greenShips: number = point.getAttribute("green-ships");
			greenShips > 50 ? greenShips = 50 : greenShips;
			let blueShips: number = point.getAttribute("blue-ships");
			blueShips > 50 ? blueShips = 50 : blueShips;

			let allShips: number = Number(redShips) + Number(greenShips) + Number(blueShips);

			let green: number = Number(redShips) + Number(greenShips);
			
			for (let i = 0; i < allShips; i++) {
				let ang: number = Math.sqrt(i * ((12000000 / allShips) * r_point) / 100);
				let r: number = 2 + ang / (Math.PI * 2) * (0.2 * r_point) / 95;

				this.svg.append("circle")
					.attr("class", "ship")
					.attr("r", 0)
					.attr("cx", (): number => {
						let x: number = ((r * Math.cos((ang / 180) * Math.PI)) / 870 * 700) + Number(cx_point);
						return Math.round(x);
					})
					.attr("cy", (): number => {
						let y: number = ((r * Math.sin((ang / 180) * Math.PI)) / 959 * 768) + Number(cy_point);
						return Math.round(y);
					})
					.attr("fill", (): string => {
						if (i < redShips) {
							return "red";
						} else if (i < green) {
							return "green";
						} else {
							return "blue";
						}
					})
					.attr("opacity", "0.6")
					.attr("stroke-width", "1")
					.attr("stroke", "black")
					.transition()
					.duration(1000)
					.delay(100)
					.attr("r", (): number => {
						return (3 * r_point) / 100;
					});
			}

			this.svg.select("#point-circle")
				.attr("id", null)
				.attr("class", "painted-point");
		}
	}
}