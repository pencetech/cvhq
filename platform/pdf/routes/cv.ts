import express from 'express';
const router = express.Router();
import browserApi from '../modules/browser';

/* PUT users listing. */
router.put('/', async function(req, res) {
  var page = await browserApi.newPage();
  await page.setContent(req.body.html);

  await page.emulateMediaType('screen');
  const pdfBuffer = await page.pdf({
    printBackground: true,
    preferCSSPageSize: true,
    format: 'A4',
  })
  res.setHeader('Content-Type', "application/pdf")
  res.send(pdfBuffer);
  await browserApi.handBack(page);
});

export default router;