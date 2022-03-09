const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/wait', (req, res) => {
    res.sendFile('wait.html', { root: __dirname});
})
let waitCount = 10;
app.get('/avail', (req, res) => {
    console.log('avail');
    if(waitCount > 0) waitCount--;
    if(waitCount === 0) {
        res.status(200).send( { avail: true } )
    }
    else {
        console.log('waitCount=', waitCount);
        res.status(200).send( { avail: false, waitCount: waitCount } )
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})