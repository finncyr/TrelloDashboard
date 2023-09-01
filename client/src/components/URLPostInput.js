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
        //TODO: This wont work!
        fetch('/api/setboard', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({url: this.state.value})
        });
        event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label class='boardURL-label'>
            Board-URL:
            <input class='url-poster' type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input class="url-poster-submit" type="submit" value="Submit" />
        </form>
      );
    }
  }

export default URLPostInput;