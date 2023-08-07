const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller.js');

// router.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '* ');
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     // Pass to next layer of middleware
//     next();
//     });



router.get('/', homeController.home);
router.use('/user', require('./user'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));

router.use('/api', require('./api'));

module.exports = router;