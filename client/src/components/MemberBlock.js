import React, { Component } from 'react';

function MemberBlock (props) {

    const [members, setMembers] = React.useState([]);

    React.useEffect(() => {
        fetch("/api/members")
        .then((res) => res.json())
        .then((boardmembers) => {
            boardmembers.forEach(el => {
                fetch("/api/members/" + el['id'])
                .then((res) => res.json())
                .then((member) => {
                    if(member['gravatarHash'] == null) {
                        member['gravatarHash'] = member['id'];
                      }
                    var combinedmember = {...member, availabletime: el['availabletime']};
                    setMembers(members => [...members, combinedmember]);
                });
            });
        });
    }, []);

      
    return(
        <>
        <div class="members">
            <div class="rectangle-2"></div>
            <div class="member-title">Members</div>

            <table class="member-list" >
                <tbody>
                    <tr class="tableheader">
                        <td>Picture</td>
                        <td>Name</td>
                        <td>Available</td>
                    </tr>
                    {members.map((member) => (
                    <tr>
                        <td>
                            <img 
                                class="ellipse-1"
                                title={member['fullName']}
                                src={"https://gravatar.com/avatar/" + member['gravatarHash'] + "?d=retro"} />
                        </td>
                        <td class="member-name">{member['fullName']}</td>
                        <td class="member-time">{minToTime(member['availabletime'])}h</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        </>
    )
}

function minToTime(min) {
    var hours = Math.floor(min / 60)
    var minutes = min % 60;

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (hours < 10) {
        hours = "0" + hours
    }
    return hours + ":" + minutes;
}

export default MemberBlock;