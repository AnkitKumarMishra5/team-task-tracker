import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, ListGroup, Badge } from 'react-bootstrap'
import './App.css';
import ManageAssignment from './components/ManageAssignment';
import axios from 'axios'
const API_URL = 'http://localhost:5000'

class App extends Component {
  state = {
    method: 'GET',
    lastRequest: '',

    id: '',
    title: '',
    order: '',
    completed: false,

    response: [],
    todos: []
  };

  componentDidMount = async () => {
    this.getAllTodos()
  }
  
  handleSubmit = async e => {
    e.preventDefault();
    let { method, id, title, order, completed } = this.state;
    
    let request = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    // Undefined ensures not changing to empty string.
    title = title ? title : undefined;
    order = order ? Number(order) : undefined;

    if (method !== "GET")
      request.body = JSON.stringify({ title, order, completed })

    this.setState({ lastRequest: `${method} at /${id}`});
    // Code smells, but the setup of todo-backend with get('/') returning a list of todos requires
    // that we directly hit localhost instead of being able to rely on the proxy.
    // We can only proxy non-root gets.
    let response;
    if (process.env.NODE_ENV === "development" && method === "GET" && id === '') {
      response = await fetch('http://localhost:5000/', request);
    } else {
      response = await fetch(`/${id}`, request);
    }
    this.getAllTodos()

    const contentType = response.headers.get('content-type');

    let body;
    if (contentType && contentType.includes('application/json')) {
      body = await response.json();
    } else if (contentType && contentType.includes('text/html')) {
      body = await response.text();
    }

    if (response.status !== 200) {
      console.log(body);
      this.setState({ response: [{ status: response.status, message: body }] });
      return;
    }

    // Ensures formart of [{}, {}, {}]
    if (!Array.isArray(body))
      body = Array(body);
  
    this.setState({ response: body });
  };

  changeMethod = event => {
    this.setState({ method: event.target.value });
  };

  getAllTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos/all/assigned-users`)
      this.setState({ todos: response.data })
    } catch (error) {
      alert(error.message)
    }
  }
  
  render() {
    const { method, lastRequest, id, title, order, completed, response } = this.state;

    const shouldDisplayIdInput = method !== "POST";
    const shouldDisplayTitleInput = method === "POST" || method === "PATCH";
    const shouldDisplayOrderInput = method === "POST" || method === "PATCH";
    const shouldDisplayCompletedInput = method === "PATCH";

    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <h3 className='display-6'>Manage Todos</h3>
          <p>
            <h3>Send to Server:</h3>
          </p>
          <select value={method} onChange={this.changeMethod}>
            <option value="GET">Get</option>
            <option value="POST">Post</option>
            <option value="PATCH">Patch</option>
            <option value="DELETE">Delete</option>
          </select>
          <input
            disabled={!shouldDisplayIdInput}
            type="text"
            placeholder="id (int)"
            value={id}
            onChange={e => this.setState({ id: e.target.value })}
          />
          <input
            disabled={!shouldDisplayTitleInput}
            type="text"
            placeholder="title (string)"
            value={title}
            onChange={e => this.setState({ title: e.target.value })}
          />
          <input
            disabled={!shouldDisplayOrderInput}
            type="text"
            placeholder="order (int)"
            value={order}
            onChange={e => this.setState({ order: e.target.value })}
          />

          <label>
            Completed?
            <input
              display="inline-block"
              disabled={!shouldDisplayCompletedInput}
              type="checkbox"
              value={completed}
              onChange={e => this.setState({ completed: e.target.checked })}
            />
          </label>

          <button type="submit">Submit</button>
        </form>
        <h3>{`Last sent: ${lastRequest}`}</h3>
        <p>
          {
            response.map((todo, i) => {
              return (
                <li key={i}>
                  { 
                    todo ? Object.entries(todo).map(([key, value]) => {
                      return `${key}: ${value}   `
                    }) : undefined
                  }
                </li>
              )
            })
          }
        </p>

        <Accordion style={{ width: 'max-content', margin: 'auto' }}>
          {
            this.state.todos.map((todo, i) => {
              return (
                <Accordion.Item eventKey={i} key={i}>
                  <Accordion.Header>
                    <div className='d-flex just-content-between'>
                      <div className='mx-3'>ID: {todo.id}</div>
                      <div className='mx-3'>{todo.title}</div>
                      <Badge bg={todo.completed ? 'success' : 'primary'} className='mx-3'>
                        {todo.completed ? 'DONE' : 'TO DO'}
                      </Badge>
                      <div className='mx-3'>{new Date(todo.updated_at).toLocaleString()}</div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className='lead'>Assigned users: {todo.assigned_users.length} </p>
                    <ListGroup>
                      {
                        todo.assigned_users.map((user, userI) => {
                          return (
                            <ListGroup.Item className='d-flex justify-content-between' key={userI}>
                              <div className='mx-2'>ID: <b>{user.id}</b></div>
                              <div className='mx-2'>{user.name}</div>
                              <div className='mx-2'><b>{user.email}</b></div>
                            </ListGroup.Item>
                          )
                        })
                      }
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item> 
              )
            })
          }
        </Accordion>
        <ManageAssignment getAllTodos={this.getAllTodos} />
      </div>
    );
  }
}

export default App;