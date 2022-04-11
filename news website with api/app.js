const express = require('express'), app = express(), PORT = process.env.PORT || 5000, bodyParser = require('body-parser'), moment = require('moment'), path = require('path')

app.locals.moment = moment

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use('/', require('./routes/news'))

app.set('view engine', 'ejs')
app.set('views', './views')

app.listen(PORT, () => console.log("http://192.168.42.212:5000"))