<script>
  import { countid, all_task_store, userAcc, task_store } from "./store.js"
  import { List, ListItem, MaterialApp, ListGroup, ButtonGroup, ButtonGroupItem, TextField, Row, Col, Button, Textarea } from 'svelte-materialify';

  import { firestore } from './firebase';
  import { collectionData } from 'rxfire/firestore';
  import { startWith } from 'rxjs/operators';
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import User from "./User.svelte"
  import SubtaskButton from "./SubtaskButton.svelte"
  import TaskItem from "./TaskItem.svelte"
  import { Router, Route, Link, navigate } from "svelte-navigator";

  const etcRegExp = /^[0-9][0-9]\:[0-9][0-9]$/;
  const dueDateRegExp = /^[0-9]{4}\/[0-1][0-9]\/[0-3][0-9]\/[0-2][0-9]\/[0-6][0-9]$/;
  const priorityRegExp = /^[1-5]$/;

  export let uid = $userAcc.uid;

  const query = firestore.collection('profiles').where('uid', '==', uid).orderBy('saved');

  const profiles = collectionData(query, 'id').pipe(startWith([]));

  let FLAG_newUser = true;

  let FLAG_subtask = false;

  let data = {
      name: $userAcc.displayName,
      email: $userAcc.email,
      phone: "",
      tasks: [],
      tasks_heirarchy: [],
  }
  
  let task_id = $countid;
  let tasks = [];
  let tasks_heirarchy = [];

  let doc_id;

  let isAddTask = false;
  let active = false;
 
  let task = "";
  let description = "";
  let priority = "";
  let dueDate = "";
  let timeToComplete = "";
  let parentTask = "";
  let timeRemaining = "";
  let child_tasks = [""];

  function clear_fields() {
    task = "";
    description = "";
    priority = "";
    dueDate = "";
    timeToComplete = "";
    parentTask = "";
    timeRemaining = "";
    child_tasks = [""];
  }

  function addTask() {
    isAddTask = !(isAddTask);
    console.log(typeof(tasks[0].timeToComplete));
  }

  function find_parent(task_list, taskid, new_task) {
    for (var i = 0; i < task_list.length; i++) {
      // console.log(task_list)
      // console.log(i)
      // console.log(task_list[i])
      // console.log(taskid)
      if (task_list[i].id == taskid) {
        if (task_list[i].child_tasks[0] == "") {
          console.log("run");
          task_list[i].child_tasks = [new_task];
          return 0;
        } else {
          console.log("run2");
          task_list[i].child_tasks.push(new_task);
          return 0;
        }
      }
      else {
      if (task_list[i].child_tasks[0] != "") {
          if (find_parent(task_list[i].child_tasks, taskid, new_task) == 0) {
            return 0;
          }
          else {
            continue;
          }
      }
      }
    }
    // task_list.forEach(taskc => {
    //   if (taskc.id == taskid) {
    //     if (taskc.child_tasks[0] == "") {
    //       taskc.child_tasks = [new_task];
    //     } else {
    //       taskc.child_tasks.push(new_task);
    //     }
    //   }
    //   else {
    //     find_parent(taskc.child_tasks, taskid, new_task);
    //   }
    // });
  }

  function submittedTask() {
    task_id = task_id + 1;
    console.log(task_id);

    if (!etcRegExp.test(timeToComplete)) {
      alert("Please enter a valid time to complete");
      return;
    }
    if (!dueDateRegExp.test(dueDate)) {
      alert("Please enter a valid due date");
      return;
    }
    if (!priorityRegExp.test(priority)) {
      alert("Please enter a valid priority");
      return;
    }

    let newTask = {id: task_id, name: task, description: description, priority: priority, dueDate: dueDate, timeToComplete: timeToComplete, parentTask: parentTask, timeRemaining: timeRemaining, child_tasks: child_tasks};
    if (FLAG_subtask) {
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == parentTask) {
          if (tasks[i].child_tasks[0] == "") {
            tasks[i].child_tasks = [];
          }
          tasks[i].child_tasks.push(task_id);
        }
      }
      const dum = find_parent(tasks_heirarchy, parentTask, newTask);
      FLAG_subtask = false;
    }
    else {
      tasks_heirarchy.push(newTask);
    }
    $countid = task_id;
    console.log(task_id);
    clear_fields();
    tasks.push(newTask);
    $all_task_store = tasks;
    $task_store = tasks_heirarchy;
    console.log(newTask);
    isAddTask = false;
    data.tasks = tasks;
    data.tasks_heirarchy = tasks_heirarchy;
    updateProfile(doc_id);
  }

  function updateProfile(id) {
      firestore.collection('profiles').doc(id).delete();
      console.log(data);
      firestore.collection('profiles').add({ uid, data, saved: Date.now() });
  }

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

  function addNewProfile() {
      firestore.collection('profiles').add({ uid, data, saved: Date.now() })
      alert("Your profile has been added.")
  }

  function addSubTask(event) {
    const { parent_task_obj } = event.detail;
    console.log(parent_task_obj);
    FLAG_subtask = true;
    parentTask = parent_task_obj.id;
    isAddTask = true;
  }

  function deleteTask(event) {
    const { task_obj } = event.detail;
    delete_heirarchy(tasks_heirarchy, task_obj);

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
    console.log(typeof task_list);
    let taskid = task_obj.id;
    const index = task_list.indexOf(task_obj);
    if (index > -1) {
      task_list.splice(index, 1);
      return 0;
    }
    else {
      for (var i = 0; i < task_list.length; i++) {
        // console.log(task_list)
        // console.log(i)
        // console.log(task_list[i])
        // console.log(taskid)
        if (task_list[i].child_tasks[0] != "") {
            if (delete_heirarchy(task_list[i].child_tasks, task_obj) == 0) {
              return 0;
            }
            else {
              continue;
            }
        }
      }
    }
  }

