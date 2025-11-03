const { Router } = require("express");
const indexRouter = Router();

const indexController = require("../controllers/indexController.js");

indexRouter.get("/", indexController.getAllFiles);
indexRouter.get("/files/:fileId/download", indexController.handleDownloadFile);
indexRouter.post(
  "/files/:fileId/updatefolder",
  indexController.handleUpdateFolder,
);
indexRouter.post("/files/:fileId/delete", indexController.handleDeleteFile);

module.exports = indexRouter;
