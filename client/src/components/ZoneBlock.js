import React, { Component } from 'react';

function ZoneBlock (props) {

  const [name, setName] = React.useState(props.name || "Unnamed Zone");
  const [id, setId] = React.useState(props.id || 0);

  const [allcards, setAllcards] = React.useState(0);
  const [closedcards, setClosedcards] = React.useState(0);
  const [members, setMembers] = React.useState([]);
  const [maxwidth, setMaxwidth] = React.useState(0);
  const [criticaltask, setCriticaltask] = React.useState(0);
  const [criticalopen, setCriticalopen] = React.useState(0);

  const maxRef = React.useRef(null);

  React.useEffect(() => {
    fetch("/api/lists/" + id)
      .then((res) => res.json())
      .then((list) => {
          setAllcards(list['allcards']);
          setClosedcards(list['closedcards']);
          setCriticaltask(list['criticaltask']);
          setCriticalopen(list['criticalopen']);
          list['listmembers'].forEach(el => {
            fetch("/api/members/" + el)
            .then((res) => res.json())
            .then((member) => {
                setMembers(members => [...members, member]);
            });
        });
      });
  }, []);

  React.useEffect(() => {
    setMaxwidth(maxRef.current.offsetWidth);
  })

      
    return(
        <>
        <div class="property-1-a">
          <div class="zone-a">{name}</div>
          <div class="progress-bar">
            <div class="rectangle-52" ref={maxRef}></div>
            <div class="rectangle-62" style={{width: ((maxwidth/allcards) * closedcards)}}>
              <div class={((maxwidth/allcards) * closedcards) >= 50 ? "_5-9" : "_5-9-empty"}>{closedcards}/{allcards}</div>
            </div>
            
          </div>
          <div class="people">
          {members.map((member) => (
              <img 
                class="ellipse-1"
                title={member['fullName']}
                src={"https://gravatar.com/avatar/" + member['gravatarHash']} />))}
          </div>
          
          <div class="critical-task">
            {criticalTaskBlock(criticaltask, criticalopen)}
          </div>

          <div class="on-time">
            <div class="rectangle-112"></div>
            <div class="tasks-on-time">Tasks on time</div>
            <svg
              class="vector5"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 0.615051C4.97581 0.615051 0.5 5.09086 0.5 10.6151C0.5 16.1392 4.97581 20.6151 10.5 20.6151C16.0242 20.6151 20.5 16.1392 20.5 10.6151C20.5 5.09086 16.0242 0.615051 10.5 0.615051ZM12.8024 14.732L9.24597 12.1473C9.12097 12.0546 9.04839 11.9094 9.04839 11.7562V4.96989C9.04839 4.70376 9.26613 4.48602 9.53226 4.48602H11.4677C11.7339 4.48602 11.9516 4.70376 11.9516 4.96989V10.5223L14.5121 12.3852C14.7298 12.5425 14.7742 12.8449 14.6169 13.0626L13.4798 14.6271C13.3226 14.8409 13.0202 14.8892 12.8024 14.732Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        </>
    )
}

function criticalTaskBlock(criticaltask, criticalopen){
  if(criticaltask > 0 && criticalopen > 0){
    return(
      <>
        <div class="rectangle-11"></div>
        <div class="_1-critical-task-open">{criticalopen} Critical Task open</div>
        <svg
          class="vector4" width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20.2749 15.8933C20.9158 17.0042 20.1113 18.3928 18.8313 18.3928H2.16855C0.886017 18.3928 0.0852531 17.002 0.724906 15.8933L9.05636 1.44786C9.69758 0.33644 11.3036 0.338454 11.9437 1.44786L20.2749 15.8933ZM10.5 12.9067C9.61789 12.9067 8.90279 13.6218 8.90279 14.5039C8.90279 15.3861 9.61789 16.1012 10.5 16.1012C11.3821 16.1012 12.0972 15.3861 12.0972 14.5039C12.0972 13.6218 11.3821 12.9067 10.5 12.9067ZM8.98358 7.16553L9.24115 11.8878C9.2532 12.1087 9.43591 12.2817 9.65719 12.2817H11.3428C11.5641 12.2817 11.7468 12.1087 11.7589 11.8878L12.0164 7.16553C12.0295 6.92685 11.8394 6.72616 11.6004 6.72616H9.39959C9.16056 6.72616 8.97056 6.92685 8.98358 7.16553Z"
            fill="white"
          />
        </svg>
      </>
    )
  }
  else if(criticaltask > 0 && criticalopen == 0){
    return(
      <>
        <div class="rectangle-113"></div>
        <div class="critical-tasks-done">Critical Tasks done</div>
        <svg
          class="vector6"
          width="21"
          height="19"
          viewBox="0 0 21 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.2749 15.8933C20.9158 17.0042 20.1113 18.3928 18.8313 18.3928H2.16855C0.886017 18.3928 0.0852531 17.002 0.724906 15.8933L9.05636 1.44786C9.69758 0.33644 11.3036 0.338454 11.9437 1.44786L20.2749 15.8933ZM10.5 12.9067C9.61789 12.9067 8.90279 13.6218 8.90279 14.5039C8.90279 15.3861 9.61789 16.1012 10.5 16.1012C11.3821 16.1012 12.0972 15.3861 12.0972 14.5039C12.0972 13.6218 11.3821 12.9067 10.5 12.9067ZM8.98358 7.16553L9.24115 11.8878C9.2532 12.1087 9.43591 12.2817 9.65719 12.2817H11.3428C11.5641 12.2817 11.7468 12.1087 11.7589 11.8878L12.0164 7.16553C12.0295 6.92685 11.8394 6.72616 11.6004 6.72616H9.39959C9.16056 6.72616 8.97056 6.92685 8.98358 7.16553Z"
            fill="white"
          />
        </svg>
      </>
    )}
    else{
      return(
        <>
        <div class="rectangle-113-2"></div>
        <div class="critical-tasks-done">No Critical Tasks</div>
        <svg
          class="vector6"
          width="21"
          height="19"
          viewBox="0 0 21 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.2749 15.8933C20.9158 17.0042 20.1113 18.3928 18.8313 18.3928H2.16855C0.886017 18.3928 0.0852531 17.002 0.724906 15.8933L9.05636 1.44786C9.69758 0.33644 11.3036 0.338454 11.9437 1.44786L20.2749 15.8933ZM10.5 12.9067C9.61789 12.9067 8.90279 13.6218 8.90279 14.5039C8.90279 15.3861 9.61789 16.1012 10.5 16.1012C11.3821 16.1012 12.0972 15.3861 12.0972 14.5039C12.0972 13.6218 11.3821 12.9067 10.5 12.9067ZM8.98358 7.16553L9.24115 11.8878C9.2532 12.1087 9.43591 12.2817 9.65719 12.2817H11.3428C11.5641 12.2817 11.7468 12.1087 11.7589 11.8878L12.0164 7.16553C12.0295 6.92685 11.8394 6.72616 11.6004 6.72616H9.39959C9.16056 6.72616 8.97056 6.92685 8.98358 7.16553Z"
            fill="white"
          />
        </svg>
      </>
      )
    }
}

export default ZoneBlock;