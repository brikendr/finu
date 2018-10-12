import { Kinvey } from "kinvey-nativescript-sdk";
import { Config } from "~/app/shared/config";

export class UtilService {
  static isUserLoggedIn(): Promise<any> {
    if (!!Kinvey.User.getActiveUser()) {
      return Promise.resolve();
    } else {
      return Kinvey.User.login(Config.kinveyUsername, Config.kinveyPassword);
    }
  }
}
