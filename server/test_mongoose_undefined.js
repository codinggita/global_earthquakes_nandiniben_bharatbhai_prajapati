const mongoose = require('mongoose');

async function test() {
  try {
    await mongoose.connect();
    console.log("Connected to nothing?");
  } catch (err) {
    console.error("Error connecting to nothing:", err.message);
  }
}
test();
