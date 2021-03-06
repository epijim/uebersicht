// For documentation on these options, see the README at https://github.com/shadowfacts/uebersicht-github-activity/
const options = {
	user: "epijim",
	size: 13,
	incrAmount: 1,
	margin: 2,
	vary: ["size", "color"],
	shape: "circle",
	theme: "red",
	colors: {
		overrides: {
			none: [null, null],
			one: [null, null],
			two: [null, null],
			three: [null, null],
			max: [null]
		},
		red: {
			none: ["#111", "#111"],
			one: ["#640C0B", "#560a09"],
			two: ["#840f03", "#640c0b"],
			three: ["#cc1210", "#840f03"],
			max: ["#e81412", "#cc1210"]
		},
		green: {
			none: ["#eee", "#eee"],
			one: ["#d6e685", "#c2d179"],
			two: ["#8cc665", "#d6e685"],
			three: ["#44a340", "#8cc665"],
			max: ["#1e6823", "#44a340"]
		}
	}
};

const axios = require("axios");
const cheerio = require("cheerio");

axios.get(`https://github.com/${options.user}`)
	.then(generate)
	.catch(function (res) {
  if (res instanceof Error) {
    console.log("");
  } else {
    console.log(res.status, res.data);
  }
});

function generate(res) {
	console.log(`<svg id="githubhub-activity" width="${53 * options.size}" height="${7 * (options.size)}">`);

	const $ = cheerio.load(res.data);

	const columns = $(".js-calendar-graph-svg g > g");
	let x = 0;
	columns.toArray().forEach((col) => {
		let y = 0;

		$(col).find("rect.day").toArray().forEach((it) => {
			const count = parseInt($(it).data("count"));

			let fill, stroke;
			if (options.vary.includes("color")) {
				[fill, stroke] = getColors(count);
			} else {
				[fill, stroke] = getColors(Number.MAX_VALUE);
			}

			if (options.shape == "square") {
				let xPos = x * options.size;
				let yPos = y * options.size;

				let size;
				if (options.vary.includes("size")) {
					size = Math.min(count + options.incrAmount, (options.size - options.margin) / 2);
					xPos += (-size + options.size) / 2;
					yPos += (-size + options.size) / 2;
				} else {
					size = options.size - options.margin;
				}

				console.log(`\t<rect x="${xPos}" y="${yPos}" width="${size}" height="${size}" fill="${fill}" stroke="${stroke}"></rect>`);
			} else {
				const xPos = x * options.size + (options.size / 2);
				const yPos = y * options.size + (options.size / 2);

				let size;
				if (options.vary.includes("size")) {
					size = Math.min(count + options.incrAmount, (options.size - options.margin) / 2);
				} else {
					size = (options.size - options.margin) / 2;
				}

				console.log(`\t<circle cx="${xPos}" cy="${yPos}" r="${size}" fill="${fill}" stroke="${stroke}"></circle>`);
			}

			y++;
		});

		x++;
	});

	console.log("</svg>");
}



function getColorsForPalette(count, palette) {
	if (count == 0) return palette.none;
	else if (count <= 5) return palette.one;
	else if (count <= 10) return palette.two;
	else if (count <= 15) return palette.three;
	else return palette.max;
}

function getColors(count) {
	const defaults = getColorsForPalette(count, options.colors[options.theme]);
	const overrides = getColorsForPalette(count, options.colors.overrides);
	return [overrides[0] || defaults[0], overrides[1] || defaults[1]];
}