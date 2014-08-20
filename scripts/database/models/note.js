var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NoteSchema = new Schema({
	name : String,
	labels : [String],
	content : String
});

mongoose.model('Note', NoteSchema);