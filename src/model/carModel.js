'use strict';

import mongoose from 'mongoose';
import CarMake from './carMake';

const modelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  vin: {
    type: String,
    required: true,
  },
  driveTrain: {
    type: String,
    default: 'awd',
    enum: ['awd', 'rwd', 'fwd'],
  },
  carMakeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'carMake',
  },
}, { timestamps: true });

const skipInit = process.env.NODE_ENV === 'development';

export default mongoose.model('models', modelSchema, 'models', skipInit);

function modelPreHook(done) {
  return CarMake.findById(this.carMakeId)
    .then((foundCarMake) => {
      foundCarMake.models.push(this._id);
      return foundCarMake.save();
    })
    .then(() => done())
    .catch(done);
}

const modelPostHook = (document, done) => {
  return CarMake.findById(document.carMakeId)
    .then((foundCarMake) => {
      foundCarMake.models = foundCarMake.models.filter(model => model._id.toString() !== document._id.toString());
      return foundCarMake.save();
    })
    .then(() => done())
    .catch(done);
};

modelSchema.pre('save', modelPreHook);
modelSchema.post('remove', modelPostHook);
