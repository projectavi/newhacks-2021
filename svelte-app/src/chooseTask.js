class Task {
    constructor(title, priority, dueDate, timeRemaining, timeToComplete) {
        this.title = title;
        this.priority = priority;
        this.dueDate = dueDate;
        this.timeRemaining = timeRemaining;
        this.timeToComplete = timeToComplete;
    }
}


function str_to_date(date) {
    let date_list = date.split("/");
    return new Date(Number(date_list[0]), Number(date_list[1]) - 1, Number(date_list[2]), Number(date_list[3]), Number(date_list[4]));
}

function calculate_timeRemaining(date) {
    return (str_to_date(date) - Date.now()) / 1000 / 60;
}

function choose_task(task_list) {
    for (let i = 0; i < task_list.length; i++) {
        task_list[i].timeRemaining = calculate_timeRemaining(task_list[i].dueDate);
    }
    console.log(typeof(task_list));
    task_list.sort(function (a, b) {
        return a.timeRemaining - b.timeRemaining;
    });
    let filter_two_hours = [];
    let least_timeRemaining = task_list[0];
    let filter_highest_priority = [];

    for (let i = 0; i < task_list.length; i++) {
        if (task_list[i].timeRemaining >= least_timeRemaining.timeRemaining + 5 * 60) {
            break;
        }
        filter_two_hours.push(task_list[i]);
    }
    filter_two_hours.sort(function (a, b) {
        return b.priority - a.priority;
    });
    console.log(filter_two_hours)
    for (let i = 0; i < filter_two_hours.length; i++) {
        if (filter_two_hours[i].task_priority != filter_two_hours[0].task_priority) {
            break;
        }
        filter_highest_priority.push(filter_two_hours[i]);
    }
    filter_highest_priority.sort(function (a, b) {
        return a.timeToComplete - b.timeToComplete;
    });
    return filter_highest_priority[0];
}

export { str_to_date, calculate_timeRemaining, choose_task };