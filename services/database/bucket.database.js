const Bucket = require("../../models/bucket.model");

const getAllBuckets = async () => {
  const buckets = await Bucket.find().lean();
  return buckets;
};
const addBucket = async (payload) => {
  const bucket = new Bucket(payload);
  return await bucket.save();
};

const getSalt = async (bucketId) => {
  return await Bucket.findOne({ _id: bucketId }).select("salt").lean();
};

module.exports = { getAllBuckets, addBucket, getSalt };
