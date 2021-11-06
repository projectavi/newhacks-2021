<script>
	import Dashboard from './Dashboard.svelte';

	let theme = 'light';
</script>

<main>
	<Dashboard theme={theme}/>
</main>

<style>
	main {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width:100%;
	}
</style>