export class Data {
	countries: any[];
	cities: any[];

	constructor() {
		this.countries = [
			{ name: "France", x: 25, y: 70 },
			{ name: "Austria", x: 470, y: 30 },
			{ name: "Corse", x: 132, y: 230 },
			{ name: "Slovenia", x: 480, y: 95 },
			{ name: "Croatia", x: 565, y: 122 },
			{ name: "Hungary", x: 620, y: 90 },
			{ name: "Bosnia", x: 625, y: 210 },
			{ name: "Tunisia", x: 15, y: 700 },
			{ name: "Sardegna", x: 69, y: 350 }
		];

		this.cities = [
			{ name: "Milano", x: 235, y: 80 },
			{ name: "Venezia", x: 390, y: 100 },
			{ name: "Bologna", x: 320, y: 135 },
			{ name: "Olbia", x: 146, y: 317 },
			{ name: "Cagliari", x: 82, y: 423 },
			{ name: "Napoli", x: 426, y: 367 },
			{ name: "Palermo", x: 330, y: 552 },
			{ name: "Messina", x: 467, y: 575 },
			{ name: "Roma", x: 338, y: 282, main: true }
		];
	}
}