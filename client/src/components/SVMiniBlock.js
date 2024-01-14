// client/src/components/SVMiniBlock.js
/**
 * This file handles the MiniBlock for the SV Metric component.
 *
 * @file   This file defines the SV Metric component
 * @author finncyr
 * @since  2023-11-20
 */
import React from "react";

function SVMiniBlock(props) {
  const [sv, setSv] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/board/sv")
      .then((res) => res.json())
      .then((sv) => setSv(sv));
  });

  return (
    <>
      <div
        class="sv-block"
        title="Amount of working-time the project is upfront or behind the schedule"
      >
        <div class="rectangle-4"></div>
        <div class="sv" title="Schedule Variance">
          SV
        </div>
        <div class="_1-2" style={{ color: sv >= 0 ? "#1bae18" : "#ae1818" }}>
          {sv + "\n\rmin"}
        </div>
      </div>
    </>
  );
}

export default SVMiniBlock;
