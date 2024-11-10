const { PDFNet } = require("@pdftron/pdfnet-node");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");

cloudinary.config({
  cloud_name: "ddgwlmj7b", // Thay bằng tên cloud của bạn
  api_key: "591861333514184", // Thay bằng API key của bạn
  api_secret: "I44-MedUXP5XYHkDadY9xpmfG8o", // Thay bằng API secret của bạn
});

// Thêm license key để khởi tạo PDFNet
PDFNet.initialize(
  "demo:1731151095695:7efd1e4a0300000000ffd271be45d91059cd3e5914751dc90c6ef79743"
);

const generateAndUploadPDF = async (data) => {
  const inputPath = path.resolve(__dirname, "../files/phieukhambenh.pdf");
  const outputPath = path.resolve(
    __dirname,
    `../files/phieukhambenh-${data.tenbenhnhan}.pdf`
  );

  const replaceText = async () => {
    const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
    await pdfdoc.initSecurityHandler();
    const replacer = await PDFNet.ContentReplacer.create();
    const page = await pdfdoc.getPage(1);

    await replacer.addString("ca", String(data.ca || ""));
    await replacer.addString("stt", String(data.stt || ""));
    await replacer.addString("name", String(data.tenbenhnhan || ""));
    await replacer.addString("gioitinh", String(data.gioitinh || ""));
    await replacer.addString("diachi", String(data.diachi || ""));
    await replacer.addString("ngaysinh", String(data.ngaysinh || ""));
    await replacer.addString("khoa", String(data.khoa || ""));
    await replacer.addString("bacsi", String(data.tenbacsi || ""));
    await replacer.addString("trieuchung", String(data.trieuchung || ""));

    await replacer.process(page);
    await pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
  };

  await PDFNet.runWithCleanup(replaceText);

  const result = await cloudinary.uploader.upload(outputPath, {
    resource_type: "raw",
  });
  return result.secure_url;
};

module.exports = { generateAndUploadPDF };
