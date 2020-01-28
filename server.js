const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
var knex = require('knex')

const bd = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'postgres',
    database : 'face-reco'
  }
});

bd.select('*').from('users').then(data => {
	console.log(data)
});

const app = express();
app.use(bodyParser.json());
app.use(cors());



app.get('/', (req, res) => {
	res.json(database);
});


app.post('/signin', (req, res) => {
	const {email, password} = req.body;
	bd('users').where({email : email})
	.then(data => {
		if(!data[0]){
			res.status(400).json('signin error');
		}else{
			if(bcrypt.compareSync(password, data[0].password)){
				isFound = true;
				res.json(data[0]);
			}else{
				res.status(400).json('signin error');
			}
		}
	})
});

app.post('/register', (req,res) => {
	console.log('server register post .',req.body);
	const {name,email,password} = req.body;
	const newpass = bcrypt.hashSync(password);
	bd('users').where({email : email})
	.then(data => {
		if(data[0]){
			console.log(data)
			res.status(400).json('register error');
		}else{	
			bd('users')
			.returning('*')
			.insert({
				name:name,
				email:email,
				password:newpass,
				joined: new Date()
			}).then(data => res.json(data[0]));
		}
	})		 
})

// app.get('/profile/:id', (req,res) => {
// 	const {user} = req.params;
// 	let isFound = false;
// 	database.user.forEach(user => {
// 		if(user.id==id){
// 			isFound = true;
// 			return res.json(user);
// 		}
// 	})
// 	if(!isFound) res.status(400).json('user not found');
// })

app.put('/image', (req,res) => {
	const {user} = req.body;
	bd('users').returning('*').where({id:user.id}).increment('entries',1)
	.then(data => {
		console.log(data);
		res.json(data[0]);
	})
})

app.listen(process.env.PORT, ()=> {
	console.log('app is working on port ${ process.env.PORT } ');
});