<script lang="ts">
	import { ImageType, MirrorMode } from './types';
	export let mirror: MirrorMode = MirrorMode.None;
	export let saveImage = (_type: ImageType) => {};

	const toggleMirror = (mode: MirrorMode) => () => {
		if (mirror & mode) {
			mirror ^= mode;
		} else {
			mirror |= mode;
		}
	};
</script>

<nav>
	<button on:click={toggleMirror(MirrorMode.X)} class={mirror & MirrorMode.X ? 'active' : ''}
		>x|x</button
	>
	<button on:click={toggleMirror(MirrorMode.Y)} class={mirror & MirrorMode.Y ? 'active' : ''}
		>y|y</button
	>
	<button on:click={() => saveImage(ImageType.png)}>Save as PNG</button>
	<button on:click={() => saveImage(ImageType.svg)}>Save as SVG</button>
</nav>

<style>
	button {
		background-color: #cf3a69;
		border: none;
	}
	.active {
		background-color: #606c76;
	}
</style>
