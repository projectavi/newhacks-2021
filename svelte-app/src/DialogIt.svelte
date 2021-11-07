<script>
    import { all_task_store, task_store, countid, userAcc } from "./store.js";
    import { str_to_date, calculate_timeRemaining, choose_task } from "./chooseTask";
    import { onMount } from 'svelte';
    import Typewriter from 'svelte-typewriter';
    import User from './User.svelte';
    import { firestore } from './firebase';
    import { collectionData } from 'rxfire/firestore';
    import { startWith } from 'rxjs/operators';

    let uid = $userAcc.uid;

    let doc_id;

    const query = firestore.collection('profiles').where('uid', '==', uid).orderBy('saved');

    const profiles = collectionData(query, 'id').pipe(startWith([]));

    let FLAG_newUser = true;

    let FLAG_subtask = false;

    let data = {
        name: $userAcc.displayName,
        email: $userAcc.email,
        phone: "",
        tasks: $all_task_store,
        tasks_heirarchy: $task_store,
    }
    
    let task_id = $countid;
    
    let tasks = $all_task_store;
    let tasks_heirarchy = $task_store;

    let visible1 = true;
    let visible2 = true;
    
    let task_name = 'my_task for now';

    onMount(() => {
		task_name = choose_task(tasks);
        console.log(task_name);
	});

    const quotes = ["We cannot solve problems with the kind of thinking we employed when we came up with them.", "Learn as if you will live forever, live like you will die tomorrow.", "It is better to fail in originality than to succeed in imitation.", "Success usually comes to those who are too busy looking for it."];

    let quote1 = quotes[0];
    let quote2 = quotes[1];

    function fillInfo(event) {
      const { id, new_data } = event.detail;
      doc_id = id;
      Object.keys(new_data).forEach(function(key) {
          data[key] = new_data[key]
      })
      FLAG_newUser = false;
      if (Object.keys(new_data).length != Object.keys(data).length) {
          firestore.collection('profiles').doc(id).delete();
          firestore.collection('profiles').add({ uid, data, saved: Date.now() });
      }
      tasks = data.tasks;
      tasks_heirarchy = data.tasks_heirarchy;
      task_id = data.tasks[data.tasks.length-1].id;
      $countid = task_id;
      $all_task_store = tasks;
    }

    function endDialog() {
        deleteTask(task_name, tasks);
        if (tasks.length == 0) {
            task_name = {name : "Congratulations! You've Finished your Todo List!", id: -1};
        }
        else {
            task_name = choose_task(tasks);
        }
        console.log(task_name);

    }

    function updateProfile(id) {
        firestore.collection('profiles').doc(id).delete();
        console.log(data);
        firestore.collection('profiles').add({ uid, data, saved: Date.now() });
    }

    function deleteTask(task_obj, tasks) {
        delete_heirarchy(tasks_heirarchy, task_obj);

        console.log(tasks_heirarchy);

        for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == task_obj.id || tasks[i].parentTask == task_obj.id) {
            tasks.splice(i, 1);
        }
        }

        $all_task_store = tasks;
        $task_store = tasks_heirarchy;
        data.tasks = tasks;
        data.tasks_heirarchy = tasks_heirarchy;
        updateProfile(doc_id);
    }

    function delete_heirarchy(task_list, task_obj) {
        console.log(task_list);
        const index = task_list.indexOf(task_obj);
        for (var i = 0; i < task_list.length; i++) {
            if (task_list[i].id == task_obj.id) {
                task_list.splice(i, 1);
                console.log(task_list);
                return 0;
            }
            else {
                for (var j = 0; j < task_list.length; j++) {
                    console.log(task_list)
                    // console.log(i)
                    // console.log(task_list[i])
                    // console.log(taskid)
                    if (task_list[j].child_tasks[0] != "") {
                        if (delete_heirarchy(task_list[j].child_tasks, task_obj) == 0) {
                            return 0;
                        }
                        else 
                        {
                            continue;
                        }
                    }
                }
            }
        }
        
    }
</script>

