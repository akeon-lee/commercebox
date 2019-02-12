'use strict'

// Dependencies
import mongoose from 'mongoose'

// Product schema
const Schema = mongoose.Schema
const productSchema = new Schema({
    image: String,
    sku: { type: String, required: true },
    title: { type: String, required: true },
    quantity: {
        quantity: Number, // Total quantity available on hand.
        available: Number, // Totalquantity available after subtracting items in pending orders.
        alert: Number, // The minimum quantity needed to be alerted for reorder.
        pendingOrders: Number,
        needed: Number // The needed quantity to meet the requirement to not trigger the alert quantity.
    },
    description: String,
    price: {
        sell: Number,
        purchase: Number,
        stockValue: Number
    },
    category: String,
    variationGroup: String,
    upc: String,
    condition: String,
    location: {
        fullAddress: String,
        company: String,
        name: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        email: String,
        phone: String
    },
    detail: {
        weight: Number,
        height: Number,
        width: Number,
        depth: Number
    },
    bin: String, // Bin location of item
    monitor: Boolean,
    orders: [], // Orders that are pending from the item that is linked.
    linked: {
        ebay: [],
        amazon: [],
        woocommerce: [],
        shopify: []
    },
    created: Date,
    modified: Date,
    userId: String
}, { collection: 'inventory' })

const product = mongoose.model('Inventory', productSchema)

export default product