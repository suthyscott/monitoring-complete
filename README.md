Create a new directory. 

Create a server.js file within that directory, then make a public folder with html and css files.

run `npm init -y` in the root directory. Now we can install express `npm i express`. 

Build out a basic deployment server: 
```
const express = require('express')
const path = require('path')

const app = express()

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.listen(4545, () => console.log('Take us to warp 4545!'))
```

Build out basic html file: 
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student List</title>
</head>
<body>
    <h1>Student List</h1>
</body>
</html>
```

Now run `npm start`. When we initialized npm it should have added a start script that pointed to our server file. We should see our server running in the command line and if you go to the url of your app in the browser it should show whatever is in your the html file. 

We will be connecting this app to Heroku. Create a Procfile with `web:npm start` in it. 

Now we need to alter the server so the port can be determined by heroku when deployed:
```
const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}!`))
```

Now we'll connect our app to a GitHub repo. Make sure to add a .gitignore file with the node_modules in it before initializing a git repo. Add commit and push your code once the repos are connected. 

Now that our repo is connect to a remote repo on GitHub we can deploy it on Heroku. Go and make a new app or alter an existing one to connect with the GitHub repo, then deploy it. You should now be able to see the application deployed on the heroku url. 


## Rollbar Setup

Now let's implement Rollbar. Go to rollbar.com and create an account using your GitHub account. We will be using Node.js as our framework. Skip the next step titled "Let's add the Node.js SDK". You should now see your Rollbar dashboard. 

Now we need to install Rollbar in our app: `npm i rollbar`

Now we can require in the class of Rollbar to use in our server. 
```
const Rollbar = require('rollbar')

let rollbar = new Rollbar({
    accessToken: ''
})
```
We'll need an access token from our Rollbar dashboard>Projects>FirstProject>Project Access Tokens > click Create new access token. Call it whatever you want, and select post_server_item. Now we can copy that value to use in our server file: 
```
const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')

let rollbar = new Rollbar({
    accessToken: '9f8c850a503b4b3993660562d62e5f3f',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express()

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}!`))
```

We also set the captureUncaught and captureUnhandledRejections to true. These, along with other properties determine what types of logs/errors that we can track using Rollbar. 

Now we're going to use Rollbar not to capture an error but to log a success message. Alter your app.get to look like the following:
```
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully.')
})
```

Now add commit and push those changes, then re-deploy through Heroku. You can also enable Automatic deploys to rebuild it for it whenever changes are made. The page needs to be deployed with the latest changes and open in order for the next step to work. 

Now we want to view the log in Rollbar. Go to the Items tab, where you should be able to select the first project (it may be selected for you automatically). In order to see the log you'll need to check all levels. We should see the log in our server file listed there. 

Rollbar keeps track of the total times a log has been received. You'll see the total increase every time you refresh the page. If you open a log you'll see a bunch of other useful info about the log. 


## Rollbar logs

Now we'll need to add some functionality so we can mock tracking errors and events in our site. If you have time you can build this out piece by piece, or simply send this html file to the students: 
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student List</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js"></script>
</head>
<body>
    <h1>Student List</h1>
    <form>
        <input type="text" placeholder="Type name here"/>
        <button>Add Student</button>
    </form>
    <script>
        const addForm = document.querySelector('form')
        const nameInput = document.querySelector('input')

        function submitHandler(e){
            e.preventDefault()
            axios.post('/api/student', {name: nameInput.value, })
                .then(res => console.log(res))
                .catch(err => console.log(err))
        }

        addForm.addEventListener('submit', submitHandler)
    </script>
</body>
</html>
```

We simply made a basic form that will send a post request with a student's name to be added to the backend. Now we need to add an endpoint for it in the server. First add an array for the student names above our endpoints. 
`let students = []`

Now add an endpoint: 
```
app.post('/api/student', (req, res)=>{
    let {name} = req.body
    name = name.trim()

    students.push(name)

    res.status(200).send(students)
})
```

Now let's add some rollbar functionality to log info and track errors. In your post function add a rollbar log:
```
app.post('/api/student', (req, res)=>{
    let {name} = req.body
    name = name.trim()

    students.push(name)

    rollbar.log('Student added successfully', {author: 'Scott', type: 'manual entry'})

    res.status(200).send(students)
})
```

The log will show our message and we can specify any other information that we want to show up in our Rollbar logs in the object. 

Let's also add some top-level middleware that will track any errors that occur in our server:
`app.use(rollbar.errorHandler())`

Now let's add commit and push, re-deploy and try and add a student. Any errors or messages should now show up in Rollbar. 

You should get an error saying that name can't be destructured from req.body. The traceback gives us detailed info about where and why the error occured. 