<svelte:head>
	<!-- Milligram CSS -->
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css"
	/>
</svelte:head>
<nav>
	<a href="/">Home</a>
	<a href="/gallery">Gallery</a>
</nav>
<slot />
<!-- add footer content in future -->
<footer />

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	nav {
		margin: 2rem 0px;
	}

	nav a {
		margin: 0 4rem;
		color: #cf3a69;
	}

	nav a:hover,
	nav a:focus {
		color: #0a1128;
	}
</style>
