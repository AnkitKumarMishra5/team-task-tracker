const express = require('express')
const router = express.Router()
const knex = require("../database/connection.js");

router.post('/add', async (req, res) => {
  try {
    const { name, email } = req.body
    await knex('users').insert({ name, email })
    res.json({
      message: "User added successfully"
    })
  } catch(error) {
    console.log(error)
    res.status(400).json({
      message: "User with email already exists/ invalid details"
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const users = await knex('users').select('*')
    res.json(users)
  } catch(error) {
    console.log(error)
    res.status(500).json({
      message: 'Failed to fetch users'
    })
  }
})

module.exports = router