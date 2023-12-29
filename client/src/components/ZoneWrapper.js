import React, { Component } from 'react';
import ZoneBlock from './ZoneBlock.js';

function ZoneWrapper (props) {

    const [lists, setLists] = React.useState([]);

    React.useEffect(() => {
        fetch("/api/lists")
        .then((res) => res.json())
        .then((lists) => {
            const filteredlists = lists.filter(function(el){
                return el.name != "INFO";
            });
            setLists(filteredlists);
        });
    });
      
    return(
        <>
        <div className="zone-holder">
          <div className="border"></div>
          <div className="zones">Zones</div>
            <div class="zones2">
                {lists.map((list) => (
                    <ZoneBlock 
                    name={list['name']}
                    id={list['id']}
                    />
                ))}
            </div>
        </div>
        </>
    )
}

export default ZoneWrapper;