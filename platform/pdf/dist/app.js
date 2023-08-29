"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_errors_1 = __importDefault(require("http-errors"));
var fs_1 = __importDefault(require("fs"));
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var pdf_to_png_converter_1 = require("pdf-to-png-converter");
var express_handlebars_1 = require("express-handlebars");
var browser_1 = __importDefault(require("./modules/browser"));
var morgan_1 = __importDefault(require("morgan"));
var helpers = __importStar(require("./lib/helpers"));
var index_1 = __importDefault(require("./routes/index"));
var cv_1 = __importDefault(require("./routes/cv"));
var app = (0, express_1.default)();
app.set('views', path_1.default.join(__dirname, 'views/handlebars'));
var hbs = (0, express_handlebars_1.create)({
    helpers: helpers,
    layoutsDir: __dirname + '/views/handlebars/layouts/',
    extname: 'hbs',
    defaultLayout: 'planB',
    partialsDir: __dirname + '/views/handlebars/partials/'
});
// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/', index_1.default);
app.use('/cv', cv_1.default);
app.put('/image', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cvInput, css;
    return __generator(this, function (_a) {
        cvInput = req.body;
        css = fs_1.default.readFileSync(cvInput.cvType === "BASE" ? 'public/stylesheets/base.css' : 'public/stylesheets/prime.css');
        res.render('main', {
            layout: 'index',
            userBio: cvInput.userBio,
            summary: cvInput.summary,
            experiences: cvInput.experiences,
            education: cvInput.education,
            skillsets: cvInput.skillsets,
            css: css
        }, function (err, html) { return __awaiter(void 0, void 0, void 0, function () {
            var page, pdfBuffer, pngPages, stringPngPages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            console.log("ERROR: ", err);
                        }
                        return [4 /*yield*/, browser_1.default.newPage()];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, page.setContent(html)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.emulateMediaType('screen')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.pdf({
                                printBackground: true,
                                preferCSSPageSize: true,
                                format: 'A4',
                            })];
                    case 4:
                        pdfBuffer = _a.sent();
                        return [4 /*yield*/, (0, pdf_to_png_converter_1.pdfToPng)(pdfBuffer, {
                                disableFontFace: false
                            })];
                    case 5:
                        pngPages = _a.sent();
                        stringPngPages = pngPages.map(function (page) {
                            var stringifiedBuffer = page.content.toString('base64');
                            var uri = 'data:image/png;base64,' + stringifiedBuffer;
                            return {
                                pageNumber: page.pageNumber,
                                name: page.name,
                                content: uri,
                                path: page.path,
                                width: page.width,
                                height: page.height,
                            };
                        });
                        res.setHeader('Content-Type', "application/json");
                        res.send(stringPngPages);
                        return [4 /*yield*/, browser_1.default.handBack(page)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
