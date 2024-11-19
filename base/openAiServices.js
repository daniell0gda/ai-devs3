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
        while (_) try {
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
exports.OpenAIService = void 0;
var openai_1 = __importStar(require("openai"));
var dotenv_1 = __importDefault(require("dotenv"));
var OpenAIService = /** @class */ (function () {
    function OpenAIService(useDotnetEnv, apiKey) {
        if (useDotnetEnv === void 0) { useDotnetEnv = true; }
        if (useDotnetEnv) {
            dotenv_1.default.config();
        }
        this.openai = new openai_1.default({
            apiKey: apiKey !== null && apiKey !== void 0 ? apiKey : process.env.OPENAI_API_KEY
        });
    }
    OpenAIService.prototype.transcribeAudio = function (audioBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var file, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log('Transcribing audio, buffer length:', audioBuffer.length);
                        console.log('Buffer type:', typeof audioBuffer);
                        console.log('Is Buffer?', Buffer.isBuffer(audioBuffer));
                        return [4 /*yield*/, (0, openai_1.toFile)(audioBuffer, 'audio.webm', { type: 'audio/webm' })];
                    case 1:
                        file = _a.sent();
                        console.log('File created:', file.name, file.type, file.size);
                        console.log('Is File?', file instanceof File);
                        return [4 /*yield*/, this.openai.audio.transcriptions.create({
                                file: file,
                                model: 'whisper-1',
                            })];
                    case 2:
                        response = _a.sent();
                        console.log('Transcription response:', response);
                        return [2 /*return*/, response.text];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error in transcribeAudio:', error_1);
                        if (error_1 instanceof Error) {
                            console.error('Error message:', error_1.message);
                            console.error('Error stack:', error_1.stack);
                        }
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OpenAIService.prototype.analyzeImage = function (imageBase64) {
        return __awaiter(this, void 0, void 0, function () {
            var publicImageUrl, messages, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        publicImageUrl = "https://example.com/image.jpg";
                        messages = [
                            { role: 'user', content: 'What do you see in this image?' },
                            { role: 'user', content: publicImageUrl },
                            { role: 'user', content: "data:image/jpeg;base64,".concat(imageBase64) } // For local image
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.openai.chat.completions.create({
                                model: 'gpt-4-vision',
                                messages: messages,
                            })];
                    case 2:
                        response = _a.sent();
                        console.log(response.choices[0].message.content);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error analyzing image:', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OpenAIService.prototype.completion = function (messages, model, stream, jsonMode) {
        if (model === void 0) { model = "gpt-4"; }
        if (stream === void 0) { stream = false; }
        if (jsonMode === void 0) { jsonMode = false; }
        return __awaiter(this, void 0, void 0, function () {
            var chatCompletion, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.openai.chat.completions.create({
                                messages: messages,
                                model: model,
                                stream: stream,
                                response_format: jsonMode ? { type: "json_object" } : { type: "text" }
                            })];
                    case 1:
                        chatCompletion = _a.sent();
                        console.log('Chat completion', chatCompletion);
                        if (stream) {
                            return [2 /*return*/, chatCompletion];
                        }
                        else {
                            return [2 /*return*/, chatCompletion];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error in OpenAI completion:", error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return OpenAIService;
}());
exports.OpenAIService = OpenAIService;
//# sourceMappingURL=openAiServices.js.map