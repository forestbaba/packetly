const express = require('express');
const app = express();
const PORT = process.env.PORT || 19000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Users = require('./api/user/users');
const Jobs = require('./api/job/job');
const logger = require('morgan');
// const cors = require('cors');

const db = require('./api/helpers/config').mongoURI;
mongoose.connect(db).then(() => console.log('MongoDb Connected')).catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
app.use(bodyParser.json());
app.use(logger('dev'));
// app.use(cors())

app.use('/api/v1/users', Users);
app.use('/api/v1/job', Jobs);
app.get('/', (req, res) => {
	return res.status(200).send('packetly');
});

app.listen(PORT, () => {
	console.log(`App listening on ${PORT}`);
});
