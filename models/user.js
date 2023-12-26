import { Schema, model } from 'mongoose'
import { hash } from 'bcrypt'
import mongooseAutoPopulate from 'mongoose-autopopulate'

  // This code creates a new schema that is used to define the User model
// The schema contains the fields for a user, as well as the timestamps
// that are automatically added when the user is created and updated
const UserSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      autopopulate: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true
    },
    password: {
      type: String
    },
    role: {
      type: String,
      default: 'User',
      enum: ['User', 'Manager', 'Admin']
    },
    active: {
      type: Boolean,
      default: true
    },
    last: {
      type: Date
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
  }
)
UserSchema.plugin(mongooseAutoPopulate)

// This code creates a static method on the UserSchema called register
// that is used to register a new user in the database
// The method takes an email and a password as its arguments
// and creates a new user with the hashed password
// The method is used in the register controller
UserSchema.static('register',  async function(email, password) {
  return await model('User').create({email, password: await hash(password, 10)})
})

const User = model('User', UserSchema, 'users')
export default User