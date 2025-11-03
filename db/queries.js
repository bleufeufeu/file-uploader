const prisma = require("./prisma");

async function createUser(username, password, firstname, lastname) {
  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createFile(name, size, user, url) {
  try {
    const file = await prisma.file.create({
      data: {
        name: name,
        size: size,
        userId: user,
        url: url,
      },
    });
    return file;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createFileInFolder(name, size, user, folder = null, url) {
  try {
    const file = await prisma.file.create({
      data: {
        name: name,
        size: size,
        userId: user,
        folderId: folder,
        url: url,
      },
    });
    return file;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createFolder(name, user) {
  try {
    const folder = await prisma.folder.create({
      data: {
        name: name,
        userId: user,
      },
    });
    return folder;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnUserByUsername(username) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnFileById(fileId) {
  try {
    const result = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnAllFilesByUser(userId) {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        files: {
          include: {
            Folder: true,
          },
        },
      },
    });
    return result.files;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnAllFilesByFolder(folderId) {
  try {
    const result = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        files: true,
      },
    });
    return result.files;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnFolderById(folderId) {
  try {
    const result = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function returnAllFoldersByUser(userId) {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        folders: true,
      },
    });
    return result.folders;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateFileLocation(fileId, folderId) {
  try {
    const result = await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        folderId: folderId,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateFolderName(folderId, name) {
  try {
    const result = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: name,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteFile(fileId) {
  try {
    const result = await prisma.file.delete({
      where: {
        id: fileId,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteFolder(folderId) {
  try {
    const result = await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteFolderWithAllFiles(folderId) {
  try {
    const result = await prisma.$transaction([
      prisma.file.deleteMany({ where: { folderId: folderId } }),
      prisma.folder.delete({ where: { id: folderId } }),
    ]);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  createUser,
  createFile,
  createFileInFolder,
  createFolder,
  returnUserByUsername,
  returnFileById,
  returnAllFilesByUser,
  returnFolderById,
  returnAllFilesByFolder,
  returnAllFoldersByUser,
  updateFileLocation,
  updateFolderName,
  deleteFile,
  deleteFolder,
  deleteFolderWithAllFiles,
};
