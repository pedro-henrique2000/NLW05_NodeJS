import { Request, Response } from "express";
import { MessageService } from "../services/MessageService";

class MessageController {
  async create(request: Request, response: Response) {
    const messagesService = new MessageService();
    const { admin_id, text, user_id } = request.body;

    const message = await messagesService.create({
      admin_id,
      text,
      user_id,
    });

    return response.json(message);
  }

  async showByUser(request: Request, response: Response) {
    const messagesService = new MessageService();
    const { id } = request.params;

    const list = await messagesService.listByUser(id);

    return response.json(list);
  }
}

export { MessageController };
