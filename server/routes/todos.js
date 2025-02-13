const express = require('express')
const router = express.Router()
const knex = require("../database/connection.js");

router.post('/:id/assign', async (req, res) => {
  try {
    const { user_id } = req.body
    const { id: todo_id } = req.params
    await knex('todos_assignment').insert({ user_id, todo_id })
    res.json({
      message: "Todo assigned successfully"
    })
  } catch(error) {
    console.log(error)
    res.status(500).json({
      message: "Error occured during assignment"
    })
  }
})

router.post('/:id/unassign', async (req, res) => {
  const { user_id } = req.body;
  const { id: todo_id } = req.params

  try {
      const deleted = await knex('todos_assignment')
          .where({ todo_id, user_id })
          .del();

      if (deleted) {
          res.json({ message: 'User unassigned from todo successfully' });
      } else {
          res.status(404).json({ error: 'User was not assigned to this todo' });
      }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error occured during unassigning todo"
    })
  }
});

router.get('/all/assigned-users', async (req, res) => {
  try {
      const todosWithUsers = await knex('todos')
          .leftJoin('todos_assignment', 'todos.id', 'todos_assignment.todo_id')
          .leftJoin('users', 'users.id', 'todos_assignment.user_id')
          .select(
              'todos.*',
              'users.id as user_id',
              'users.name as user_name',
              'users.email as user_email'
          );

      const allTodos = {};
      
      todosWithUsers.forEach(todo => {
        if (!allTodos[todo.id]) {
          allTodos[todo.id] = {
              id: todo.id,
              title: todo.title,
              order: todo.order,
              completed: todo.completed,
              updated_at: todo.updated_at,
              assigned_users: []
          };
        }

        if(todo.user_id) {
          allTodos[todo.id].assigned_users.push({
            id: todo.user_id,
            name: todo.user_name,
            email: todo.user_email
          })
        }
      })

      res.json(Object.values(allTodos));
  } catch (error) {
      console.log(error);
      res.status(500).json({ 
        error: 'Failed to fetch todos with assigned users' 
      });
  }
});

module.exports = router