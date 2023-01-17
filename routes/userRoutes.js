import express from 'express'
const routes = express.Router()
import UserController from '../controllers/userController.js'
import checkUserAuth from '../middlewares/auth-middleware.js'

//* ROute Level Middleware - To Protect Route
routes.use('/changepassword',checkUserAuth)    //* <--  User Login Rahane se hi Route access hoga  ( Front end se User ka token bhejega verify karne ka bad yah Route ko access de dega)
routes.use('/loggeduser',checkUserAuth)


//* Public Route
routes.post('/register',UserController.userRegistration)
routes.post('/login',UserController.userLogin)
routes.post('/send-reset-password-email',UserController.sendUserPasswordResetEmail);
routes.post('/reset-password/:id/:token',UserController.userPasswordReset)



//* Protected Routes
routes.post('/changepassword',UserController.changeUserPassword)
routes.get('/loggeduser',UserController.loggedUser)


export default routes