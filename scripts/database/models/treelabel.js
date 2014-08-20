var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TreeLabelSchema = new Schema({
	name : String,
	top : Boolean,
	parentId : Schema.Types.ObjectId
});

mongoose.model('TreeLabel', TreeLabelSchema);