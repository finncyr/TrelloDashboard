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
                    var combinedmember = {...member, availabletime: el['availabletime'], usedtime: el['usedtime']};
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

            <div class="tablewrapper">
                <table class="member-list" >
                    <thead class="tableheader">
                        <th>Picture</th>
                        <th>Name</th>
                        <th>Available</th>
                        <th>Workload</th>
                    </thead>
                    
                    <tbody class="tablebody">
                        {members.sort((a, b) => (a['availabletime'] < b['availabletime']) ? 1 : -1)
                        .map((member) => (
                        <tr>
                            <td>
                                <img 
                                    class="ellipse-1"
                                    title={member['fullName']}
                                    src={"https://gravatar.com/avatar/" + member['gravatarHash'] + "?d=retro"} />
                            </td>
                            <td class="member-name">{member['fullName']}</td>
                            <td class="member-time">{minToTime(member['availabletime'])}h</td>
                            <td class="member-workload">{Math.round((member['usedtime'] / member['availabletime']) * 100)}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
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