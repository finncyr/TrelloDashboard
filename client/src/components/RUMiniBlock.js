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
        <div class="ru-mini-block">
            <div class="rectangle-4"></div>
            <div class="ru">RU</div>
            <div class="_86" style={{color: ru < 1 ? "#1bae18" : "#ae1818"}}>{Math.round(ru*100)}%</div>
        </div>
        </>
    )
}

export default RUMiniBlock;