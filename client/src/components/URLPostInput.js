// client/src/components/URLPostInput.js
/**
 * This file handles the URLPostInput component.
 * 
 * @file   This file defines the Input component for the URL of the Trello Board to be used by the Dashboard. 
 * @author finncyr
 * @since  2023-11-20
 */
import React, { Component, useState } from 'react';

class URLPostInput extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
        // Send data to the backend via POST
        fetch('/api/setboard', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({url: this.state.value})
        })
        .then(res => {
            if (res.ok) window.location.reload();
            else alert("Error! Status Code: " + res.status + "\n" + res.statusText);
        })
        event.preventDefault();
    }
  
    render() {
      return (
        <div class="url-poster-wrapper">
        <form onSubmit={this.handleSubmit}>
          <label class='boardURL-label'>
            Board-URL:
            <input class='url-poster' type="text" placeholder="URL of Tello Board" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input class="url-poster-submit" type="submit" value="Update" />
        </form>
        </div>
      );
    }
  }

export default URLPostInput;