const EventEmitter = require("./EventEmitter");

// Gửi email sau khi đăng ký
EventEmitter.on("userRegistered", (user) => {
  console.log(`Sending welcome email to ${user.email}`);
});

// Ghi log sau khi đăng ký
EventEmitter.on("userRegistered", (user) => {
  console.log(`User registered: ${user.email}`);
});
