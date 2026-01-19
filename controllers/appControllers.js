import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { format } from "date-fns";

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
        username: req.body.username || null,
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
  if (req.user.id) {
    next();
  } else {
    res.redirect("/log-in");
  }
};

const getFileUpload = (req, res) => {
  res.render("file-upload");
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
        fileName: req.file.filename,
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
    files: folder.files,
  });
};

export {
  getSignUpForm,
  signUp,
  getLogInForm,
  isAuth,
  getFileUpload,
  uploadFile,
  displayDashboard,
  createFolder,
  viewFolder,
};
