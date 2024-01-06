// client/src/App.js
/**
 * This file handles the React App.
 *
 * Inside this file you can find all App components and the main App function.
 *
 * @file   Main file for the React App.
 * @author finncyr
 * @since  2023-11-01
 */

import React from "react";
import ProgressBlock from "./components/ProgressBlock.js";
import "./App.css";
import URLPostInput from "./components/URLPostInput.js";
import SPIMiniBlock from "./components/SPIMiniBlock.js";
import SVMiniBlock from "./components/SVMiniBlock.js";
import RUMiniBlock from "./components/RUMiniBlock.js";
import TaskBlock from "./components/TaskBlock.js";
import MemberBlock from "./components/MemberBlock.js";
import ZoneWrapper from "./components/ZoneWrapper.js";

function App() {
  const [tr_title, setTr_title] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/title")
      .then((res) => res.json())
      .then((tr_title) => setTr_title(tr_title.message));
  }, []);

  return (
    <>
    <div class="main-dash">

      <div class="header-bar">
        <div class="header"></div>
        <div class="trello-dash">TrelloDash</div>
        <div class="project-abcd">{!tr_title ? "No Project found!" : "Project: " + tr_title}</div>
        <URLPostInput />
      </div>

      <div class="body-content">
        <ProgressBlock />

        <div class="mini-blocks">
          <SPIMiniBlock />
          <SVMiniBlock />
          <RUMiniBlock />
        </div>

        <MemberBlock />
        <ZoneWrapper />
        <TaskBlock />

        <div class="footer"><a href="/api-docs">visit the api documentation</a></div>
      </div>
    </div>
    </>

  );
}

export default App;
