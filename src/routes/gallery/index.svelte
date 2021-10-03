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

<nav>
	<a href="/">Back to editor</a>
</nav>
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

<style>
	.images {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		grid-gap: 2rem;
	}
	article img {
		max-width: 100%;
		cursor: pointer;
	}
	article header {
		margin-top: 0.5rem;
		font-weight: bold;
	}
</style>
