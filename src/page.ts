import { Page } from "puppeteer";

const timeout = 5000;

export const waitTypeSubmit = async (
  page: Page,
  selector,
  value,
  submit = true,
) => {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector) as HTMLInputElement;
        return element && !element.disabled;
      },
      {},
      selector,
    );
    await page.type(selector, value);
    if (submit) {
      await page.keyboard.press("Enter");
    }
  } catch (e) {
    console.error("waitTypeSubmit: error!", e);
  }
};

export const waitClick = async (
  page: Page,
  selector: string,
  timeout = 5000,
) => {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
  } catch (e) {
    console.error(`Selector (${selector}) - Not detected`);
  }
};

export const waitType2 = async (
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
