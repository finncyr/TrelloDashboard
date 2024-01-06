// client/src/components/MemberBlock.js
/**
 * This file handles the MemberBlock component.
 * 
 * @file   This file defines the MemberBlock component
 * @author finncyr
 * @since  2023-11-20
 */
import React from 'react';
import {sha256} from 'js-sha256';

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
                    if(member['email'] == null) {
                        member['email'] = member['id'];
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
                                    alt='member picture'
                                    title={member['fullName']}
                                    src={getGravatarURL(member['email'], member['fullName'])} />
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

function getGravatarURL( email, fullName ) {
    const address = String( email ).trim().toLowerCase();
    const hash = sha256( address );
    const namesplit = String( fullName ).split();
    return `https://www.gravatar.com/avatar/${ hash }?d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${namesplit[0]}/80/random`;
}

export default MemberBlock;