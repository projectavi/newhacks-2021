<script>
	import { MaterialApp, Button } from 'svelte-materialify';

	import { Router, Route, Link } from "svelte-navigator";

	import Welcome from './Welcome.svelte';
	import Login from './Login.svelte';
	import UserProfile from './UserProfile.svelte';

	let theme = 'light';

</script>

<main>
	<Router>
		<Route path="/">
			<Welcome theme={theme}/>
		</Route>
		<Route path="/login">
			<Login />
		</Route>
		<Route path="/account">
			<UserProfile />
		</Route>
	</Router>


	<!-- <Welcome theme={theme}/> -->
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