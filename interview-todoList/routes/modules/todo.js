const express = require('express');
const router = express.Router();

let todos = [
  {
    id: 1,
    title: 'Todo 1',
    creator: 'User 1',
    startDate: '2022-01-01',
    endDate: '2022-01-05',
    comments: [
      { comment: 'Comment 1', commenter: 'User A' },
      { comment: 'Comment 2', commenter: 'User B' }
    ]
  },
  {
    id: 2,
    title: 'Todo 2',
    creator: 'User 2',
    startDate: '2022-02-01',
    endDate: '2022-02-05',
    comments: [
      { comment: 'Comment 3', commenter: 'User C' },
      { comment: 'Comment 4', commenter: 'User D' }
    ]
  }
];

router.get('/', (req, res) => {
  const { sort } = req.query;
  let sortedTodos = [...todos];

  if (sort) {
    const sortOptions = {
      createdAt: (a, b) => a.createdAt - b.createdAt,
      dueDate: (a, b) => a.dueDate - b.dueDate,
      creator: (a, b) => a.creator.localeCompare(b.creator),
      id: (a, b) => a.id - b.id,
    };

    const sortFunction = sortOptions[sort];

    if (sortFunction) {
      sortedTodos.sort(sortFunction);
    }
  }

  res.render('todos', { todos: sortedTodos });
});

router.post('/', (req, res) => {
  const { title, creator, startDate, endDate } = req.body;
  const id = Date.now();
  const newTodo = { id, title, creator, startDate, endDate, comments: [] };
  todos.push(newTodo);
  res.redirect('/todos');
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, creator, startDate, endDate } = req.body;

  const todo = todos.find((todo) => todo.id === parseInt(id));
  if (!todo) {
    return res.status(404).json({ error: '找不到該待辦事項' });
  }

  if (!title || !creator || !startDate || !endDate) {
    return res.status(400).json({ error: '缺少必要的信息' });
  }

  todo.title = title;
  todo.creator = creator;
  todo.startDate = startDate;
  todo.endDate = endDate;

  res.redirect(`/todos/${id}`);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const index = todos.findIndex((todo) => todo.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: '找不到該待辦事項' });
  }

  const deletedTodo = todos.splice(index, 1)[0];
  res.json(deletedTodo);
});

router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const { comment, commenter } = req.body;

  const todo = todos.find((todo) => todo.id === parseInt(id));
  if (!todo) {
    return res.status(404).json({ error: '找不到該待辦事項' });
  }

  if (!comment || !commenter) {
    return res.status(400).json({ error: '缺少评论或评论者信息' });
  }

  const newComment = { comment, commenter };
  todo.comments.push(newComment);

  res.redirect(`/todos/${id}/comments`);
});

router.get('/:id/comments', (req, res) => {
  const { id } = req.params;

  const todo = todos.find((todo) => todo.id === parseInt(id));
  if (!todo) {
    return res.status(404).json({ error: '找不到該待辦事項' });
  }

  res.render('comments', { comments: todo.comments });
});

router.post('/:id/history', (req, res) => {
  const { id } = req.params;
  const { history } = req.body;

  const index = todos.findIndex((todo) => todo.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: '找不到該待辦事項' });
  }

  const todo = todos[index];
  todo.history = history;

  res.redirect(`/todos/${id}`);
});

router.get('/filter', (req, res) => {
  const { startDate, endDate, creator } = req.query;

  let filteredTodos = todos;

  if (startDate && endDate) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    filteredTodos = filterByTime(filteredTodos, startDateObj, endDateObj);
  }

  if (creator) {
    filteredTodos = filterByCreator(filteredTodos, creator);
  }

  res.render('todos', { todos: filteredTodos });
});

function filterByTime(todos, startDate, endDate) {
  const filteredTodos = todos.filter((todo) => {
    
    return true;
  });
  return filteredTodos;
}

function filterByCreator(todos, creator) {
  const filteredTodos = todos.filter((todo) => todo.creator === creator);
  return filteredTodos;
}

module.exports = router;
