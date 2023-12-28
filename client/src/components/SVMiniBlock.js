import React, { Component } from 'react';

function SVMiniBlock (props) {

    const [sv, setSv] = React.useState(null);

    React.useEffect(() => {
        fetch("/api/board/sv")
          .then((res) => res.json())
          .then((sv) => setSv(sv));
      })
      
    return(
        <>
        <div class="sv-block" title="Average remaining Time in Minutes until all tasks must have started to meet the deadline">
            <div class="rectangle-4"></div>
            <div class="sv" title="Average Schedule Variance">ASV</div>
            <div class="_1-2" style={{color: sv >= 0 ? "#1bae18" : "#ae1818"}}>{sv + "\nmin"}</div>
        </div>
        </>
    )
}

export default SVMiniBlock;