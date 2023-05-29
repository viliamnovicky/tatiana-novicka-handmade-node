const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
    {
        slug: String,
        name: 
        {
            type: String,
            required: [true, "Prosím, zadajte názov produktu."]
        },
        price: 
        {
            type: Number,
            required: [true, "Prosím, zadajte cenu produktu."]
        },
        category: 
        {
            type: String,
            required: [true, "Prosím, vyberte kategóriu produktu."]
        },
        createdAt: 
        {
            type: Date,
            default: Date.now(),
            select: false
        },
        coverImage:
        {
            type: String,
            required: [true, "Prosím, vyberte fotografiu."]
        },
        productImages: [String],
        description:
        {
            type: String,
            required: [true, "Prosím, zadajte krátky popis produktu."]
        },
        availability: {
            type: String,
            required: [true, "Prosím, zadajte stav dostupnosti produktu."],
            enum: ["skladom", "na objednávku", "nedostupné"]
        }
    }
)

productSchema.index({name: 1})
productSchema.index({category: 1})

productSchema.pre('save', function (next) {
    this.slug = slugify(`${this.category}-${this.name}`, { lower: true });
    next();
  });

const Product = mongoose.model("Product", productSchema)

module.exports = Product