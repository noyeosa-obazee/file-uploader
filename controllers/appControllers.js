import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { format } from "date-fns";
import path from "node:path";
import fs from "fs";
import { cloudinary } from "../config/cloudinary.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getSignUpForm = (req, res) => {
  res.render("sign-up");
};

const signUp = async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPassword) {
      return res.redirect("/sign-up");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
      },
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
  }
};

const getLogInForm = (req, res) => {
  res.render("log-in");
};

const isAuth = (req, res, next) => {
  if (req.user && req.user.id) {
    next();
  } else {
    res.redirect("/log-in");
  }
};

const uploadFile = async (req, res) => {
  const folderId = req.body.folderId ? parseInt(req.body.folderId) : null;
  const fixedOriginalName = Buffer.from(
    req.file.originalname,
    "latin1",
  ).toString("utf8");

  try {
    await prisma.file.create({
      data: {
        url: req.file.path,
        title: req.body.title || null,
        publicId: req.file.filename,
        originalName: fixedOriginalName,
        fileType: req.file.mimetype,
        size: req.file.size,
        userId: req.user.id,
        folderId: folderId,
      },
    });

    if (folderId) {
      res.redirect(`/folder/${folderId}`);
    } else {
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
  }
};

const displayDashboard = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { folders: true, files: { where: { folderId: null } } },
  });
  res.render("dashboard", {
    user: user,
    currentFolder: null,
    files: user.files,
    folders: user.folders,
    formatDate: (date) => {
      if (!date) return "Unknown Date";

      return format(new Date(date), "MMM dd, yyyy");
    },
  });
};

const createFolder = async (req, res) => {
  const { folderName } = req.body;

  await prisma.folder.create({
    data: {
      name: folderName,
      userId: req.user.id,
    },
  });

  res.redirect("/dashboard");
};

const viewFolder = async (req, res) => {
  const folderId = parseInt(req.params.id);

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: { files: true },
  });

  res.render("dashboard", {
    user: req.user,
    currentFolder: folder,
    files: folderId ? folder.files : req.user.files,
    formatDate: (date) => {
      if (!date) return "Unknown Date";

      return format(new Date(date), "MMM dd, yyyy");
    },
  });
};

const downloadFile = async (req, res) => {
  const fileId = req.params.fileId;

  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });
  const fileNameNoExt = file.originalName.split(".").slice(0, -1).join(".");

  const safeName = encodeURIComponent(fileNameNoExt);
  const downloadUrl = file.url.replace(
    "/upload/",
    `/upload/fl_attachment:${safeName}/`,
  );
  res.redirect(downloadUrl);
};

const deleteFile = async (req, res) => {
  const folderId = req.body.folderId ? parseInt(req.body.folderId) : null;
  const fileId = req.params.fileId;
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  try {
    await cloudinary.uploader.destroy(file.publicId);
    await prisma.file.delete({
      where: { id: fileId },
    });

    if (folderId) {
      res.redirect(`/folder/${folderId}`);
    } else {
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
  }
};

const deleteFolder = async (req, res) => {
  const folderId = parseInt(req.params.folderId);

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { files: true },
    });

    const folderPath = `file-uploader-app/${folder.name}`;

    await cloudinary.api.delete_resources_by_prefix(folderPath);

    await cloudinary.api.delete_folder(folderPath);

    await prisma.$transaction([
      prisma.file.deleteMany({
        where: { folderId: folderId },
      }),

      prisma.folder.delete({
        where: { id: folderId },
      }),
    ]);

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
  }
};

const logOut = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/log-in");
  });
};
export {
  getSignUpForm,
  signUp,
  getLogInForm,
  isAuth,
  uploadFile,
  displayDashboard,
  createFolder,
  viewFolder,
  downloadFile,
  deleteFile,
  deleteFolder,
  logOut,
};
