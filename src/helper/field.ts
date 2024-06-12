import { Page } from "puppeteer";

export const pageType = async (
  page: Page,
  selector: string,
  value: string = "",
) => {
  await page.waitForSelector(selector);
  await page.waitForFunction(
    (selector: string) => {
      const element = document.querySelector(selector) as HTMLInputElement;
      return element && !element.disabled;
    },
    {},
    selector,
  );
  await page.type(selector, value);
};
