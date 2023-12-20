import React, { Component } from 'react';

function TaskBlock (props) {

      
    return(
        <>
        <div class="tasks">
        <div class="rectangle-3"></div>
        <div class="tasks2">Tasks</div>
        <div class="task-2">
          <div class="aufgabe-1-2-testbeschreibung">
            Aufgabe 1.2 - Testbeschreibung
          </div>
          <div class="frame-1">
            <img class="ellipse-14" src="ellipse-14.png" />
            <div class="zone-label">
              <div class="zone-a2">Zone A</div>
            </div>
            <div class="label-b">
              <div class="due-in-10-minutes">due in 10 minutes</div>
            </div>
          </div>
        </div>
        <div class="task-3">
          <div class="aufgabe-1-3-testbeschreibung">
            Aufgabe 1.3 - Testbeschreibung
          </div>
          <div class="frame-1">
            <img class="ellipse-14" src="ellipse-14.png" />
            <div class="zone-label">
              <div class="zone-a2">Zone A</div>
            </div>
            <div class="label-b">
              <div class="due-in-10-minutes">due in 10 minutes</div>
            </div>
          </div>
        </div>
        <div class="task">
          <div class="aufgabe-1-1-testbeschreibung">
            Aufgabe 1.1 - Testbeschreibung
          </div>
          <div class="frame-2">
            <img class="ellipse-15" src="ellipse-15.png" />
            <div class="zone-label2">
              <div class="zone-a2">Zone A</div>
            </div>
            <div class="label-b2">
              <div class="due-in-2-hours">due in 2 hours</div>
            </div>
          </div>
        </div>
        <svg
          class="vector10"
          width="25"
          height="8"
          viewBox="0 0 25 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.625 3.51562C15.625 5.45898 14.0527 7.03125 12.1094 7.03125C10.166 7.03125 8.59375 5.45898 8.59375 3.51562C8.59375 1.57227 10.166 0 12.1094 0C14.0527 0 15.625 1.57227 15.625 3.51562ZM20.7031 0C18.7598 0 17.1875 1.57227 17.1875 3.51562C17.1875 5.45898 18.7598 7.03125 20.7031 7.03125C22.6465 7.03125 24.2188 5.45898 24.2188 3.51562C24.2188 1.57227 22.6465 0 20.7031 0ZM3.51562 0C1.57227 0 0 1.57227 0 3.51562C0 5.45898 1.57227 7.03125 3.51562 7.03125C5.45898 7.03125 7.03125 5.45898 7.03125 3.51562C7.03125 1.57227 5.45898 0 3.51562 0Z"
            fill="black"
          />
        </svg>
      </div>
        </>
    )
}

export default TaskBlock;