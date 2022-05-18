const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const Task = require('./model/task')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

mongoose.connect('mongodb://localhost:27017/login-app-db', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)


		return res.json({ status: 'ok', data: {"token": token, "user": user._id} })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/register', async (req, res) => {
	const { username, password: plainTextPassword } = req.body

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			username,
			password
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})

// Get all active users
app.get('/api/members',async(req,res)=>{
    User.find({}, function(err, users) {
        var userMap = {};
        users.forEach(function(user) {
          userMap[user._id] = user;
        });
        res.send(userMap);
      });
})

// Get all tasks
app.get('/api/tasks',async(req,res)=>{
    Task.find({}, function(err, users) {
        var taskMap = {};
        users.forEach(function(task) {
          taskMap[task._id] = task;
        });
        res.send(taskMap);
      });
})

// create task
app.post('/api/create_task',async(req,res)=>{
    const { name, level_of_priority, isCompleted, created_by  } = req.body
    if (!name || typeof name !== 'string') {
		return res.json({ status: 'error', error: 'Invalid name' })
	}
    if (!level_of_priority || typeof level_of_priority !== 'number') {
		return res.json({ status: 'error', error: 'Invalid priority' })
	}
    if (mongoose.Types.ObjectId.isValid(created_by) === false){
        return res.json({ status: 'error', error: 'Invalid User' })
    }
    try {
		const response = await Task.create({
			name,
			level_of_priority,
            isCompleted,
            created_by
		})
		console.log('Task created successfully: ', response)
        res.json({ status: 'ok' })
	}
    catch (error) {
		if (error.code === 11000) {
			return res.json({ status: 'error', error: 'Task already in use' })
		}
		throw error
	}
})

// Update Task
app.post('/api/status_update',async(req,res)=>{
    const { id, isCompleted} = req.body

    try {
		Task.findById(id, function(err, p) {
            if (!p)
              return next(new Error('Could not load Task'));
            else {

              if(p.isCompleted){
				  p.isCompleted = false
			  }
			  else{
				  p.isCompleted = true
			  }

              p.save(function(err) {
                if (err){
                    console.log('error')
                    return res.json({ status: 'error', error: ';))' })
                }
                else{
                    console.log("success")
                    res.json({ status: 'ok' })
                }
              });
            }
          })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})


app.listen(9999, () => {
	console.log('Server up at 9999')
})