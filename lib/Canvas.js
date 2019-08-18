"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_use_dimensions_1 = __importDefault(require("react-use-dimensions"));
const solandra_1 = require("solandra");
class CanvasPainterService {
    constructor() {
        this.seed = 0;
        this.playing = false;
        this.width = 100;
        this.height = 100;
        this.aspectRatio = 100;
        this.af = null;
        this.updateTime = () => {
            if (this.playing) {
                this.time += 0.01666666666;
                this.af = requestAnimationFrame(this.updateTime);
            }
            this.draw();
        };
        this.draw = () => {
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.width, this.height);
                const pts = new solandra_1.SCanvas(this.ctx, {
                    width: this.width,
                    height: this.height
                }, this.seed, this.time);
                this.sketch && this.sketch(pts);
            }
        };
        this.time = 0;
    }
    configure({ width, height, aspectRatio, sketch, seed, playing }) {
        if (width && height) {
            if (width / height > aspectRatio) {
                this.height = height;
                this.width = this.height * aspectRatio;
            }
            else {
                this.width = width;
                this.height = this.width / aspectRatio;
            }
        }
        this.sketch = sketch;
        this.seed = seed;
        this.playing = playing;
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.af && cancelAnimationFrame(this.af);
        this.updateTime();
    }
}
function Canvas({ aspectRatio, sketch, seed, playing = false, onClick = () => { } }) {
    const [ref, { width, height }] = react_use_dimensions_1.default();
    const canvasRef = react_1.useRef(null);
    const ctxRef = react_1.useRef(null);
    const [painterRef] = react_1.useState(new CanvasPainterService());
    react_1.useLayoutEffect(() => {
        let ctx;
        if (!ctxRef.current) {
            const cvs = canvasRef.current;
            if (cvs) {
                ctx = cvs.getContext("2d");
                painterRef.canvas = cvs;
            }
        }
        else {
            ctx = ctxRef.current;
        }
        painterRef.ctx = ctx;
        painterRef.configure({
            width,
            height,
            aspectRatio: aspectRatio || width / height,
            sketch,
            seed,
            playing
        });
    }, [playing, seed, sketch, aspectRatio, width, height]);
    return (react_1.default.createElement("div", { style: {
            flex: 1,
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        }, ref: ref, onClick: (evt) => {
            const { top, left } = canvasRef.current.getBoundingClientRect();
            const x = evt.clientX - left;
            const y = evt.clientY - top;
            onClick([x, y], [width, height]);
        } },
        react_1.default.createElement("canvas", { id: "myCanvas", ref: canvasRef })));
}
exports.Canvas = Canvas;
function FullScreenCanvas(props) {
    const { zIndex = 1000 } = props, others = __rest(props, ["zIndex"]);
    return (react_1.default.createElement("div", { style: {
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex,
            display: "flex",
            flexDirection: "column"
        } },
        react_1.default.createElement(Canvas, Object.assign({}, others))));
}
exports.FullScreenCanvas = FullScreenCanvas;
function FixedSizeCanvas(props) {
    const { width, height = 1000 } = props, others = __rest(props, ["width", "height"]);
    return (react_1.default.createElement("div", { style: {
            width,
            height,
            display: "flex",
            flexDirection: "column"
        } },
        react_1.default.createElement(Canvas, Object.assign({}, others))));
}
exports.FixedSizeCanvas = FixedSizeCanvas;
//# sourceMappingURL=Canvas.js.map