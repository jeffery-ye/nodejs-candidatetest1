var express = require('express');
var router = express.Router();

/* GET postgres controller */
let postgres = require('../controllers/postgres');

//Courses

router.get('/coursesearch', postgres.course_search);
router.post('/courselist', postgres.course_list);


router.get('/createcourse', postgres.create_course)
router.post('/createcourse', postgres.insert_course)

//Users

router.get('/createnewuser', postgres.create_user);
router.post('/createuseroutput', postgres.user_created);


router.get('/usersearch', postgres.search_user);
router.post('/usersearchresults', postgres.search_results);

module.exports = router;
