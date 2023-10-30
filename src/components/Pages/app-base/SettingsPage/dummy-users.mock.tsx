import { AppUserModel, UNLOGGED_USER } from "~/models/app/user/user.model";

export function crearDummyUser(numUsuario: number) {
  let updatedUser = UNLOGGED_USER;
  if (numUsuario === 1) {
    updatedUser = new AppUserModel({
      id: "audasy",
      given_names: "Pepito",
      surnames: "Pérez",
      username: "pepito",
      email: "pepitoperez@mail.com",
      password: "1234556768",
      roles: [],
      phone_number: "7123456",

      accessToken: "123456789",
    });
  }
  if (numUsuario === 2) {
    updatedUser = new AppUserModel({
      id: "audasy",
      given_names: "Fulanito",
      surnames: "Gómez",
      username: "fgomez",
      email: "fgomez@mail.com",
      password: "1234556768",
      roles: [],
      phone_number: "7123456",

      accessToken: "123456789",
    });

    updatedUser.modifyDummyRole("ARTIST", "4", "ROADIE", "add");
    updatedUser.modifyDummyRole("ARTIST", "4", "ARTIST_OWNER", "add");
    updatedUser.modifyDummyRole("ARTIST", "4", "ARTIST_MEMBER", "add");
    updatedUser.modifyDummyRole("ARTIST", "4", "MANAGER", "add");
    updatedUser.modifyDummyRole("ARTIST", "5", "PRODUCER", "add");
  } else if (numUsuario === 3) {
    updatedUser = new AppUserModel({
      id: "audasy",
      given_names: "María",
      surnames: "Pachón",
      username: "mpachon",
      email: "mpachon@mail.com",
      password: "1234556768",
      roles: [],
      phone_number: "7123456",

      accessToken: "123456789",
    });

    updatedUser.modifyDummyRole("ARTIST", "10", "SOUND_ENGINEER", "add");
    updatedUser.modifyDummyRole("ARTIST", "10", "ARTIST_OWNER", "add");
    updatedUser.modifyDummyRole("ARTIST", "10", "MANAGER", "add");
    updatedUser.modifyDummyRole("ARTIST", "10", "TOUR_MANAGER", "add");
  } else if (numUsuario === 4) {
    updatedUser = new AppUserModel({
      id: "audasy",
      given_names: "Juanito",
      surnames: "Rodríguez",
      username: "jrod",
      email: "jrod@mail.com",
      password: "1234556768",
      roles: [],
      phone_number: "7123456",

      accessToken: "123456789",
    });

    updatedUser.modifyDummyRole("ARTIST", "13", "ROADIE", "add");
    updatedUser.modifyDummyRole("ARTIST", "13", "ARTIST_OWNER", "add");
    updatedUser.modifyDummyRole("ARTIST", "13", "ARTIST_MEMBER", "add");
    updatedUser.modifyDummyRole("ARTIST", "13", "MANAGER", "add");
    updatedUser.modifyDummyRole("PLACE", "3", "PLACE_OWNER", "add");
    updatedUser.modifyDummyRole("PLACE", "3", "MEDIA_MANAGER", "add");
    updatedUser.modifyDummyRole("PLACE", "7", "PLACE_OWNER", "add");
  } else if (numUsuario === 5) {
    updatedUser = new AppUserModel({
      id: "audasy",
      given_names: "Laura",
      surnames: "Jiménez",
      username: "ljimenez",
      email: "ljimenez@mail.com",
      password: "1234556768",
      roles: [],
      phone_number: "7123456",

      accessToken: "123456789",
    });

    updatedUser.modifyDummyRole("PLACE", "4", "PLACE_OWNER", "add");
    updatedUser.modifyDummyRole("PLACE", "4", "MANAGER", "add");
  }

  return updatedUser;
}
