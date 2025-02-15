const nodemailer = require("nodemailer");

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Hoặc một dịch vụ email khác: Outlook, Yahoo...
  auth: {
    user: "ngocduy14062003@gmail.com", // Email của bạn
    pass: "your-email-password", // Mật khẩu ứng dụng
  },
});

// Hàm gửi email
const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: "your-email@gmail.com", // Email người gửi
      to, // Email người nhận
      subject, // Tiêu đề
      html: htmlContent, // Nội dung email (có thể dùng HTML)
    });
    console.log("Email đã được gửi thành công!");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
};

module.exports = sendEmail;
