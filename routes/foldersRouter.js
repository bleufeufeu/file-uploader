const { Router } = require("express");
const foldersRouter = Router();

const foldersController = require("../controllers/foldersController.js");

// foldersRouter.get("/", foldersController.getAllFolders);
foldersRouter.post("/", foldersController.handleCreateFolder);
foldersRouter.get("/:folderId", foldersController.getFolderIndividual);
foldersRouter.post("/:folderId/delete", foldersController.handleDeleteFolder);

module.exports = foldersRouter;
