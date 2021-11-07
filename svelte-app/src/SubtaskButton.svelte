<script>
    import { MaterialApp, Button } from 'svelte-materialify';
    import { firestore } from './firebase';
    import { collectionData } from 'rxfire/firestore';
    import { startWith } from 'rxjs/operators';
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';

    const dispatch = createEventDispatcher();

    console.log("mounted")

    function update() {
        console.log(task.id)

		dispatch('clicked', { parent_task_obj: task });
	};

    export let task;

    // export let id = "clicked"; // document ID
    // export let data;

    // onMount(async () => {
    //     console.log("Dispatching")
	// 	dispatch("u_data", { id, new_data: data });
    //     console.log("Dispatched.")
	// });
</script>

<Button fab size="small" on:click={update}> + </Button>

<style>
</style>

