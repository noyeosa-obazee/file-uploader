import { Router } from "express";
import * as ctrl from "../controllers/appControllers.js";
import passport from "passport";
import multer from "multer";
const upload = multer({ dest: "./public/uploads/" });

const indexRoute = Router();

indexRoute.get("/sign-up", ctrl.getSignUpForm);
indexRoute.post("/sign-up", ctrl.signUp);
indexRoute.get("/log-in", ctrl.getLogInForm);
indexRoute.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/log-in",
  }),
);

indexRoute.post(
  "/upload-file",
  ctrl.isAuth,
  upload.single("uploaded_file"),
  ctrl.uploadFile,
);
indexRoute.get("/dashboard", ctrl.isAuth, ctrl.displayDashboard);
indexRoute.get("/folder/:id", ctrl.viewFolder);
indexRoute.post("/folder", ctrl.createFolder);
indexRoute.get("/file/:fileId/download", ctrl.downloadFile);
indexRoute.post("/file/:fileId/delete", ctrl.deleteFile);
indexRoute.post("/folder/:folderId/delete", ctrl.deleteFolder);

export default indexRoute;
