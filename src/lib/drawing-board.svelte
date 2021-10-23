<script lang="ts">
	import { onMount } from 'svelte';
	import { ColoredPixels, ImageDataFn, ImageDataType, MirrorMode } from './types';
	import { compileProgram } from './webgl';

	const PIXEL_RATIO = window.devicePixelRatio;
	let canvas: HTMLCanvasElement;
	let gl: WebGLRenderingContext;
	export let blockSize = 32;
	export let size: number = 16;
	// [x,y,color]
	export let pixels: ColoredPixels = [];
	export let color: string = '#00ff00';
	export let mirror: number = 0;
	export let gridEnabled = true;

	let isReady: boolean = false;

	const ERASER_COLOR = '#cacaca';

	let selected: [number, number] = null;

	let gridShaders: WebGLProgram;
	let drawingShaders: WebGLProgram;

	const normalize = (cx: number, cy: number) => {
		const mid = size / 2;
		const x = (cx - mid) / mid + 1 / size;
		const y = (mid - cy) / mid - 1 / size;
		return [x, y, 0];
	};

	const hex2rgb = (hex: string): [number, number, number] => {
		return [
			parseInt(hex.slice(1, 3), 16) / 255,
			parseInt(hex.slice(3, 5), 16) / 255,
			parseInt(hex.slice(5, 8), 16) / 255
		];
	};

	const render = () => {
		gl.clear(gl.COLOR_BUFFER_BIT);
		let points = pixels.length;
		const selectedPoints = [];
		const currentColor = color ? color : ERASER_COLOR;
		if (selected) {
			const [x, y] = selected;
			selectedPoints.push([x, y, currentColor]);
			if (mirror & MirrorMode.X) {
				selectedPoints.push([size - x - 1, y, currentColor]);
			}
			if (mirror & MirrorMode.Y) {
				selectedPoints.push([x, size - y - 1, currentColor]);
			}
			if (mirror & MirrorMode.X && mirror & MirrorMode.Y) {
				selectedPoints.push([size - x - 1, size - y - 1, currentColor]);
			}
			points += selectedPoints.length;
		}

		const pointsColors = new Float32Array([
			...pixels.map(([x, y, hex]) => [...normalize(x, y), ...hex2rgb(hex)]).flat(),
			...selectedPoints.map(([x, y, hex]) => [...normalize(x, y), ...hex2rgb(hex)]).flat()
		]);

		// Pixels
		if (points) {
			gl.useProgram(drawingShaders);
			const FSIZE = pointsColors.BYTES_PER_ELEMENT;
			// Create a buffer object
			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, pointsColors, gl.STATIC_DRAW);

			// Bind the attribute position to the 1st, 2nd and 3rd floats in every chunk of 6 floats in the buffer
			const position = gl.getAttribLocation(drawingShaders, 'position');
			gl.vertexAttribPointer(
				position, // target
				3, // interleaved data size
				gl.FLOAT, // type
				false, // normalize
				FSIZE * 6, // stride (chunk size)
				0 // offset (position of interleaved data in chunk)
			);
			gl.enableVertexAttribArray(position);

			// Bind the attribute color to the 3rd, 4th and 5th float in every chunk
			const color = gl.getAttribLocation(drawingShaders, 'color');
			gl.vertexAttribPointer(
				color, // target
				3, // interleaved chunk size
				gl.FLOAT, // type
				false, // normalize
				FSIZE * 6, // stride
				FSIZE * 3 // offset
			);
			gl.enableVertexAttribArray(color);
			const size = gl.getUniformLocation(drawingShaders, 'size');
			gl.uniform1f(size, blockSize);

			gl.drawArrays(gl.POINTS, 0, points);
		}

		// GRID
		if (gridEnabled) {
			gl.useProgram(gridShaders);

			const size = gl.getUniformLocation(gridShaders, 'size');
			gl.uniform1f(size, blockSize);

			const vertices = new Float32Array([
				1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0
			]);
			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
			const position = gl.getAttribLocation(gridShaders, 'position');
			gl.vertexAttribPointer(
				position, // target
				3, // chunk size (send the values 3 by 3)
				gl.FLOAT, // type
				false, // normalize
				0, // stride
				0 // offset
			);
			gl.enableVertexAttribArray(position);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}

		isReady = true;
	};

	onMount(() => {
		gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
		if (!gl) return;

		gridShaders = compileProgram(
			gl,
			{
				vShader: `
                attribute vec4 position;
                void main() {
                    gl_Position = position;
                }`,
				fShader: `
                precision mediump float;
                uniform float size;

                void main() {
                    if(
						gl_FragCoord.x<1.0||
						gl_FragCoord.y<1.0||
						mod(gl_FragCoord.x,size)>(size-1.0) ||
						mod(gl_FragCoord.y,size)>(size-1.0)
                    ){
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.8);
                    }else {discard;}    
                    
                }`
			},
			'grid'
		);

		drawingShaders = compileProgram(
			gl,
			{
				vShader: `
                attribute vec4 position;
                attribute vec4 color;
                varying vec4 v_color;
                uniform float size;
                void main() {
                    gl_Position = position;
                    v_color = color;
                    gl_PointSize = size;
                }`,
				fShader: `
                precision mediump float;
                varying vec4 v_color;
                void main() {
                    gl_FragColor = v_color;
                }`
			},
			'drawing'
		);

		render();
	});

	const onMouseMove = (e: MouseEvent) => {
		if (
			e.offsetX < 0 ||
			e.offsetX > canvas.clientWidth ||
			e.offsetY < 0 ||
			e.offsetY > canvas.clientHeight
		)
			return;

		const x = Math.floor((e.offsetX / blockSize) * PIXEL_RATIO);
		const y = Math.floor((e.offsetY / blockSize) * PIXEL_RATIO);
		selected = [x, y];
		render();
	};
	const onMouseLeave = () => {
		selected = null;
		render();
	};

	const recordPoint = (x: number, y: number) => {
		pixels = pixels.filter(([px, py]) => x !== px || y !== py);
		if (color) {
			// Draw
			pixels.push([x, y, color]);
		}
	};

	const onClick = (e) => {
		const x = Math.floor((e.offsetX / blockSize) * PIXEL_RATIO);
		const y = Math.floor((e.offsetY / blockSize) * PIXEL_RATIO);
		selected = [x, y];
		recordPoint(x, y);
		// Mirror X
		if (mirror & MirrorMode.X) {
			recordPoint(size - x - 1, y);
		}
		// Mirror Y
		if (mirror & MirrorMode.Y) {
			recordPoint(x, size - y - 1);
		}

		// Mirror XY
		if (mirror & MirrorMode.X && mirror & MirrorMode.Y) {
			recordPoint(size - x - 1, size - y - 1);
		}
		render();
	};

	export const getImageData: ImageDataFn = (type) => {
		if (type === ImageDataType.url) return canvas.toDataURL();
		return pixels;
	};
	let prevGrid = gridEnabled;
	$: {
		if (prevGrid !== gridEnabled) {
			render();
			prevGrid = gridEnabled;
		}
	}
</script>

<canvas
	bind:this={canvas}
	width={size * blockSize}
	height={size * blockSize}
	style={`width:${(size * blockSize) / PIXEL_RATIO}px; height:${
		(size * blockSize) / PIXEL_RATIO
	}px;`}
	on:mousemove={onMouseMove}
	on:mouseleave={onMouseLeave}
	on:click={onClick}
	data-ready={isReady}
	data-testid="drawing-board"
/>

<style>
	canvas {
		margin: 4rem 0;
	}
</style>
