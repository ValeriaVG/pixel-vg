<script lang="ts">
	import DrawingBoard from '$lib/drawing-board.svelte';
	import Palette from '$lib/palette.svelte';

	let mirror: number = 0;
	let colors = ['#000000', '#ff0000'];
	export let selectedColor = colors[0];

	const toggleMirror = (mode: number) => () => {
		if (mirror & mode) {
			mirror ^= mode;
		} else {
			mirror |= mode;
		}
	};
</script>

<h1>Pixel Editor</h1>
<Palette {colors} bind:selectedColor />
<br />
<DrawingBoard bind:color={selectedColor} {mirror} />

<nav>
	<button on:click={toggleMirror(1)} class={mirror & 1 ? 'active' : ''}>x|x</button>
	<button on:click={toggleMirror(2)} class={mirror & 2 ? 'active' : ''}>y|y</button>
</nav>

<p>HINT: Click right mouse button on the canvas and choose "Save image" to save your artwork.</p>

<style>
	button {
		background-color: white;
		color: black;
	}
	.active {
		background-color: black;
		color: white;
	}
</style>
