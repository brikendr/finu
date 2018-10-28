import { Kinvey } from "kinvey-nativescript-sdk";
import { Config } from "~/app/shared/config";

export class UtilService {
  static COLORCLASSES: Array<string> = [
    "tile-red",
    "tile-purple",
    "tile-yellow",
    "tile-oceanblue",
    "tile-darkblue",
    "tile-lightgreen",
    "tile-orange",
    "tile-silver",
    "tile-deeppurple",
    "tile-limegreen",
    "tile-excellent",
    "tile-verygood",
    "tile-good",
    "tile-moderate",
    "tile-tight",
    "tile-broke"
  ];
  static MONTHNAMES: Array<string> = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  static isUserLoggedIn(): Promise<any> {
    if (!!Kinvey.User.getActiveUser()) {
      return Promise.resolve();
    } else {
      return Kinvey.User.login(Config.kinveyUsername, Config.kinveyPassword);
    }
  }

  static generateStatusLabel(dailyBudget: number): object {
    switch (true) {
      case (dailyBudget >= 500):
        return {
          description: "- Excellent -",
          status: "tile-excellent"
        };
      case (dailyBudget >= 400 && dailyBudget < 500):
        return {
          description: "- Very Good -",
          status: "tile-verygood"
        };
      case (dailyBudget >= 300 && dailyBudget < 400):
        return {
          description: "- Good -",
          status: "tile-good"
        };
      case (dailyBudget >= 200 && dailyBudget < 300):
        return {
          description: "- Moderate Budget -",
          status: "tile-moderate"
        };
      case (dailyBudget >= 100 && dailyBudget < 200):
        return {
          description: "- Tight -",
          status: "tile-tight"
        };
      default:
        return {
          description: "- Broke -",
          status: "tile-broke"
        };
    }
  }

  static generateRandomTileColor(): string {
    return this.COLORCLASSES[Math.floor(Math.random() * this.COLORCLASSES.length)];
  }

  static getMonthName(monthNr: number): string {
    return this.MONTHNAMES[monthNr];
  }

  static parseTimeStamp(timestamp: string): string {
    const date = new Date(parseInt(timestamp, 10));
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minStr = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minStr + " " + ampm;

    return date.getDate() + 1 + ". " + this.getMonthName(date.getMonth()) + " " + date.getFullYear() + " " + strTime;
  }
}
