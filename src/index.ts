import express, { Request, Response } from "express";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { pageType } from "./helper/field";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const website = process.env.PUPPETEER_WEBSITE;

if (!website) {
  console.error("PUPPETEER_WEBSITE is not defined in the .env file");
  process.exit(1);
}

let browser: any, page: any;

app.all("/**", async (req: Request, res: Response) => {
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        headless: false,
        args: ["--auto-open-devtools-for-tabs"],
      });
      page = await browser.newPage();
    }

    const currentUrl = page.url();
    if (!website.match(currentUrl)) {
      console.log(`Redirecting from ${currentUrl} to ${website}`);
      await page.goto(website);
    }

    await page.goto(website);

    await pageType(page, "[name=email]", process.env.EMAIL);
    await pageType(page, "[name=password]", process.env.PASSWORD);

    const pageTitle = "test";

    res.send(`Title of the page is: ${pageTitle}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
