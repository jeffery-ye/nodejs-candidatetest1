
let models = require("../models");
let bcrypt = require("bcrypt");
const passport = require('passport');
const myPassport = require('../passport_setup')(passport);
let flash = require('connect-flash');
const { isEmpty } = require('lodash');
const { validateUser } = require('../validators/signup');

exports.create_user = function (req, res, next) {
    res.render('postgres/createuser', { formData: {}, errors: {}, user: req.user });
}

exports.search_user = function (req, res, next) {
    res.render('postgres/usersearch', { formData: {}, errors: {}, user: req.user });
}

const Pool = require('pg').Pool
const pgpool = new Pool({
    connectionLimit: 10,
    host: 'localhost',
    port: '5432',
    user: 'Siyuan',
    password: '123.456',
    database: 'express-mvp-db'
})

exports.user_created = function (req, res, next) {
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const sql = "INSERT INTO userreg (first_name, last_name) values ($1,$2)"
    pgpool.query(sql, [firstName, lastName], (err, rows) => {
        if (err) {
            console.log(err)
        }
        //response.status(200).json(rows.rows)
        const new_user = { "firstName": firstName, "lastName": lastName }
        res.render('postgres/createuseroutput', { formData: {}, errors: {}, new_user: new_user, user: req.user });
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

exports.create_course = function (req, res, next) {
    const username = req.user.email
    const sql = "SELECT * FROM courseschedule WHERE username = $1"
    pgpool.query(sql, [username], (err, rows) => {
        if (err) {
            //sendstatus(500)
            console.log("Failed to find user")
            return
        }
        //res.status(200).json(rows.rows)
        console.log(rows.rows)
        res.render('postgres/createcourse', { courses: rows.rows, user: req.user });
    })
}

exports.insert_course = function (req, res, next) {
    const daytype = req.body.daytype
    const period = req.body.period
    const coursename = req.body.coursename
    const username = req.user.email
    
    const sql1 = "SELECT * FROM courseschedule WHERE username = $1 and daytype = $2 and period = $3"
    pgpool.query(sql1, [username, daytype, period], (err, rows) => {
        if (err) {            
            console.log("Failed to find user")
            return
        }
        console.log("user name --- " , rows.rows)
        if (rows.rows) {
            console.log("user name ---------- " , rows.rows)
            //console.log("rows.rows", rows.rows.period)
           pgpool.query('update courseschedule set coursename = $1 where daytype  = $2 and period = $3', [coursename, daytype, period], (err, rows) => {
                if (err) {
                   console.log("Update Failed")
                   return
               }
            res.render('postgres/createcourse', { courses: rows.rows, user: req.user });
            })            
        }        
       else {           
        const sql2 = "INSERT INTO courseschedule (daytype, period, coursename, username) values ($1,$2, $3, $4)"
        pgpool.query(sql2, [daytype, period, coursename, username], (err, rows) => {
            if (err) {
                console.log(err)
                return
            }    
            const sql = "SELECT * FROM courseschedule WHERE username = $1"
            pgpool.query(sql, [username], (err, rows) => {
                if (err) {                        
                    console.log("Failed to find user")
                    return
                }
                //res.status(200).json(rows.rows)
                //console.log(rows.rows)
                res.render('postgres/createcourse', { courses: rows.rows, user: req.user });
            })              
        })
        }   
    })

}




exports.course_search = function (req, res, next) {
    res.render('postgres/coursesearch', { formData: {}, errors: {}, user: req.user });
}

exports.course_list = function (req, res, next) {
    const daytype = req.body.daytype.toUpperCase()
    const period = req.body.period
    const coursename = req.body.coursename.toUpperCase()
    const username = req.user.email
    console.log(req.user.email)
    const sql = "SELECT * FROM courseschedule WHERE (upper(daytype) = $1 or period = $2 or upper(coursename) = $3) and username = $4"
    pgpool.query(sql, [daytype, period, coursename, username], (err, rows) => {
        if (err) {
            //sendstatus(500)
            console.log("Failed to find courses")
            return
        }
        //res.status(200).json(rows.rows)
        console.log(rows.rows)

        res.render('postgres/courselist', { courses: rows.rows, user: req.user })
    })
}
