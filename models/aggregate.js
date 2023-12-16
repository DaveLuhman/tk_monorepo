import { Schema, model } from 'mongoose'

const aggregateSchema = new Schema(
  {
    week: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true
    },
    weekly: {
      totalRegHours: Number,
      totalOvertimeHours: Number,
      totalTimecards: Number,
      averageHoursPerEmployee: Number,
    },
    ytd: {
      totalRegHours: Number,
      totalOvertimeHours: Number,
      overtimeWeeksCount: Number,
      averageHoursPerEmployee: Number,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  }
)

aggregateSchema.virtual('weekly.totalHours').get(function () {
  return this.weekly.totalRegHours + this.weekly.totalOvertimeHours
})

const Aggregate = new model('aggregate', aggregateSchema)
export default Aggregate
