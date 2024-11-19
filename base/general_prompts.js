"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFlagValueSystemMessage = void 0;
exports.extractFlagValueSystemMessage = "You will be given a website content from which you should extract a value from a text in a following pattern:\n\n{{FLG:NAZWAFLAGI}}\n\nExample 1:\n\n        <dt class=\"old\">Version 0.12.1</dt>\n        <dd>- added some extra security</dd>\n        <dt class=\"old\">Version 0.12.1</dt>\n        <dd>- added some extra security</dd>\n        </dl>\n        <h2 style=\"background:#f4ffaa;font-family:monospace\">{{FLG:FIRMWARE}}</h2>\n    </div>\n</div>\n\nAnswer: FIRMWARE\n";
//# sourceMappingURL=general_prompts.js.map