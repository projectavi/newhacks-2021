<script>
    import UserProfile from './UserProfile.svelte';
	import Dashboard from './Dashboard.svelte';

    import { auth, google_provider } from './firebase';
    import { authState } from 'rxfire/auth';

	import { Router, Route, Link } from "svelte-navigator";

    let user;
    import { userAcc } from "./store";

    const unsubscribe = authState(auth).subscribe(u => user = u);

    function signout() {
		// user = null;
		auth.signOut()
		console.log(user)
		$userAcc = user
	}

	function signin() {
		auth.signInWithPopup(google_provider);
		console.log(user)
		$userAcc = user
	}

	function binduser() {
		$userAcc = user
		console.log(user)
	}
</script>

<section>

	<div>
		{#if user}
			<Link to="/dashboard">
				<button on:click={binduser}>
					Dashboard
				</button>
			</Link>
			<button on:click={signout}>
				Sign out
			</button>
		{:else}
			<button on:click={signin}>
				Sign In with Google
			</button>
		{/if}
	</div>
</section>