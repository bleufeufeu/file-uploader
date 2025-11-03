const { Router } = require("express");
const upload = require("../config/multer.js");
const uploadRouter = Router();

const uploadController = require("../controllers/uploadController.js");

uploadRouter.post("/", upload.single("file"), uploadController.handleUpload);
uploadRouter.post(
  "/:folderId",
  upload.single("file"),
  uploadController.handleUploadInFolder,
);

module.exports = uploadRouter;
