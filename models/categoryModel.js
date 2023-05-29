const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: "String",
        unique: [true, "Táto kategória už existuje"],
        required: [true, "Prosím, zadajte názov kategórie"]
    },
    coverImage: {
        type: "String",
        required: [true, "Prosím, vyberte titulnú fotografiu kategórie"]
    },
    products: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Item"
        }
    ]
})

categorySchema.index({name: 1})

const Category = mongoose.model("Category", categorySchema)

module.exports = Category