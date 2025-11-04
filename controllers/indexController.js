const db = require("../db/queries");
const { format } = require("date-fns");
const bytes = require("bytes");
const supabase = require("../config/supabase");
const { file, folder } = require("../db/prisma");

async function getAllFiles(req, res) {
  if (!req.user) {
    return res.render("index", {
      user: null,
      files: [],
      folders: [],
    });
  }
  const files = await db.returnAllFilesByUser(req.user.id);
  const folders = await db.returnAllFoldersByUser(req.user.id);

  // files.forEach((file) => {
  //   const formattedSize = bytes(file.size);
  //   const formattedTime = format(new Date(file.uploadtime), "dd/MM/yyyy · HH:mm");
  //   file.size = formattedSize;
  //   file.uploadtime = formattedTime;
  // });

  for (const file of files) {
    const formattedSize = bytes(file.size);
    const formattedTime = format(
      new Date(file.uploadtime),
      "dd/MM/yyyy · HH:mm",
    );
    file.size = formattedSize;
    file.uploadtime = formattedTime;
  }

  res.render("index", {
    user: req.user,
    files: files,
    folders: folders,
  });
}

async function handleUpdateFolder(req, res, next) {
  const { fileId } = req.params;
  const file = await db.returnFileById(fileId);

  const folderId = req.body.folder || null;

  if (!file) {
    return res.status(404).render("error", { errorMessage: "File not found!" });
  }

  try {
    await db.updateFileLocation(file.id, folderId);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function handleDownloadFile(req, res, next) {
  const { fileId } = req.params;
  const file = await db.returnFileById(fileId);

  if (!file) {
    return res.status(404).render("error", { errorMessage: "File not found!" });
  }

  try {
    const response = await fetch(file.url);
    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function handleDeleteFile(req, res, next) {
  const { fileId } = req.params;
  const file = await db.returnFileById(fileId);

  if (!file) {
    return res.status(404).render("error", { errorMessage: "File not found!" });
  }

  try {
    await db.deleteFile(fileId);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = {
  getAllFiles,
  handleUpdateFolder,
  handleDownloadFile,
  handleDeleteFile,
};
