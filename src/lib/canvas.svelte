<script lang="ts">
	import { onMount } from 'svelte';
	import { compileProgram } from './webgl';

	const PIXEL_RATIO = 1.5;
	let canvas: HTMLCanvasElement;
	let gl: WebGLRenderingContext;
	export let blockSize = 32;
	export let size: number = 16;
	// [x,y,color]
	export let pixels: Array<[number, number, string]> = [];
	export let color: string = '#00ff00';
	export let mirror: number = 0;

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
			if (mirror & 1) {
				selectedPoints.push([size - x - 1, y, currentColor]);
			}
			if (mirror & 2) {
				selectedPoints.push([x, size - y - 1, currentColor]);
			}
			if (mirror & 1 && mirror & 2) {
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
		{
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
	};

	onMount(() => {
		gl = canvas.getContext('webgl');
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
                        mod(gl_FragCoord.x,size)<1.0 ||
                        mod(gl_FragCoord.y,size)<1.0
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
			e.clientX < canvasRect.left ||
			e.clientX > canvasRect.right ||
			e.clientY < canvasRect.top ||
			e.clientY > canvasRect.bottom
		)
			return;

		const x = Math.floor(((e.clientX - canvasRect.left) / blockSize) * PIXEL_RATIO);
		const y = Math.floor(((e.clientY - canvasRect.top) / blockSize) * PIXEL_RATIO);
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

	const onClick = () => {
		const [x, y] = selected;
		recordPoint(x, y);
		// Mirror X
		if (mirror & 1) {
			recordPoint(size - x - 1, y);
		}
		// Mirror Y
		if (mirror & 2) {
			recordPoint(x, size - y - 1);
		}

		// Mirror XY
		if (mirror & 1 && mirror & 2) {
			recordPoint(size - x - 1, size - y - 1);
		}
		render();
	};

	$: canvasRect = canvas?.getBoundingClientRect();
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
/>
