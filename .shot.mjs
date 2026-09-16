import puppeteer from "puppeteer-core";

const [, , url, out, width] = process.argv;

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: Number(width) || 1440, height: 1000, deviceScaleFactor: 2 });
page.on("console", (m) => console.log("[console]", m.type(), m.text()));
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
await page.goto(url, { waitUntil: "networkidle0" });
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log("saved", out);
