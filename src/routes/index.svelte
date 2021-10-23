<script lang="ts">
	import Controls from '$lib/controls.svelte';
	import DrawingBoard from '$lib/drawing-board.svelte';
	import { downloadURI } from '$lib/files';
	import Palette from '$lib/palette.svelte';
	import { ColoredPixels, ImageDataType, ImageType } from '$lib/types';
	import type { ImageDataFn } from '$lib/types';
	import pixelsToSVG from '$lib/pixelsToSVG';

	let mirror = 0;
	let gridEnabled = true;
	let colors = ['#000000', '#ff0000'];
	let selectedColor = colors[0];
	let getImageData: ImageDataFn = () => '';

	const saveImage = (type: ImageType) => {
		let filename = prompt('How should we call the file?', 'image');
		if (!filename.endsWith('.' + type)) filename += '.' + type;
		switch (type) {
			case ImageType.png:
				return downloadURI(getImageData(ImageDataType.url) as string, filename);
			case ImageType.svg:
				return downloadURI(
					pixelsToSVG(getImageData(ImageDataType.pixels) as ColoredPixels),
					filename
				);
			default:
				throw Error(`Image type ${type} is not implemented`);
		}
	};

	const addColor = (e: { detail: { color: string } }) => {
		const color = e.detail.color;
		colors = [...new Set([...colors, color])];
	};
	const removeColor = (e: { detail: { color: string } }) => {
		const set = new Set([...colors]);
		set.delete(e.detail.color);
		colors = [...set];
	};
</script>

<svelte:head>
	<title>Pixel VG - WebGL Pixel Editor</title>
	<meta
		name="description"
		content="Pixel (V)ector (G)raphics Easy to use point & click pixel-art editor."
	/>
</svelte:head>

<h1>Pixel Editor</h1>

<Controls bind:mirror bind:gridEnabled {saveImage}>
	<Palette {colors} bind:selectedColor on:addcolor={addColor} on:remcolor={removeColor} />
	<DrawingBoard bind:color={selectedColor} {mirror} {gridEnabled} bind:getImageData />
</Controls>
