<script lang="ts">
	import { assets } from '$app/paths';
	import images from './images';
	const assetPath = (url: string) => {
		let path = assets + 'images';
		if (!url.startsWith('/')) path += '/';
		path += url;
		return path;
	};
</script>

<svelte:head>
	<title>Pixel VG - Image Gallery</title>
	<meta name="description" content="Image gallery with example images." />
</svelte:head>

<h1>Image Gallery</h1>

<section class="images">
	{#each images as { image, title, author }}
		<article>
			<img src={assetPath(image)} alt={title} />
			<header>{title}</header>
			<div>by <em>{author}</em></div>
		</article>
	{/each}
</section>

<p>
	Want to display your creation here? <a
		href="https://github.com/ValeriaVG/pixel-vg"
		target="_blank">Create a Pull Request</a
	>
</p>

<style>
	.images {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
		grid-gap: 2rem;
	}
	article {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	article img {
		max-width: 100%;
	}
	article header {
		margin-top: 0.5rem;
		font-weight: bold;
	}
	p {
		margin-top: 10rem;
	}
</style>
