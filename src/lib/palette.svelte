<script lang="ts">
	export let selectedColor: string = null;
	export let colors: string[];

	const selectColor = (hex: string) => () => {
		selectedColor = hex;
	};
</script>

<nav>
	{#each colors as hex}
		<button
			style={`background:${hex}`}
			class={hex === selectedColor ? 'selected' : ''}
			on:click={selectColor(hex)}
			>{hex ? '' : 'X'}
		</button>
	{/each}
</nav>

<style>
	nav {
		display: flex;
	}
	button {
		width: 2rem;
		height: 2rem;
		border: 2px solid rgba(255, 255, 255, 1);
		transition: border-color ease 100ms;
		padding: 0;
		margin: 0;
		line-height: 1rem;
		text-align: center;
		display: block;
	}
	button:hover {
		border-color: rgba(255, 255, 255, 0.75);
		transition: border-color ease 100ms;
		cursor: pointer;
	}
	button.selected {
		border-color: rgba(255, 255, 255, 0);
		transition: border-color ease 100ms;
	}
</style>
