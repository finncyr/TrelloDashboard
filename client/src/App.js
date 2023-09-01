// client/src/App.js

import React from "react";
import { ProgressBlock } from "./ProgressBlock";
import "./App.css";

function App() {
  const [tr_title, setTr_title] = React.useState(null);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/title")
      .then((res) => res.json())
      .then((tr_title) => setTr_title(tr_title.message));
  }, []);

  React.useEffect(() => {
    fetch("/api/test/trello")
      .then((res) => res.json())
      .then((data) => setData(data));
  })

  return (
    <div class="main-dash">
      <div class="header-bar">
        <div class="header"></div>
        <div class="trello-dash">TrelloDash</div>
        <div class="project-abcd">{!tr_title ? "No Project found!" : "Project: " + tr_title}</div>
        <div class="raumplan-anzeigen">Raumplan anzeigen</div>
      </div>
      <div class="progress-block">
        <div class="rectangle-1"></div>
        <div class="completion-of-tasks">Completion of Tasks</div>
        <div class="rectangle-5"></div>
        <div class="rectangle-6"></div>
        <div class="_12-23-tasks-done">1 / {data} Tasks done</div>
      </div>
    </div>

  );
}

export default App;
