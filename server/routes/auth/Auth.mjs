/**
 * @overview: This class is the route for the auth section of the api and takes care of all the business logic.
 */

'use strict'

// Dependencies
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Route from '../Route'
import Database from '../../config/database/Database'
import User from '../../models/User'

const router = express.Router()

export default class Auth extends Route {
    constructor(path, app) {
        // Super takes:
        // - path which is received from when instantiating the class
        // - app which is received from when instantiating the class
        // - router which is received from the dependencies from above
        super(path, app, router)
        // Run all the methods to each path of the route
        this.run()
    }

    /**
     * @param boolean - true = authenticated route, false = open route
     * @note - This is also a summary of each route availale
     */
    run() {
        this.root(true)
        this.register(false)
        this.login(false)
        this.retreiveUserData(true)
        this.updateUserData(true)
        this.updateUserPassword(true)
    }

    /**
     * All methods take:
     * @param passport - which is a boolean value to include passport auth or not
     */

    // Root for auth route, Use this format for all routes
    root(passport) {
        this.createRoute('get', '/', (req, res) => {
            res.send('Hello from <b>ROOT</b> path of auth')
        }, passport)
    }

    // Register a user to the database
    register(passport) {
        this.createRoute('post', '/register', async (req, res) => {
            try {
                // Generate salt and hashed password
                const saltRounds = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(req.body.password, saltRounds)
                const user = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    email: req.body.email,
                    password: hash
                }

                const newUser = await User(user).save()
                res.json({
                    success: true,
                    newUser
                })
            } catch (e) {
                res.sendStatus(500)
                console.log(e)
            }
        }, passport)
    }

    // Authenticate a user
    login(passport) {
        this.createRoute('post', '/login', async (req, res) => {
            try {
                const username = req.body.username
                const password = req.body.password

                // Find the user by username from the database
                const user = await User.findOne({ username })

                if (!user) {
                    // Send wrong username error
                    res.json({ error: 'The username you have entered does not exist' })
                    return
                }

                // Compare found user password with inputed password from client
                const isMatch = await bcrypt.compare(password, user.password)

                if (isMatch) {
                    const db = new Database()
                    // Create a token that expires in 1 week
                    const token = await jwt.sign({ data: user }, db.getConnectionString().secret, {
                        expiresIn: 604800 // 1 week
                    })

                    // Send the token when user data to the client
                    res.json({
                        success: true,
                        token: 'Bearer ' + token,
                        user: {
                            id: user._id,
                            name: user.name,
                            username: user.username,
                            email: user.email
                        }
                    })
                } else {
                    // Send wrong password error
                    res.json({ error: 'The password you have entered does not match' })
                    return
                }
            } catch (e) {
                res.sendStatus(500)
                console.log(e)
            }
        }, passport)
    }

    // Retreive the users data
    retreiveUserData(passport) {
        this.createRoute('get', '/retreiveUserData', async (req, res) => {
            const userID = req.user._id
            const user = await User.findById(userID)

            const sendUser = {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email
            }

            res.json(sendUser)
        }, passport)
    }

    // Update the user data
    updateUserData(passport) {
        this.createRoute('post', '/updateUserData', async (req, res) => {
            try {
                const userID = req.user._id
                const body = req.body.user

                // construct user update object
                const update = {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    username: body.username,
                    email: body.email
                }
                // query to the database with userID
                await User.findOneAndUpdate(userID, update).exec()

                res.json({ success: true })
            } catch (e) {
                // send error results
                res.sendStatus(500)
            }
        }, passport)
    }

    // Update the user password
    updateUserPassword(passport) {
        this.createRoute('post', '/updateUserPassword', async (req, res) => {
            try {
                const userID = req.user._id
                const body = req.body.password

                // find the user by userID from the database
                const user = await User.findOne({ _id: userID })

                // compare found user password with inputed current password from client
                const isMatch = await bcrypt.compare(body.currentPassword, user.password)

                if (isMatch) {
                    // generate salt and hashed password
                    const saltRounds = await bcrypt.genSalt(10)
                    const hash = await bcrypt.hash(body.newPassword, saltRounds)

                    // construct user password update object
                    const update = {
                        password: hash
                    }
                    // query to the database to update the user password
                    await User.findOneAndUpdate(userID, update).exec()

                    res.json({ success: true, message: 'The users password has been updated' })
                } else {
                    res.json({ success: false, message: 'The current password you entered does not match' })
                }
            } catch (e) {
                res.sendStatus(500)
            }
        }, passport)
    }
}