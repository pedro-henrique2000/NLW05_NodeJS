import { Router } from "express";
import { MessageController } from "./controllers/MessageController";
import { SettingsController } from "./controllers/SettingsController";
import { UsersControllers } from "./controllers/UsersController";

const routes = Router();

const settingsController = new SettingsController();
const usersControllers = new UsersControllers();
const messageController = new MessageController();

routes.post("/settings", settingsController.create);

routes.post("/users", usersControllers.create);

routes.post("/messages", messageController.create);
routes.get("/messages/:id", messageController.showByUser);

export { routes };
