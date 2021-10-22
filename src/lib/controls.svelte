<script lang="ts">
	import { MirrorMode } from './types';
	export let mirror: MirrorMode = MirrorMode.None;
	export let saveImage = () => {};

	const toggleMirror = (mode: MirrorMode) => () => {
		if (mirror & mode) {
			mirror ^= mode;
		} else {
			mirror |= mode;
		}
	};
</script>

<nav>
	<button
		on:click={toggleMirror(MirrorMode.X)}
		class={mirror & MirrorMode.X ? 'active button-pink' : 'button-pink'}>x|x</button
	>
	<button
		on:click={toggleMirror(MirrorMode.Y)}
		class={mirror & MirrorMode.Y ? 'active button-pink' : 'button-pink'}>y|y</button
	>
	<button on:click={saveImage} class="button-pink">Save image</button>
</nav>

<style>
	.button-pink {
		background-color: #cf3a69;
		border: none;
	}
	.active {
		background-color: #606c76;
		border: none;
	}
</style>
