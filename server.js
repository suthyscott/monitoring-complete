const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')

let rollbar = new Rollbar({
    accessToken: '9f8c850a503b4b3993660562d62e5f3f',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express()

app.use(express.json())

let students = []

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully.')
})

app.post('/api/student', (req, res)=>{
    let {name} = req.body
    name = name.trim()

    students.push(name)
    // rolly
    rollbar.log('Student added successfully', {author: 'Scott', type: 'manual entry'})

    res.status(200).send(students)
})

const port = process.env.PORT || 4545

// rolly
app.use(rollbar.errorHandler())

app.listen(port, () => console.log(`Take us to warp ${port}!`))