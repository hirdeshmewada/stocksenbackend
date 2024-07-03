const mongoose = require("mongoose");
const uri = "mongodb+srv://djhd221:j3cFVB3MVINjAfwN@cluster0.seaxk9o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };