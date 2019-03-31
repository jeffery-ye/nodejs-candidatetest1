var express = require('express');
var router = express.Router();

/* GET postgres controller */
let postgres = require('../controllers/postgres');


/* set routing */

/*  
in app.js
var postgresRouter = require('./routes/postgres');
app.use('/postgres', postgresRouter);

therefore -- 
  /postgres/createnewuser
  /postgres/userseach
  -- /postgres was added automatically
*/
router.get('/createnewuser', postgres.create_user);

router.get('/usersearch', postgres.search_user);



router.post('/createuseroutput', postgres.user_created);
  

router.post('/usersearchresults', postgres.search_results);


module.exports = router;
