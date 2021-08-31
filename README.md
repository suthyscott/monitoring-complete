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

Now we'll connect our app to a GitHub repo. Make sure to add a .gitignore file with the node_modules in it before initializing a git repo. 