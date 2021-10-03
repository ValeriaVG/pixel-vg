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
</script>

<h1>Pixel Editor</h1>
<Palette {colors} bind:selectedColor />
<br />
<DrawingBoard bind:color={selectedColor} {mirror} bind:getImageData />
<Controls bind:mirror {saveImage} />

<p>HINT: Click right mouse button on the canvas and choose "Save image" to save your artwork.</p>
<p><a href="/gallery">Image examples</a></p>
