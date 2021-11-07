<script>
    import { List, ListItem, MaterialApp, ListGroup, ButtonGroup, ButtonGroupItem, TextField, Row, Col, Button, Textarea } from 'svelte-materialify';
    import SubtaskButton from './SubtaskButton.svelte';
    import { createEventDispatcher } from 'svelte';
	import { countid, all_task_store, userAcc, task_store } from "./store.js"

    import { firestore } from './firebase';
    import { collectionData } from 'rxfire/firestore';
    import { startWith } from 'rxjs/operators';
    import { onMount } from 'svelte';
    import User from "./User.svelte"
	
	let open = true;

    export let task;
    export let offset;
    let children = [""];

    let active = false;

    console.log("active");
    console.log(task);
    console.log(task.child_tasks);

    if (task.child_tasks != [""]) {
        children = task.child_tasks;
    }

    const dispatch = createEventDispatcher();

    function sendEvent(event) {
        const { parent_task_obj } = event.detail;
        console.log(task)

		dispatch('clicked', { parent_task_obj });
	};

</script>

<style>
	.listitem {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
</style>




{#if children[0] != ""}
    <ListGroup bind:active offset={offset+10}>
        <span slot="activator"> 
            <div class="listitem">
                {task.name} <SubtaskButton task={task} on:clicked={sendEvent}/>
            </div>
            <div class="listitem">
                {task.description} Due: {task.due_date} ETC: {task.estimated_time_completion} 
            </div>    
        </span>
        {#each children as child}
            <svelte:self task={child} offset={offset+10} on:clicked={sendEvent}/>
        {/each}
    </ListGroup>
{:else}
    <ListItem>
        <div class="listitem">
            {task.name} <SubtaskButton task={task} on:clicked={sendEvent}/>
        </div>
        <div class="listitem">
            {task.description} Due: {task.due_date} ETC: {task.estimated_time_completion}
        </div>
    </ListItem>
{/if}