</script>

<body>
    <div id='top'></div>
    <div id='middle' class="middle">
      {#if !isAddTask}
      <MaterialApp>
        <div class="d-flex justify-center boxx">
          <List class="elevation-2" style="width:100%">
          <div class="boxx">
          {#each tasks_heirarchy as task}
            {#if task.child_tasks[0] == ""}
              <ListItem>
                <div class="listitem">
                  {task.name} <SubtaskButton task={task} on:clicked={addSubTask} on:delete={deleteTask}/>
                </div>
                <div class="listitem">
                  {task.description} Due: {task.dueDate} ETC: {task.timeToComplete} 
                </div>
              </ListItem>
            {:else}
              <ListGroup bind:active offset={26}>
                <span slot="activator"> 
                    <div class="listitem">
                        {task.name} <SubtaskButton task={task} on:clicked={addSubTask} on:delete={deleteTask}/>
                    </div>  
                    <div class="listitem">
                      {task.description} | Due: {task.dueDate} | ETC: {task.timeToComplete} 
                    </div>  
                </span>
                {#each task.child_tasks as child}
                  {#if typeof child != undefined}
                    <TaskItem task={child} offset={26} on:clicked={addSubTask} on:delete={deleteTask}/>
                  {/if}
                {/each}
              </ListGroup>
            {/if}
          {/each}
          </div>
          </List>
        </div>
      </MaterialApp>
      {:else}
      <MaterialApp>
        <div class="sexy">
          <Row>
            <Col>
              <TextField dense rounded filled bind:value={task}>Task Name</TextField>
              <br />
              <TextField dense rounded filled bind:value={priority}>Priority [1-5]</TextField>
            </Col>
            <Col>
              <TextField dense rounded filled bind:value={dueDate}>Due Date [YYYY/MM/DD/HH/MM]</TextField>
              <br />
              <TextField dense rounded filled bind:value={timeToComplete}>Time to Complete [HH:MM]</TextField>
            </Col>
          </Row>
          <Textarea noResize placeholder="Description of Task." bind:value={description}>Description</Textarea>
          <Button depressed on:click={submittedTask}>Submit</Button>
          <Button depressed on:click={addTask}>Cancel</Button>
        </div>
      </MaterialApp>
      {/if}
    </div>
    <div id='bottom' class="middle">
      <MaterialApp>
        <div class="text-center sexy">
          <ButtonGroup rounded activeClass="primary-color">
            <ButtonGroupItem on:click={addTask}>Add Task</ButtonGroupItem>
            <Link to="/dialogit">
              <ButtonGroupItem rounded>Dialog It</ButtonGroupItem>
            </Link>
          </ButtonGroup>
        </div>
      </MaterialApp>
    </div>
    {#each $profiles as profile}
        <User {...profile} on:update={updateProfile} on:u_data={fillInfo} type="tasks"/>
    {/each}
</body>

<style>
    .d-flex {
      width: 60%;
    }

    .listitem {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    body {
        height: 100%;
        width: 100%;
        display: grid;
        background-color: #ffaa00;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpath fill='%23ffb100' d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z'/%3E%3Cpath fill='%23ffb800' d='M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z'/%3E%3Cpath fill='%23ffbe00' d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'/%3E%3Cpath fill='%23ffc500' d='M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z'/%3E%3Cpath fill='%23ffcc00' d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'/%3E%3Cpath fill='%23ffd914' d='M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z'/%3E%3Cpath fill='%23ffe529' d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'/%3E%3Cpath fill='%23ffef3d' d='M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z'/%3E%3Cpath fill='%23fff852' d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'/%3E%3Cpath fill='%23ffff66' d='M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z'/%3E%3C/g%3E%3C/svg%3E");
        background-attachment: fixed;   
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .sexy {
        height: 100%;
        width: 100%;
        display: grid;
        background-color: #ffaa00;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpath fill='%23ffb100' d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z'/%3E%3Cpath fill='%23ffb800' d='M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z'/%3E%3Cpath fill='%23ffbe00' d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'/%3E%3Cpath fill='%23ffc500' d='M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z'/%3E%3Cpath fill='%23ffcc00' d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'/%3E%3Cpath fill='%23ffd914' d='M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z'/%3E%3Cpath fill='%23ffe529' d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'/%3E%3Cpath fill='%23ffef3d' d='M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z'/%3E%3Cpath fill='%23fff852' d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'/%3E%3Cpath fill='%23ffff66' d='M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z'/%3E%3C/g%3E%3C/svg%3E");
        background-attachment: fixed;   
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .boxx {
      width: 100%;
    }

    .middle {
        width: 50%;
        margin: auto;
        background-color: transparent;
    }
</style>