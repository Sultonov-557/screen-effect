class Color {
	constructor(red, green, blue) {
		this.r = red;
		this.g = green;
		this.b = blue;
	}
}

async function start() {
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");
	const pixelMap = await imageToArray("./img.png");
	canvas.width = pixelMap.length * 4;
	canvas.height = pixelMap[0].length * 4;

	for (let x = 0; x <= canvas.width; x++) {
		for (let y = 0; y <= canvas.width; y++) {
			const color = getColorFromPixelMap(x, y);
			ctx.fillStyle = ColorToRGB(color);
			ctx.fillRect(x, y, 1, 1);
		}
	}

	function getColorFromPixelMap(x, y) {
		x = parseInt(x);
		y = parseInt(y);
		let imageX = parseInt(x / 4);
		let imageY = parseInt(y / 4);
		if (x % 4 == 0 || y % 4 == 0) {
			return new Color(0, 0, 0);
		}
		if ((x % 4) - 1 == 0) {
			if (pixelMap[imageX][imageY]) {
				return new Color(pixelMap[imageX][imageY].r, 0, 0);
			}
			return new Color(0, 0, 0);
		}
		if ((x % 4) - 2 == 0) {
			if (pixelMap[imageX][imageY]) {
				return new Color(0, pixelMap[imageX][imageY].g, 0);
			}
			return new Color(0, 0, 0);
		}
		if ((x % 4) - 3 == 0) {
			if (pixelMap[imageX][imageY]) {
				return new Color(0, 0, pixelMap[imageX][imageY].b);
			}
			return new Color(0, 0, 0);
		}
	}
}

function ColorToRGB(color) {
	return `rgb( ${color.r} , ${color.g} , ${color.b} )`;
}

async function imageToArray(path) {
	const image = [];
	const img = await getImage(path);
	img.src = "./img.png";
	const canvas = document.createElement("canvas");
	canvas.height = img.height;
	canvas.width = img.width;
	const ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	for (let x = 0; x <= canvas.width; x++) {
		image[x] = [];
		for (let y = 0; y <= canvas.height; y++) {
			image[x][y] = getPixel(x, y);
		}
	}

	function getPixel(x, y) {
		const pixelArr = JSON.parse("[" + ctx.getImageData(x, y, 1, 1).data.toString() + "]");
		return new Color(pixelArr[0], pixelArr[1], pixelArr[2]);
	}
	return image;
}

function getImage(src) {
	return new Promise((resolve, reject) => {
		let img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}
