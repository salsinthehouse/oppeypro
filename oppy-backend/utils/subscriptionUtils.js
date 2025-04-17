const Subscription = require('../models/Subscription');

const isSubscribed = async (customerId) => {
  const sub = await Subscription.findOne({ customerId, active: true });
  return !!sub;
};

module.exports = { isSubscribed };
