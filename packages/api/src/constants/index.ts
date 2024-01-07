export enum Events {
  ON_HI = "ON_HI",
  ON_STATUS = "ON_STATUS",
  ON_DELETE_THOUGHT = "ON_DELETE_THOUGHT",
  ON_UPDATE_THOUGHT = "ON_UPDATE_THOUGHT",
  ON_CREATE_THOUGHT = "ON_CREATE_THOUGHT",
  ON_USER_UPDATE = "ON_USER_UPDATE",
  ON_NEW_USER = "ON_NEW_USER",
}

export const serverURL = new URL("http://localhost:3001/");
