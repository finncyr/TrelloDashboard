import React from 'react';

function SPIMiniBlock (props) {

    const [spi, setSpi] = React.useState(null);

    React.useEffect(() => {
        fetch("/api/board/spi")
            .then((res) => res.json())
            .then((spi) => setSpi(spi));
    })

    return(
        <>
        <div class="spi-mini-block" title="Efficiency of the tasks due up to the current time in Percent">
            <div class="spi" title="Schedule Performance Index">SPI</div>
            <div class="_1-103" style={{color: spi < 0.6 ? "#ae1818" : (spi < 0.8 ? "#e9770f" : "#1bae18")}}>{Math.round(spi*100)}%</div>
        </div>
        </>
    )
}

export default SPIMiniBlock;