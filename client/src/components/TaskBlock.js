import React, { Component } from 'react';

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
              members.push(member);
            });
          });
          var combinedtask = {...el, members: members};
          setTasks(tasks => [...tasks, combinedtask]);
      });
    });
  });

      
    return(
      <>
      <div class="tasks">
        <div class="rectangle-3"></div>
        <div class="tasks2">Critical Tasks</div>
        {tasks.map((task) => (
          <div class="task">
          <div class="aufgabe-1-1-testbeschreibung">
            {task['name']}
          </div>
          <div class="frame-2">
          {task['members'].map((member) => (
              <img 
                class="ellipse-15"
                title={member['fullName']}
                src={"https://gravatar.com/avatar/" + member['gravatarHash']} />))}
            <div class="zone-label2">
              <div class="zone-a2">{task['listname']}</div>
            </div>
            <div class="label-b2">
              <div class="due-in-2-hours">due in 2 hours</div>
            </div>
          </div>
        </div>
        ))}

      </div>
      </>
    )
}

export default TaskBlock;