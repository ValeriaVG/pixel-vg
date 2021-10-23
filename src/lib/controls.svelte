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
	{#each ['X', 'Y'] as axis}
		<button
			title={`Toggle mirror on ${axis}-axis`}
			on:click={toggleMirror(MirrorMode[axis])}
			class={mirror & MirrorMode[axis] ? 'toggle active' : 'toggle'}
		>
			<span>{axis}|{axis}</span>
		</button>
	{/each}
</nav>
<slot />
<nav>
	{#each ['png', 'svg'] as ext}
		<button on:click={() => saveImage(ImageType[ext])}>Save as {ext.toUpperCase()}</button>
	{/each}
</nav>

<style>
	nav {
		display: grid;
		grid-gap: 1rem;
		align-items: center;
		margin: 0 auto;
		grid-template-columns: repeat(2, 1fr);
	}
	button {
		background-color: #cf3a69;
		border: none;
	}
	.active {
		background-color: #606c76;
	}
	button.toggle {
		border: 1px solid rgba(0, 0, 0, 0.08);
		background: #ffffff;
		border-radius: 2rem;
		width: 8rem;
		padding: 0 4rem 0 0;
		height: 4rem;
		display: inline-flex;
		transition: padding ease 300ms;
	}
	.toggle > span {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		border-radius: 4rem;
		background-color: #e7e7e7;
		transition: background-color ease 300ms;
	}
	.toggle.active {
		padding-right: 0;
		padding-left: 4rem;
		transition: padding ease 300ms;
	}
	.toggle.active > span {
		background-color: #cf3a69;
		transition: background-color ease 300ms;
	}
</style>
