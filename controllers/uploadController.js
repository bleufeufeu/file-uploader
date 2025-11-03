const db = require("../db/queries");
const supabase = require("../config/supabase");

async function handleUpload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded!");
    }

    const file = req.file;
    const folderId = req.body.folder || null;

    const uniqueFilename = `${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from("Files")
      .upload(uniqueFilename, file.buffer);

    if (error) {
      throw error;
    }

    const { data: publicUrl } = supabase.storage
      .from("Files")
      .getPublicUrl(uniqueFilename);

    console.log(publicUrl.publicUrl);

    await db.createFileInFolder(
      file.originalname,
      file.size,
      req.user.id,
      folderId,
      publicUrl.publicUrl,
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function handleUploadInFolder(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded!");
    }

    const { folderId } = req.params;
    const file = req.file;

    const uniqueFilename = `${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from("Files")
      .upload(uniqueFilename, file.buffer);

    if (error) {
      throw error;
    }

    const { data: publicUrl } = supabase.storage
      .from("Files")
      .getPublicUrl(uniqueFilename);

    console.log(publicUrl.publicUrl);

    await db.createFileInFolder(
      file.originalname,
      file.size,
      req.user.id,
      folderId,
      publicUrl.publicUrl,
    );
    res.redirect(`/folders/${folderId}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = {
  handleUpload,
  handleUploadInFolder,
};
