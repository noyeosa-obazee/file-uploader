import { Router } from "express";
import * as ctrl from "../controllers/appControllers.js";
const indexRoute = Router();

indexRoute.get("/sign-up", ctrl.getSignUpForm);
indexRoute.post("/sign-up", ctrl.signUp);

export default indexRoute;
