'use strict';

import mongoose from 'mongoose';

const carMakeSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  models: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'models',
    },
  ],
  country: {
    type: String,
    default: 'Germany',
  },
}, { timestamps: true });

carMakeSchema.pre('findOne', function preHookCallback(done) {
  this.populate('models');
  done();
});

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('carMake', carMakeSchema, 'carMake', skipInit);
