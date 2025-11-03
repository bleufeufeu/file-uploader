const db = require("../db/queries");
const { format } = require("date-fns");
const bytes = require("bytes");

async function getFolderIndividual(req, res, next) {
  const { folderId } = req.params;
  const folder = await db.returnFolderById(folderId);
  const allFolders = await db.returnAllFoldersByUser(req.user.id);

  if (!folder) {
    return res
      .status(404)
      .render("error", { errorMessage: "Folder not found!" });
  }
  try {
    const files = await db.returnAllFilesByFolder(folderId);

    for (const file of files) {
      const formattedSize = bytes(file.size);
      const formattedTime = format(
        new Date(file.uploadtime),
        "dd/MM/yyyy · HH:mm",
      );
      file.size = formattedSize;
      file.uploadtime = formattedTime;
    }
    res.render("foldersIndividual", {
      user: req.user,
      folder: folder,
      files: files,
      folders: allFolders,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function handleCreateFolder(req, res, next) {
  try {
    await db.createFolder(req.body.name, req.user.id);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function handleDeleteFolder(req, res, next) {
  const { folderId } = req.params;
  const folder = await db.returnFolderById(folderId);

  if (!folder) {
    return res
      .status(404)
      .render("error", { errorMessage: "Folder not found!" });
  }

  try {
    await db.deleteFolder(folderId);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = {
  getFolderIndividual,
  handleCreateFolder,
  handleDeleteFolder,
};
