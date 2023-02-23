class TaskSerializer {
  static getSummary(task) {
    const allowedAttributes = ["id", "name", "description", "startDate", "endDate", "interval"];

    let serializedTask = {};
    for (const attribute of allowedAttributes) {
      serializedTask[attribute] = task[attribute];
    }
    serializedTask.startDate = new Date(serializedTask.startDate);

    return serializedTask;
  }

  static getSummaries(tasks) {
    return tasks.map(task => TaskSerializer.getSummary(task));
  }

  static filterTasksForDate(tasks, currentDate) {
    return tasks.filter(task => {
      // console.log("asdfasdfadsfasasdsdfsfs")
      // console.log(task.startDate)
      const datesMillisecondsDifference = currentDate - task.startDate;
      const datesDaysDifference = Math.floor(datesMillisecondsDifference / (1000 * 60 * 60 * 24));
      // console.log(datesMillisecondsDifference)
      // console.log(datesDaysDifference)
      // console.log(task.interval)
      // console.log(!(datesDaysDifference % task.interval))
      return datesDaysDifference >= 0 ? !(datesDaysDifference % task.interval) : false;
    })
  }
}

export default TaskSerializer;