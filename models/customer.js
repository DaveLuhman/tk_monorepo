import { Schema, model } from 'mongoose'

/**
 * Represents a customer in the system.
 * @typedef {Object} Customer
 * @property {boolean} active - Indicates if the customer is active.
 * @property {string} businessName - The name of the customer's business.
 * @property {number} paymentTier - The payment tier of the customer. Can be 0 (free tier), 1 (basic tier), or 2 (premium tier).
 * @property {string} rootDomain - The root domain of the customer.
 * @property {string} preferredEmailRecipient - The preferred email recipient for the customer.
 * @property {Date} createdAt - The date and time when the customer was created.
 * @property {Date} updatedAt - The date and time when the customer was last updated.
 */

/**
 * Represents the customer schema.
 * @type {Schema<Customer>}
 */
const customerSchema = new Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
    businessName: {
      type: String,
    },
    paymentTier: {
      type: Number,
      enum: [
        0, // free tier
        1, // basic tier
        2, // premium tier
      ],
      default: 0,
    },
    rootDomain: {
      // this does not need 'time' prepended. Only the root domain is required here.
      type: String,
      lowercase: true,
      unique: true,
    },
    preferredEmailRecipient: {
      type: String,
    },
  },
  {
    timestamps: true, // adds timestamps
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: false, // [deny]/allow insertion of key/value pairs that aren't part of this schema
  }
)

/**
 * Registers a new customer in the system.
 * @param {string} companyName - The name of the company.
 * @param {string} email - The email address of the customer.
 * @returns {Promise<Customer>} - A promise that resolves to the newly created customer.
 */
customerSchema.static('register', async function (companyName, email) {
  const existingCompany = Customer.exists({
    businessName: { $eq: companyName },
  })
  if (existingCompany !== null) return existingCompany
  else {
    return await model('Customer').create({
      companyName,
      rootDomain: email.substring(email.indexOf('@') + 1),
      preferredEmailRecipient: 'time' + email.substring(email.indexOf('@')),
    })
  }
})

const Customer = model('Customer', customerSchema, 'customers')
export default Customer
