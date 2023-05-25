const express = require('express');
const router = express.Router();

const todoRoutes = require('./modules/todo');

router.use('/todos', todoRoutes);

router.get('/', (req, res) => {
  res.redirect('/todos');
});

module.exports = router;