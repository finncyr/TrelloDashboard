import React, { Component } from 'react';

function PeopleWrapper (props) {

    const [listmembers, setListmembers] = React.useState(props.listmembers || []);
    const [members, setMembers] = React.useState([]);

    React.useEffect(() => {
        listmembers.forEach(el => {
            fetch("/api/members/" + el)
            .then((res) => res.json())
            .then((member) => {
                setMembers(members => [...members, member]);
            });
        });
    });


    return(
        <>
        {members.map((member) => (
              <img 
                class="ellipse-1"
                title={member['fullName']}
                src={"https://gravatar.com/avatar/" + member['gravatarHash']} />))}
        </>
    )
}

export default PeopleWrapper;