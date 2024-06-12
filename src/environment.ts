export enum ENVIRONMENT {
  DEV = "https://dorian.seatrix.io",
}

export const stdUrl = (url: string) => {
  return url.replace(/\/$/, "");
};

export const getHostUrl = () => {
  return stdUrl((process.env.HOST_URL as ENVIRONMENT) || ENVIRONMENT.DEV);
};
export const getBackendUrl = () => {
  return stdUrl((process.env.BACKEND_URL as ENVIRONMENT) || ENVIRONMENT.DEV);
};
