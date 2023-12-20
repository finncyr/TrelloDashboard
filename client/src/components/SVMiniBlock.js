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
        <div class="sv-block">
            <div class="rectangle-4"></div>
            <div class="sv">SV</div>
            <div class="_1-2" style={{color: sv >= 0 ? "#1bae18" : "#ae1818"}}>{sv}</div>
        </div>
        </>
    )
}

export default SVMiniBlock;