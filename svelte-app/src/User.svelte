<script>
    import { firestore } from './firebase';
    import { collectionData } from 'rxfire/firestore';
    import { startWith } from 'rxjs/operators';
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';

    const dispatch = createEventDispatcher();

    console.log("mounted")

    function update() {
        console.log("1", data)

		dispatch('update', { id, new_data: data });
	};

    export let id; // document ID
    export let data;

    onMount(async () => {
        console.log("Dispatching")
		dispatch("u_data", { id, new_data: data });
        console.log("Dispatched.")
	});
</script>

<button type="button" id="submit" name="submit" class="btn btn-primary" on:click={update}>Update</button>

<style>
</style>