import { useRef, useState, useEffect } from "react";
import { useWindowResize } from "./hooks/useWindowResize";
import layer0 from "./assets/backgrounds/01-forest/Layer_0000_9.png";
import layer1 from "./assets/backgrounds/01-forest/Layer_0001_8.png";
import layer2 from "./assets/backgrounds/01-forest/Layer_0002_7.png";
import layer3 from "./assets/backgrounds/01-forest/Layer_0003_6.png";
import layer4 from "./assets/backgrounds/01-forest/Layer_0004_Lights.png";
import layer5 from "./assets/backgrounds/01-forest/Layer_0005_5.png";
import layer6 from "./assets/backgrounds/01-forest/Layer_0006_4.png";
import layer7 from "./assets/backgrounds/01-forest/Layer_0007_Lights.png";
import layer8 from "./assets/backgrounds/01-forest/Layer_0008_3.png";
import layer9 from "./assets/backgrounds/01-forest/Layer_0009_2.png";
import layer10 from "./assets/backgrounds/01-forest/Layer_0010_1.png";
import layer11 from "./assets/backgrounds/01-forest/Layer_0011_0.png";
import moon from "./assets/moon.png";
import "./App.css";

function App() {
	const [screenWidth, screenHeight] = useWindowResize();
	const [canvasWidth, canvasHeight] = [screenWidth, 793];
	const canvasRef = useRef();
	const canvasStyle = {
		width: canvasWidth,
		height: canvasHeight,
		position: "fixed",
		top: 0,
		left: 0,
	};
	const layerSources = [
		// layer11,
		moon,
		// layer10,
		layer9,
		layer8,
		layer7,
		layer6,
		layer5,
		layer4,
		layer3,
		layer2,
		layer1,
		layer0,
	];

	const animationRef = useRef();

	let frame = 0;
	let lastFrame = performance.now();
	let frameTimes = [];
	let sceneLayers;

	const renderFrame = (canvas, image, distance = 0) => {
		const canvasContext = canvas.getContext("2d");

		const imageWidth = image.width;
		const xOffset = (frame * (1 - distance)) % imageWidth;

		if (imageWidth >= canvasWidth) {
			canvasContext.drawImage(image, xOffset, 0);
			if (xOffset !== 0) canvasContext.drawImage(image, xOffset + imageWidth, 0);
		} else {
			const wholeCount = Math.ceil(canvasWidth / imageWidth);

			for (let i = 0; i < wholeCount; i++) {
				canvasContext.drawImage(image, xOffset + i * imageWidth, 0);
			}
			canvasContext.drawImage(image, xOffset + wholeCount * imageWidth, 0);
		}
	};

	const scroll = (canvas) => {
		const canvasContext = canvas.getContext("2d");
		canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
		sceneLayers.forEach((image, index) => {
			renderFrame(canvas, image, 1 - index * (1 / sceneLayers.length));
		});
		const now = performance.now();
		const delta = now - lastFrame;
		lastFrame = now;
		frameTimes.push(delta);
		displayFPS(canvas);
		if (frameTimes.length > 144) frameTimes.shift();
		frame--;

		animationRef.current = window.requestAnimationFrame(() => scroll(canvas));
	};

	const displayFPS = (canvas) => {
		var canvasContext = canvas.getContext("2d");
		canvasContext.font = "18px Fira Code";
		let FPS = 0;
		if (frameTimes.length > 0) {
			FPS = 1000 / (frameTimes.reduce((x, y) => x + y) / frameTimes.length);
		}

		canvasContext.fillText(FPS.toFixed(0).padStart(3, "0"), canvasWidth - 40, 20);
	};

	useEffect(() => {
		if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
		const canvas = canvasRef.current;
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		const canvasContext = canvas.getContext("2d");

		canvasContext.fillStyle = "white";
		canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

		let nonloaded = layerSources.length;
		sceneLayers = layerSources.map((source) => {
			let ret = new Image();
			ret.src = source;
			ret.onload = () => {
				if (--nonloaded == 0) {
					scroll(canvas);
				}
			};
			return ret;
		});
	}, [screenWidth, screenHeight]);

	return (
		<div className="App">
			<canvas className="canvas" ref={canvasRef} style={canvasStyle} tabIndex={-1}></canvas>
		</div>
	);
}

export default App;
