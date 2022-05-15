const mongoose = require('mongoose'), Schema = mongoose.Schema

const TaskSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
        level_of_priority: { type: Number, required:true},
        isCompleted: { type: Boolean, default: false},
        completionDate: { type: Date, default: Date.now() },
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
	},
	{ collection: 'tasks' }
)

const model = mongoose.model('TaskSchema', TaskSchema)

module.exports = model