<script>
	import { MaterialApp, Button } from 'svelte-materialify';

	import Welcome from './Welcome.svelte';

	let theme = 'light';

</script>

<main>
	<Welcome theme={theme}/>
</main>

<style>
	main {
		position:fixed;
		top:0;
		left: 0;
        height: 100%;
		width: 100%;
    }
</style>