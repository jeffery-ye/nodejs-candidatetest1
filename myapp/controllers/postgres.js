
let models = require("../models");
let bcrypt = require("bcrypt");
const passport = require('passport');
const myPassport = require('../passport_setup')(passport);
let flash = require('connect-flash');
const {isEmpty} = require('lodash');
const { validateUser } = require('../validators/signup');

exports.create_user = function(req, res, next) {
	res.render('postgres/createuser', { formData: {}, errors: {},  user: req.user });
}

exports.search_user = function(req, res, next) {
	res.render('postgres/usersearch', { formData: {}, errors: {},  user: req.user });
}

const Pool =require('pg').Pool
const pgpool = new Pool({
  connectionLimit: 10,
  host: 'localhost',
  port: '5432',
  user: 'Siyuan',
  password: '123.456',
  database: 'express-mvp-db'
})

exports.user_created = function(req, res, next) {
	const firstName = req.body.first_name
	const lastName = req.body.last_name		
	const sql = "INSERT INTO userreg (first_name, last_name) values ($1,$2)"
	pgpool.query(sql, [firstName, lastName], (err, rows) => {
	if (err) {
		console.log(err)
	}
	//response.status(200).json(rows.rows)
	const new_user = { "firstName": firstName, "lastName": lastName}
	res.render('postgres/createuseroutput', { formData: {}, errors: {}, new_user:new_user,  user: req.user });
	})
}


exports.search_results = function (req, res, next) {   
    const firstName = req.body.first_name.toUpperCase()
    const lastName = req.body.last_name.toUpperCase()
    //const users = [{}]
    const sql = "SELECT * FROM userreg WHERE upper(first_name) = $1 or upper(last_name) = $2"
    pgpool.query(sql, [firstName, lastName], (err, rows) => {
        if (err) {
            //sendstatus(500)
            console.log("Failed to find user")
            return
        }
        //res.status(200).json(rows.rows)
        console.log(rows.rows)        
       
        res.render('postgres/usersearchresults', { users: rows.rows, user: req.user })
    })
}
