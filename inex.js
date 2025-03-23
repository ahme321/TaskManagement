const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const pool = new Pool({

    user: 'Postgres',
    
    host: '', 
    
    database: 'TaskManagement', 
    
    password: '',
    
    port: 5432,});
app.use(bodyParser.json());


let tasks = {};
let taskIdCounter = 1;


function validateTask(task) {
  if (!task || !task.title || typeof task.title !== 'string') {
    return 'Task title is required and must be a string.';
  }
  if (task.description && typeof task.description !== 'string') {
    return 'Task description must be a string.';
  }
  if (task.status && !['pending', 'in progress', 'completed'].includes(task.status)) {
    return 'Task status must be one of: pending, in progress, completed.';
  }
  return null;
}


app.post('/tasks', (req, res) => {
  const task = req.body;
  const validationError = validateTask(task);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const taskId = taskIdCounter++;
  tasks[taskId] = {
    id: taskId,
    title: task.title,
    description: task.description || '',
    status: task.status || 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  res.status(201).json(tasks[taskId]);
});


app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  if (tasks[taskId]) {
    res.json(tasks[taskId]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});


app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = req.body;
  const validationError = validateTask(task);

  if (!tasks[taskId]) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  tasks[taskId] = {
    ...tasks[taskId],
    title: task.title,
    description: task.description || tasks[taskId].description,
    status: task.status || tasks[taskId].status,
    updatedAt: new Date(),
  };

  res.json(tasks[taskId]);
});


app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  if (tasks[taskId]) {
    delete tasks[taskId];
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.listen(port, () => {
  console.log('Server listening at http//localhost:${port}');
    });