const express = require('express');
const app = express();
const port = 3000;

// In-memory task storage
let tasks = [
    { id: 1, title: 'Task One', description: 'Task one ', completed: false },
    { id: 2, title: 'Task Two', description: 'Task Two ', completed: true },
    { id: 3, title: 'Task Three', description: 'Task Three ', completed: false },
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to get all tasks
app.get('/tasks', (req, res) => {
    let obj = {
            status: 'success',
            data: tasks
        }
    res.json(obj);
});

// Route to get a specific task by ID
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        let obj = {
            status: 'success',
            data: task
        }
        res.json(obj);
    } else {
        res.status(404).json({status:'failed', message: 'Task not found' });
    }
});

// Route to create a new task
app.post('/tasks', (req, res) => {
    let { title, description, completed } = req.body;

    if(!title || !description) {
        return res.status(400).json({status: 'failed', message: 'Title and description are required' });
    }

    const newTask = {
        id: tasks.length + 1,
        title: title,
        description: description,
        completed: completed ?? false,
    };
    tasks.push(newTask);
    res.status(201).json({status: 'success', data: newTask});
});

// Route to update an existing task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.title = req.body.title !== undefined ? req.body.title : task.title;
        task.description = req.body.description !== undefined ? req.body.description : task.description;
        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
        res.status(201).json({status: 'success', data: task});
    } else {
        res.status(404).json({status: 'failed', message: 'Task not found' });
    }
});

// Route to delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        res.status(204).json({status: 'success', message: 'Task deleted' });
    } else {
        res.status(404).json({status:'failed', message: 'Task not found' });
    }
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;