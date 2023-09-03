// client/src/App.js

import React from "react";
import ProgressBlock from "./components/ProgressBlock.js";
import "./App.css";
import URLPostInput from "./components/URLPostInput.js";
import SPIMiniBlock from "./components/SPIMiniBlock.js";

function App() {
  const [tr_title, setTr_title] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/title")
      .then((res) => res.json())
      .then((tr_title) => setTr_title(tr_title.message));
  }, []);

  return (
    <div class="main-dash">
      <div class="header-bar">
        <div class="header"></div>
        <div class="trello-dash">TrelloDash</div>
        <div class="project-abcd">{!tr_title ? "No Project found!" : "Project: " + tr_title}</div>
      </div>
      <ProgressBlock />
      <URLPostInput />
      <SPIMiniBlock />
    </div>

  );
}

export default App;
