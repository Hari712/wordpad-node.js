

const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://Harshit_test:Harshit@test.rwo25.mongodb.net/<dbname>?retryWrites=true&w=majority`, {useNewUrlParser: true})



const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
  console.log("database connected")
});

var id  = new mongoose.Types.ObjectId();

const noteSchema = new mongoose.Schema({
  // String is shorthand for {type: String}
    body:   String,
    psw: String,
    url: String,
    shareurl: String
});

const notepad = mongoose.model('notepad', noteSchema );

module.exports = { db , notepad};