import { io } from "../http";
import { ConnectionService } from "../services/ConnectionService";
import { UsersService } from "../services/UsersService";
import { MessageService } from "../services/MessageService";

interface IParams {
  text: string;
  email: string;
}

io.on("connect", (socket) => {
  const connectionService = new ConnectionService();
  const usersService = new UsersService();
  const messageService = new MessageService();

  socket.on("client_first_access", async (params) => {
    const socket_id = socket.id;
    const { email, text } = params as IParams;

    const userExists = await usersService.findByEmail(email);

    let user_id = null;

    if (!userExists) {
      const user = await usersService.create(email);

      await connectionService.create({
        socket_id,
        user_id: user.id,
      });

      user_id = user.id;
    } else {
      user_id = userExists.id;
      const connection = await connectionService.findByUserId(userExists.id);

      if (!connection) {
        await connectionService.create({
          socket_id,
          user_id: userExists.id,
        });
      } else {
        connection.socket_id = socket_id;

        await connectionService.create(connection);
      }
    }

    await messageService.create({ text, user_id });
  });
});
