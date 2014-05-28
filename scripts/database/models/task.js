var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
	name : String,
	status : Number,
	blockers : String,
	solutions : String,
	hidden : Boolean
});

mongoose.model('Task', TaskSchema);