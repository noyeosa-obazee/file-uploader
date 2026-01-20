import { prisma } from "../lib/prisma.js";
import crypto from "crypto";

const getShareForm = async (req, res) => {
  const { type, id } = req.params;
  const itemId = type === "file" ? id : parseInt(id);

  let item;
  if (type === "file") {
    item = await prisma.file.findUnique({ where: { id: itemId } });
  } else {
    item = await prisma.folder.findUnique({ where: { id: itemId } });
  }

  res.render("share", { item, type });
};

const generateShareLink = async (req, res) => {
  const { itemId, type, duration } = req.body;
  const hours = parseInt(duration);

  const expiresAt = new Date();
  if (hours > 0) {
    expiresAt.setHours(expiresAt.getHours() + hours);
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 100);
  }

  const shareLink = await prisma.shareLink.create({
    data: {
      token: crypto.randomUUID(),
      expiresAt: expiresAt,
      userId: req.user.id,
      fileId: type === "file" ? itemId : null,
      folderId: type === "folder" ? parseInt(itemId) : null,
    },
  });

  res.render("share-success", {
    link: `${req.protocol}://${req.get("host")}/share/view/${shareLink.token}`,
  });
};

const viewShareLink = async (req, res) => {
  const { token } = req.params;

  const shareLink = await prisma.shareLink.findUnique({
    where: { token: token },
    include: {
      file: true,
      folder: {
        include: { files: true },
      },
      user: true,
    },
  });

  if (!shareLink) {
    return res.status(404).render("error", { msg: "Link not found" });
  }

  if (new Date() > new Date(shareLink.expiresAt)) {
    return res.status(410).render("error", { msg: "This link has expired" });
  }

  if (shareLink.file) {
    res.render("share/public-file", {
      file: shareLink.file,
      owner: shareLink.user.username || shareLink.user.email,
    });
  } else if (shareLink.folder) {
    res.render("share/public-folder", {
      folder: shareLink.folder,
      files: shareLink.folder.files,
      owner: shareLink.user.username || shareLink.user.email,
    });
  }
};

export { getShareForm, generateShareLink, viewShareLink };
