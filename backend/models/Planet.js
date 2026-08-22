import mongoose from 'mongoose';
const factSchema = new mongoose.Schema (
    {
        label: { type: String, required: true},
        value: { type: String, required: true },
    },
    { id_: false} 
);
const planetSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            required: [ true, 'Planet name is required.'],
            unique: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        tagline: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            required: [ true, "Hey, Nida! Description is required here."],
        },
        color: {
             type: String,
      default: "#5B8DEF",
        },
        textureUrl: {
            type: String,
      default: "",
        },

        orbitPosition: {
            type: Number,
            required: true,
        },

        facts: [factSchema],

        funFact: {
            type: String,
            default: "",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },

    { timestamps: true }
);

planetSchema.index( { name: "text" , description: "text" } );
export default mongoose.model( "Planet", planetSchema );