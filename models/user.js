/**
 * @fileoverview This file contains the User model schema and methods for user registration and retrieval.
 * @module User
 */

import { Schema, model } from 'mongoose'
import { hash } from 'bcrypt'
import mongooseAutoPopulate from 'mongoose-autopopulate'

/**
 * Represents the User model schema.
 * @class
 */
const UserSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      autopopulate: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: 'User',
      enum: ['User', 'Manager', 'Admin'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    last: {
      type: Date,
    },
    token: String,
    tokenExpiry: Number,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  }
)

UserSchema.plugin(mongooseAutoPopulate)

/**
 * Registers a new user in the database.
 * @static
 * @async
 * @function register
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<User>} A promise that resolves to the newly created user.
 */
UserSchema.static('register', async function (email, password) {
  return await model('User').create({
    email,
    password: await hash(password, 10),
  })
})

/**
 * Finds a user by email.
 * @static
 * @async
 * @function findByEmail
 * @param {string} email - The email of the user to find.
 * @returns {Promise<User|null>} A promise that resolves to the found user, or null if not found.
 */
UserSchema.static('findByEmail', async function (email) {
  return (await model('User').findOne({ email: { $eq: email } })) || null
})

/**
 * Finds a user by token.
 * @static
 * @async
 * @function findByToken
 * @param {string} token - The token of the user to find.
 * @returns {Promise<User|null>} A promise that resolves to the found user, or null if not found.
 */
UserSchema.static('findByToken', async function (token) {
  return (await model('User').findOne({ token: { $eq: token } })) || null
})

/**
 * Represents the User model.
 * @class
 */
const User = model('User', UserSchema, 'users')

export default User
