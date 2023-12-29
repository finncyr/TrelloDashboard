import React, { Component } from 'react';

function RUMiniBlock (props) {

    const [ru, setRu] = React.useState(null);

    React.useEffect(() => {
        fetch("/api/board/ru")
        .then((res) => res.json())
        .then((ru) => setRu(ru));
    })
      
    return(
        <>
        <div class="ru-mini-block" title="Workload of the open tasks distributed thoughout all workers">
            <div class="rectangle-4"></div>
            <div class="ru" title="Ressource Utilization">RU</div>
            <div class="_86" style={{color: ru > 1 ? "#ae1818" : (ru > 0.90 ? "#e9770f" : "#1bae18")}}>{Math.round(ru*100)}%</div>
        </div>
        </>
    )
}

export default RUMiniBlock;