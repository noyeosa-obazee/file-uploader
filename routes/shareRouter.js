import { Router } from "express";
import * as ctrl from "../controllers/shareControllers.js";
import * as appCtrl from "../controllers/appControllers.js";

const shareRoute = Router();

shareRoute.get("/view/:token", ctrl.viewShareLink);
shareRoute.get("/:type/:id", appCtrl.isAuth, ctrl.getShareForm);
shareRoute.post("/generate", appCtrl.isAuth, ctrl.generateShareLink);

export default shareRoute;
