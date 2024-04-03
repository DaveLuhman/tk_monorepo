import { Schema, model } from 'mongoose'
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
                0,  // free tier
                1, // basic tier
                2 // premium tier
            ],
            default: 0
        },
        rootDomain: {// this does not need 'time' prepended. Only the root domain is required here.
            type: String,
            lowercase: true,
            unique: true
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

customerSchema.static('register', async function (companyName, email) {
    const existingCompany = Customer.exists({ businessName: { $eq: companyName } })
    if (existingCompany !== null) return existingCompany;
    else {
        return await model('Customer').create({
            companyName,
            rootDomain: email.substring(email.indexOf('@') + 1),
            preferredEmailRecipient: 'time' + email.substring(email.indexOf('@'))
        })
    }
})
const Customer = model('Customer', customerSchema, 'customers')
export default Customer