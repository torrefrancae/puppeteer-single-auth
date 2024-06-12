import { getBrowserOnce } from "./browser";
import { ENVIRONMENT, getBackendUrl, stdUrl } from "./environment";
import HTTPMethod from "http-method-enum";
import { RequestType } from "./request.type";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.all("/*", async (request: Request, res: Response) => {
  if (!request.url.match("/api")) {
    res.send("Blocked: " + request.url);
    return;
  }

  const hostUrl = getBackendUrl();
  const feRequestConfig: RequestType = {
    url: stdUrl(hostUrl + request.url),
    headers: request.headers,
    method: request.method,
  };

  if (
    [HTTPMethod.POST, HTTPMethod.PUT].indexOf(
      String(request.method.toUpperCase()) as any,
    ) > -1
  ) {
    feRequestConfig.body = JSON.stringify(request.body);
  }

  console.log(
    "REQUEST:: ",
    request.body,
    Object.values(feRequestConfig).join(" \n"),
  );

  const response = await getBrowserOnce(
    (process.env.HOST_URL as ENVIRONMENT) || ENVIRONMENT.DEV,
    feRequestConfig,
  );

  res.send(response);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