<body>
    <div id='top' class="middle">
        {#if visible1}
        <Typewriter loopRandom interval={225}>
            <blockquote class="quote">We cannot solve problems with the kind of thinking we employed when we came up with them.</blockquote>
            <blockquote class="quote">Learn as if you will live forever, live like you will die tomorrow.</blockquote>
            <blockquote class="quote">It is better to fail in originality than to succeed in imitation.</blockquote>
            <blockquote class="quote">Success usually comes to those who are too busy looking for it.</blockquote>
            <blockquote class="quote">You didn't come this far only to give up.</blockquote>
            <blockquote class="quote">A little progress each day adds up to big results.</blockquote>
            <blockquote class="quote">Push yourself, because no one else is going to do it for you.</blockquote>
            <blockquote class="quote">The future depends on what you do today.</blockquote>
        </Typewriter>
        {/if}
    </div>
    <div id='middle' class="middle">
        <button on:click={endDialog}>
            <blockquote class="dialog_task_name">{task_name.name}</blockquote>
        </button>
        
    </div>
    <div id='bottom' class="middle">
        {#if visible2}
        <Typewriter loopRandom interval={225}>
            <blockquote class="quote">We cannot solve problems with the kind of thinking we employed when we came up with them.</blockquote>
            <blockquote class="quote">Learn as if you will live forever, live like you will die tomorrow.</blockquote>
            <blockquote class="quote">It is better to fail in originality than to succeed in imitation.</blockquote>
            <blockquote class="quote">Success usually comes to those who are too busy looking for it.</blockquote>
            <blockquote class="quote">You didn't come this far only to give up.</blockquote>
            <blockquote class="quote">A little progress each day adds up to big results.</blockquote>
            <blockquote class="quote">Push yourself, because no one else is going to do it for you.</blockquote>
            <blockquote class="quote">The future depends on what you do today.</blockquote>
        </Typewriter>
        {/if}
    </div>
</body>
{#each $profiles as profile}
    <User {...profile} on:update={updateProfile} on:u_data={fillInfo} type="dialogit"/>
{/each}

<style>
    body {
        height: 100%;
        width: 100%;
        display: grid;
        background-color: #ffaa00;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1011%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='rgba(255%2c 170%2c 0%2c 1)'%3e%3c/rect%3e%3cpath d='M720 705.78C831.32 710.98 931.48 649 1012.98 572.98 1097.94 493.69 1175.67 396.21 1176.28 280 1176.89 163.35 1102.02 62.81 1016.07-16.07 934.23-91.18 831.04-141.53 720-138.85 611.4-136.19 510.93-82.51 437.97-2.03 368.47 74.57 337.3 176.61 340.15 280 342.94 380.37 386.36 471.86 453.2 546.8 524.84 627.11 612.49 700.75 720 705.78' fill='rgba(255%2c 197%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M720 555.51C792.03 558.87 856.84 518.77 909.57 469.57 964.55 418.27 1014.84 355.2 1015.24 280 1015.64 204.52 967.19 139.46 911.58 88.42 858.62 39.83 791.85 7.24 720 8.98 649.73 10.7 584.72 45.44 537.51 97.51 492.54 147.08 472.37 213.1 474.22 280 476.02 344.94 504.11 404.15 547.37 452.63 593.72 504.6 650.44 552.25 720 555.51' fill='rgba(255%2c 229%2c 41%2c 1)'%3e%3c/path%3e%3cpath d='M720 405.23C752.74 406.76 782.2 388.53 806.17 366.17 831.16 342.85 854.02 314.18 854.2 280 854.38 245.69 832.36 216.12 807.08 192.92 783.01 170.83 752.66 156.02 720 156.81 688.06 157.59 658.51 173.38 637.05 197.05 616.61 219.58 607.44 249.59 608.28 280 609.1 309.52 621.87 336.43 641.53 358.47 662.6 382.09 688.38 403.75 720 405.23' fill='rgba(255%2c 255%2c 102%2c 1)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1011'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
        background-attachment: fixed;   
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .middle {
        margin: auto;
        background-color: transparent;
    }

    .dialog_task_name {
        font-size: 30px;
    }

    .quote {
        font-size: 40px;
    }

    button:focus {
        background-color: transparent;
    }
</style>