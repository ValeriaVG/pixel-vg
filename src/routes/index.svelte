<script lang="ts">
	import Controls from '$lib/controls.svelte';
	import DrawingBoard from '$lib/drawing-board.svelte';
	import { downloadURI } from '$lib/files';
	import Palette from '$lib/palette.svelte';

	let mirror = 0;
	let colors = ['#000000', '#ff0000'];
	let selectedColor = colors[0];
	let getImageData = () => '';

	const saveImage = () => {
		const data = getImageData();
		let filename = prompt('How should we call the file?', 'image');
		if (!filename.endsWith('.png')) filename += '.png';
		downloadURI(data, filename);
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
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Pixel VG - WebGL Pixel Editor</title>
	<meta
		name="description"
		content="Pixel (V)ector (G)raphics Easy to use point & click pixel-art editor."
	/>
</svelte:head>

<h1>Pixel Editor</h1>
<Palette {colors} bind:selectedColor on:addcolor={addColor} on:remcolor={removeColor} />
<DrawingBoard bind:color={selectedColor} {mirror} bind:getImageData />
<Controls bind:mirror {saveImage} />
