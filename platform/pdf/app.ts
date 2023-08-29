import createError from 'http-errors';
import fs from 'fs';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pdfToPng } from 'pdf-to-png-converter';
import { create } from 'express-handlebars';
import browserApi from './modules/browser';
import logger from 'morgan';
import * as helpers from './lib/helpers';
import indexRouter from './routes/index';
import cvRouter from './routes/cv';
import { CvInput } from './types/cv';
import { PngOutput } from './types/pngOutput';

var app = express();
app.set('views', path.join(__dirname, 'views/handlebars'));
var hbs = create({
  helpers,
  layoutsDir: __dirname + '/views/handlebars/layouts/',
  extname: 'hbs',
  defaultLayout: 'planB',
  partialsDir: __dirname + '/views/handlebars/partials/'
})
// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/cv', cvRouter);

app.put('/image', async (req, res) => {
  const cvInput = req.body as CvInput;
  const css = fs.readFileSync(cvInput.cvType === "BASE" ? 'public/stylesheets/base.css' : 'public/stylesheets/prime.css')
  res.render('main', {
    layout: 'index',
    userBio: cvInput.userBio,
    summary: cvInput.summary,
    experiences: cvInput.experiences,
    education: cvInput.education,
    skillsets: cvInput.skillsets,
    css: css
  }, async (err, html) => {
    if (err) {
      console.log("ERROR: ", err);
    }
    var page = await browserApi.newPage();
    await page.setContent(html);

    await page.emulateMediaType('screen');
    const pdfBuffer = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      format: 'A4',
    })
    const pngPages = await pdfToPng(pdfBuffer, {
      disableFontFace: false
    })

    const stringPngPages: PngOutput[] = pngPages.map(page => {
      const stringifiedBuffer = page.content.toString('base64');
      const uri = 'data:image/png;base64,' + stringifiedBuffer;
      return {
        pageNumber: page.pageNumber,
        name: page.name,
        content: uri,
        path: page.path,
        width: page.width, 
        height: page.height,
      }
    })

    res.setHeader('Content-Type', "application/json")
    res.send(stringPngPages);
    await browserApi.handBack(page);

  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
