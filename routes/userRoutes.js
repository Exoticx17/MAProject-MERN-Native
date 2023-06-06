const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

router.get('/', userController.users_get);
router.get('/one/:id', userController.userGetOne);
router.post('/signup', userController.signup_post);
router.post('/login', userController.login_post);
router.post('/logout', userController.logout_post);
router.get('/status', userController.auth_status);
router.patch('/admin/:id',userController.admin_user);
router.patch('/vote/:id',userController.vote_user);
router.delete('/delete/:id', userController.users_delete);

module.exports = router;