import puppeteer from "puppeteer";
import { ENVIRONMENT, getBackendUrl, getHostUrl, stdUrl } from "./environment";
import { RequestType } from "./request.type";
import { getBrowserApi } from "./browser-api.js";
import { waitType2 } from "./page";

let browser, page, requestConfig: RequestType, isLoggingIn;

export const getBrowserOnce = async (
  env = ENVIRONMENT.DEV,
  feRequestConfig?: RequestType,
): Promise<string> => {
  if (!browser && !isLoggingIn) {
    isLoggingIn = true;

    if (!browser) {
      browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        args: ["--start-maximized"],
      });
      page = await browser.newPage();

      page.on("request", (request) => {
        const url = stdUrl(request.url());

        console.log(
          "OnRequest::",
          request.resourceType() === "xhr" && [url, getBackendUrl()],
        );
        if (
          request.resourceType() === "xhr" &&
          feRequestConfig &&
          url.match(getBackendUrl())
        ) {
          console.log(
            "page::type",
            [request.resourceType(), url].join(" \n \t"),
          );
          console.log(
            "page::request",
            [url, feRequestConfig && feRequestConfig.url].join(" \n\n\t "),
          );
          requestConfig = {
            url,
            method: request.method(),
            headers: request.headers(),
          };
          console.log("request", requestConfig);
        }
      });
    }

    await page.goto(env);

    await waitType2(page, "[name=email]", process.env.EMAIL || "");
    await waitType2(page, "[name=password]", process.env.PASSWORD || "");

    isLoggingIn = false;
  }

  if (isLoggingIn) {
    await new Promise((resolve) => {
      console.log(
        "Listening for log-in",
        [isLoggingIn, feRequestConfig.url].join(" \n\t "),
      );
      const intervalId = setInterval(() => {
        if (!isLoggingIn) {
          resolve(true);
          clearInterval(intervalId);
        }
      }, 1000);
    });
  }

  console.log("API request::", feRequestConfig.url);

  return await new Promise(async (resolve) => {
    let fetching = false;
    const intervalId = setInterval(async () => {
      console.log({ fetching, requestConfig }, [
        requestConfig?.url,
        getBackendUrl(),
      ]);
      if (!fetching && requestConfig && requestConfig.url !== getHostUrl()) {
        fetching = true;
        const response: string = await new Promise(async (resolve) => {
          console.log(
            "eval1",
            new Date().getTime(),
            Object.assign(requestConfig, {
              method: feRequestConfig.method,
              body: feRequestConfig.body,
            }),
          );
          const pageEval = await page.evaluate(
            getBrowserApi,
            requestConfig,
            feRequestConfig,
            getBackendUrl(),
          );
          resolve(pageEval);
        });

        resolve(response);
        clearInterval(intervalId);
      }
    }, 1000);
  });
};
