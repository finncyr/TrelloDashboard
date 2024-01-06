// client/src/components/ProgressBlock.js
/**
 * This file handles the ProgressBlock component.
 * 
 * @file   This file defines the ProgressBlock component
 * @author finncyr
 * @since  2023-11-20
 */
import React from 'react';

function ProgressBlock (props) {

  const [counts, setCounts] = React.useState({});

  const [maxwidth, setMaxwidth] = React.useState(0);
  const maxRef = React.useRef(null);

  React.useEffect(() => {
    fetch("/api/counts/")
      .then((res) => res.json())
      .then((counts) => setCounts(counts));
  }, []);

  React.useEffect(() => {
    setMaxwidth(maxRef.current.offsetWidth);
  }, []);

  return(
    <div class="progress-block">
        <div class="rectangle-1"></div>
        <div class="completion-of-tasks">Completion of Tasks</div>
        <div class="rectangle-5" ref={maxRef}></div>
        <div class="rectangle-6" style={{width: ((maxwidth/counts.alltasks) * counts.closedtasks)}}></div>
        <div class="_12-23-tasks-done">{counts.closedtasks} / {counts.alltasks} Tasks done</div>
    </div>
  )
}

export default ProgressBlock;