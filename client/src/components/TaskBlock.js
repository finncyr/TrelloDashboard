import React, { Component } from 'react';
import {sha256} from 'crypto-hash';

function TaskBlock (props) {

  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/criticaltasks")
    .then((res) => res.json())
    .then((criticaltasks) => {
        criticaltasks.forEach(el => {
          var members = [];
          el['assignees'].forEach(assignee => {
            fetch("/api/members/" + assignee)
            .then((res) => res.json())
            .then((member) => {
                if(member['gravatarHash'] == null) {
                  member['gravatarHash'] = member['id'];
                }
                var combinedtask = {...el, members: [...members, member]};
                setTasks(tasks => [...tasks, combinedtask]);
            });
          });
      });
    });
  }, []);

      
    return(
      <>
      <div class="tasks">
        <div class="tasks2">Critical Tasks</div>
        <div class="rectangle-3">
          {tasks.sort((a, b) => (a['due'] > b['due']) ? 1 : -1)
          .map((task) => (
            <div class="task" style={{background: (((Date.parse(task['due']) - Date.now()) < 0) && !task['dueComplete'] ? "#fe9894" :(task['dueComplete'] ? "#a1cea5" : "#d9d9d9"))}}>
            <div class="aufgabe-1-1-testbeschreibung" style={{textDecoration: task['dueComplete'] ? "line-through" : ""}}>
              {task['name']}
            </div>
            <div class="frame-2">
            {task['members'].map((member) => (
                <img 
                  class="ellipse-15"
                  title={member['fullName']}
                  src={"https://gravatar.com/avatar/" + member['gravatarHash'] + "?d=retro"} />))}
              <div class="zone-label2">
                <div class="zone-a2">{task['listname']}</div>
              </div>
              <div class="label-b2">
                <div class="due-in-2-hours">{timeStringUntilDue(task['due'], task['dueComplete'])}</div>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
      </>
    )
}

function timeStringUntilDue(due, dueComplete) {
  var now = new Date();
  var dueDate = new Date(due);
  var diff = dueDate - now;
  var hours = Math.floor(diff / 1000 / 60 / 60);
  var minutes = Math.floor(diff / 1000 / 60 - hours * 60);
  var days = Math.floor(hours / 24);
  var finalString = "";

  if (dueComplete){
    finalString = "completed";
  }
  else if (diff < 0){
    finalString = "overdue";
  }
  else if (days > 0) {
    finalString = "due in " + days + " days";
  }
  else if (hours > 0) {
    finalString = "due in " + hours + " hours";
  }
  else if (minutes > 0) {
    finalString = "due in " + minutes + " min";
  }
  else if (minutes == 0){
    finalString = "due now";
  }

  return finalString;
}

export default TaskBlock;