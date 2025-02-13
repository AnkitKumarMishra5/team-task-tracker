import React, { useState, useEffect } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import axios from 'axios'
const API_URL = 'http://localhost:5000'

function ManageAssignment({ getAllTodos }) {
  const [newUser, setNewUser] = useState({
    name: '',
    email: ''
  })
  const [users, setUsers] = useState([])
  const [assignmentData, setAssignmentData] = useState({
    user_id: '',
    todo_id: ''
  })

  useEffect(() => {
    getAllUsers()
  }, [])
  
  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`)
      setUsers(response.data)
      console.log(users)
    } catch (error) {
      alert(error.message)
    }
  }

  const createNewUser = async () => {
    if(!newUser.name || !newUser.email) return;
    try {
      await axios.post(`${API_URL}/users/add`, newUser)
      alert('User created successfully!')
      getAllUsers()
    } catch (error) {
      alert(error.message)
    }
  }

  const assignTodo = async () => {
    if(!assignmentData.user_id || !assignmentData.todo_id) return;
    try {
      await axios.post(`${API_URL}/todos/${assignmentData.todo_id}/assign`, {
        user_id: assignmentData.user_id
      })
      alert('Todo assigned successfully!')
      getAllTodos()
    } catch (error) {
      alert(error.message)
    }
  }

  const unassignTodo = async () => {
    if(!assignmentData.user_id || !assignmentData.todo_id) return;
    try {
      await axios.post(`${API_URL}/todos/${assignmentData.todo_id}/unassign`, {
        user_id: assignmentData.user_id
      })
      alert('Todo unassigned successfully!')
      getAllTodos()
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div style={{ width: 'max-content', margin: 'auto' }}>
      <h3 className='display-6'>Manage Users</h3>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Name" 
            value={newUser.name} 
            onInput={(e) => setNewUser({
              ...newUser,
              name: e.target.value
            })}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Email" 
            value={newUser.email} 
            onInput={(e) => setNewUser({
              ...newUser,
              email: e.target.value
            })}
          />
        </Form.Group>
        <Button variant="dark" type="button" onClick={createNewUser}>
          Create new user
        </Button>
      </Form>
      <Table striped bordered hover className='mt-2'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <hr />  

      <h3 className='display-6'>Manage Todos Assignment</h3>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>User ID</Form.Label>
          <Form.Control 
            type="number" 
            placeholder="User ID" 
            value={assignmentData.user_id} 
            onInput={(e) => setAssignmentData({
              ...assignmentData,
              user_id: e.target.value
            })}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Todo ID</Form.Label>
          <Form.Control 
            type="number" 
            placeholder="Todo ID" 
            value={assignmentData.todo_id} 
            onInput={(e) => setAssignmentData({
              ...assignmentData,
              todo_id: e.target.value
            })}
          />
        </Form.Group>
        <Button variant="dark" type="button" onClick={assignTodo} className='mx-3'>
          Assign todo
        </Button>
        <Button variant="danger" type="button" onClick={unassignTodo} className='mx-3'>
          Unassign todo
        </Button>
      </Form>
    </div>
  )
}

export default ManageAssignment