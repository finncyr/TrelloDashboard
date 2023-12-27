import React, { Component } from 'react';

function ProgressBlock (props) {

  const [alltasks, setAlltasks] = React.useState(null);
  const [opentasks, setOpentasks] = React.useState(null);

  const [maxwidth, setMaxwidth] = React.useState(0);
  const maxRef = React.useRef(null);

  React.useEffect(() => {
    fetch("/api/counts/alltasks")
      .then((res) => res.json())
      .then((alltasks) => setAlltasks(alltasks));
  })

  React.useEffect(() => {
    fetch("/api/counts/closedtasks")
      .then((res) => res.json())
      .then((opentasks) => setOpentasks(opentasks));
  })

  React.useEffect(() => {
    setMaxwidth(maxRef.current.offsetWidth);
  })

  return(
    <div class="progress-block">
        <div class="rectangle-1"></div>
        <div class="completion-of-tasks">Completion of Tasks</div>
        <div class="rectangle-5" ref={maxRef}></div>
        <div class="rectangle-6" style={{width: ((maxwidth/alltasks) * opentasks)}}></div>
        <div class="_12-23-tasks-done">{opentasks} / {alltasks} Tasks done</div>
    </div>
  )
}

export default ProgressBlock;