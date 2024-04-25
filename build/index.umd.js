(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node:process'), require('node:os'), require('node:tty')) :
    typeof define === 'function' && define.amd ? define(['exports', 'node:process', 'node:os', 'node:tty'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ZipPack = {}, global.process, global.os, global.tty));
})(this, (function (exports, process, os, tty) { 'use strict';

    /*
     * @Date: 2024-02-25 18:39:32
     * @LastEditTime: 2024-04-25 09:22:41
     * @Description: 测试文件
     * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\plugins\test.ts
     */
    const test = "=======> 666 typescript  plugin-zip-pack...";
    // console.log(test);
    // import { xtsMsgPushWeChat, zipPackLogs } from "../utils/msgPush";
    // 微信推送测试
    // const obj = {
    //   name: "11",
    //   version: '2',
    //   projectName: "测试一下",
    // };
    const deepClone = (obj) => {
        // 不是引用类型或者是null的话直接返回
        if (typeof obj !== "object" || typeof obj == null) {
            return obj;
        }
        // 初始化结果
        let result;
        if (obj instanceof Array) {
            result = [];
        }
        else {
            result = {};
        }
        for (let key in obj) {
            // 保证不是原型上的属性
            if (obj.hasOwnProperty(key)) {
                // 递归调用
                result[key] = deepClone(obj[key]);
            }
        }
        return result;
    };

    /*
     * @Date: 2024-04-12 09:47:36
     * @LastEditTime: 2024-04-12 12:50:10
     * @Description: 封装好的一些函数工具
     * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\utils\tools.ts
     */
    const getNowDate = () => {
        const myDate = new Date();
        const year = myDate.getFullYear(); //获取当前年
        const mon = myDate.getMonth() + 1; //获取当前月
        const date = myDate.getDate(); //获取当前日
        const hours = myDate.getHours(); //获取当前小时
        const minute = myDate.getMinutes();
        let timeValue = "";
        if (hours <= 12) {
            timeValue = "上午";
        }
        else if (hours > 12 && hours < 18) {
            timeValue = "下午";
        }
        else if (hours >= 18) {
            timeValue = "晚上";
        }
        return {
            currentDate: `(${year}-${mon}-${date}日${hours}:${minute})`,
            distDate: `(${year}-${mon}-${date}-${timeValue})`,
        };
    };
    // 辅助函数，将样式对象转换为字符串
    function getStyleString(styleObj) {
        return Object.keys(styleObj)
            .map(key => `${key}:${styleObj[key]}`)
            .join(';');
    }

    const ANSI_BACKGROUND_OFFSET = 10;

    const wrapAnsi16 = (offset = 0) => code => `\u001B[${code + offset}m`;

    const wrapAnsi256 = (offset = 0) => code => `\u001B[${38 + offset};5;${code}m`;

    const wrapAnsi16m = (offset = 0) => (red, green, blue) => `\u001B[${38 + offset};2;${red};${green};${blue}m`;

    const styles$1 = {
    	modifier: {
    		reset: [0, 0],
    		// 21 isn't widely supported and 22 does the same thing
    		bold: [1, 22],
    		dim: [2, 22],
    		italic: [3, 23],
    		underline: [4, 24],
    		overline: [53, 55],
    		inverse: [7, 27],
    		hidden: [8, 28],
    		strikethrough: [9, 29],
    	},
    	color: {
    		black: [30, 39],
    		red: [31, 39],
    		green: [32, 39],
    		yellow: [33, 39],
    		blue: [34, 39],
    		magenta: [35, 39],
    		cyan: [36, 39],
    		white: [37, 39],

    		// Bright color
    		blackBright: [90, 39],
    		gray: [90, 39], // Alias of `blackBright`
    		grey: [90, 39], // Alias of `blackBright`
    		redBright: [91, 39],
    		greenBright: [92, 39],
    		yellowBright: [93, 39],
    		blueBright: [94, 39],
    		magentaBright: [95, 39],
    		cyanBright: [96, 39],
    		whiteBright: [97, 39],
    	},
    	bgColor: {
    		bgBlack: [40, 49],
    		bgRed: [41, 49],
    		bgGreen: [42, 49],
    		bgYellow: [43, 49],
    		bgBlue: [44, 49],
    		bgMagenta: [45, 49],
    		bgCyan: [46, 49],
    		bgWhite: [47, 49],

    		// Bright color
    		bgBlackBright: [100, 49],
    		bgGray: [100, 49], // Alias of `bgBlackBright`
    		bgGrey: [100, 49], // Alias of `bgBlackBright`
    		bgRedBright: [101, 49],
    		bgGreenBright: [102, 49],
    		bgYellowBright: [103, 49],
    		bgBlueBright: [104, 49],
    		bgMagentaBright: [105, 49],
    		bgCyanBright: [106, 49],
    		bgWhiteBright: [107, 49],
    	},
    };

    Object.keys(styles$1.modifier);
    const foregroundColorNames = Object.keys(styles$1.color);
    const backgroundColorNames = Object.keys(styles$1.bgColor);
    [...foregroundColorNames, ...backgroundColorNames];

    function assembleStyles() {
    	const codes = new Map();

    	for (const [groupName, group] of Object.entries(styles$1)) {
    		for (const [styleName, style] of Object.entries(group)) {
    			styles$1[styleName] = {
    				open: `\u001B[${style[0]}m`,
    				close: `\u001B[${style[1]}m`,
    			};

    			group[styleName] = styles$1[styleName];

    			codes.set(style[0], style[1]);
    		}

    		Object.defineProperty(styles$1, groupName, {
    			value: group,
    			enumerable: false,
    		});
    	}

    	Object.defineProperty(styles$1, 'codes', {
    		value: codes,
    		enumerable: false,
    	});

    	styles$1.color.close = '\u001B[39m';
    	styles$1.bgColor.close = '\u001B[49m';

    	styles$1.color.ansi = wrapAnsi16();
    	styles$1.color.ansi256 = wrapAnsi256();
    	styles$1.color.ansi16m = wrapAnsi16m();
    	styles$1.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
    	styles$1.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
    	styles$1.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);

    	// From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js
    	Object.defineProperties(styles$1, {
    		rgbToAnsi256: {
    			value(red, green, blue) {
    				// We use the extended greyscale palette here, with the exception of
    				// black and white. normal palette only has 4 greyscale shades.
    				if (red === green && green === blue) {
    					if (red < 8) {
    						return 16;
    					}

    					if (red > 248) {
    						return 231;
    					}

    					return Math.round(((red - 8) / 247) * 24) + 232;
    				}

    				return 16
    					+ (36 * Math.round(red / 255 * 5))
    					+ (6 * Math.round(green / 255 * 5))
    					+ Math.round(blue / 255 * 5);
    			},
    			enumerable: false,
    		},
    		hexToRgb: {
    			value(hex) {
    				const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
    				if (!matches) {
    					return [0, 0, 0];
    				}

    				let [colorString] = matches;

    				if (colorString.length === 3) {
    					colorString = [...colorString].map(character => character + character).join('');
    				}

    				const integer = Number.parseInt(colorString, 16);

    				return [
    					/* eslint-disable no-bitwise */
    					(integer >> 16) & 0xFF,
    					(integer >> 8) & 0xFF,
    					integer & 0xFF,
    					/* eslint-enable no-bitwise */
    				];
    			},
    			enumerable: false,
    		},
    		hexToAnsi256: {
    			value: hex => styles$1.rgbToAnsi256(...styles$1.hexToRgb(hex)),
    			enumerable: false,
    		},
    		ansi256ToAnsi: {
    			value(code) {
    				if (code < 8) {
    					return 30 + code;
    				}

    				if (code < 16) {
    					return 90 + (code - 8);
    				}

    				let red;
    				let green;
    				let blue;

    				if (code >= 232) {
    					red = (((code - 232) * 10) + 8) / 255;
    					green = red;
    					blue = red;
    				} else {
    					code -= 16;

    					const remainder = code % 36;

    					red = Math.floor(code / 36) / 5;
    					green = Math.floor(remainder / 6) / 5;
    					blue = (remainder % 6) / 5;
    				}

    				const value = Math.max(red, green, blue) * 2;

    				if (value === 0) {
    					return 30;
    				}

    				// eslint-disable-next-line no-bitwise
    				let result = 30 + ((Math.round(blue) << 2) | (Math.round(green) << 1) | Math.round(red));

    				if (value === 2) {
    					result += 60;
    				}

    				return result;
    			},
    			enumerable: false,
    		},
    		rgbToAnsi: {
    			value: (red, green, blue) => styles$1.ansi256ToAnsi(styles$1.rgbToAnsi256(red, green, blue)),
    			enumerable: false,
    		},
    		hexToAnsi: {
    			value: hex => styles$1.ansi256ToAnsi(styles$1.hexToAnsi256(hex)),
    			enumerable: false,
    		},
    	});

    	return styles$1;
    }

    const ansiStyles = assembleStyles();

    // From: https://github.com/sindresorhus/has-flag/blob/main/index.js
    /// function hasFlag(flag, argv = globalThis.Deno?.args ?? process.argv) {
    function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process.argv) {
    	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
    	const position = argv.indexOf(prefix + flag);
    	const terminatorPosition = argv.indexOf('--');
    	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    }

    const {env} = process;

    let flagForceColor;
    if (
    	hasFlag('no-color')
    	|| hasFlag('no-colors')
    	|| hasFlag('color=false')
    	|| hasFlag('color=never')
    ) {
    	flagForceColor = 0;
    } else if (
    	hasFlag('color')
    	|| hasFlag('colors')
    	|| hasFlag('color=true')
    	|| hasFlag('color=always')
    ) {
    	flagForceColor = 1;
    }

    function envForceColor() {
    	if ('FORCE_COLOR' in env) {
    		if (env.FORCE_COLOR === 'true') {
    			return 1;
    		}

    		if (env.FORCE_COLOR === 'false') {
    			return 0;
    		}

    		return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
    	}
    }

    function translateLevel(level) {
    	if (level === 0) {
    		return false;
    	}

    	return {
    		level,
    		hasBasic: true,
    		has256: level >= 2,
    		has16m: level >= 3,
    	};
    }

    function _supportsColor(haveStream, {streamIsTTY, sniffFlags = true} = {}) {
    	const noFlagForceColor = envForceColor();
    	if (noFlagForceColor !== undefined) {
    		flagForceColor = noFlagForceColor;
    	}

    	const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;

    	if (forceColor === 0) {
    		return 0;
    	}

    	if (sniffFlags) {
    		if (hasFlag('color=16m')
    			|| hasFlag('color=full')
    			|| hasFlag('color=truecolor')) {
    			return 3;
    		}

    		if (hasFlag('color=256')) {
    			return 2;
    		}
    	}

    	// Check for Azure DevOps pipelines.
    	// Has to be above the `!streamIsTTY` check.
    	if ('TF_BUILD' in env && 'AGENT_NAME' in env) {
    		return 1;
    	}

    	if (haveStream && !streamIsTTY && forceColor === undefined) {
    		return 0;
    	}

    	const min = forceColor || 0;

    	if (env.TERM === 'dumb') {
    		return min;
    	}

    	if (process.platform === 'win32') {
    		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
    		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
    		const osRelease = os.release().split('.');
    		if (
    			Number(osRelease[0]) >= 10
    			&& Number(osRelease[2]) >= 10_586
    		) {
    			return Number(osRelease[2]) >= 14_931 ? 3 : 2;
    		}

    		return 1;
    	}

    	if ('CI' in env) {
    		if ('GITHUB_ACTIONS' in env || 'GITEA_ACTIONS' in env) {
    			return 3;
    		}

    		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'BUILDKITE', 'DRONE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
    			return 1;
    		}

    		return min;
    	}

    	if ('TEAMCITY_VERSION' in env) {
    		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    	}

    	if (env.COLORTERM === 'truecolor') {
    		return 3;
    	}

    	if (env.TERM === 'xterm-kitty') {
    		return 3;
    	}

    	if ('TERM_PROGRAM' in env) {
    		const version = Number.parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

    		switch (env.TERM_PROGRAM) {
    			case 'iTerm.app': {
    				return version >= 3 ? 3 : 2;
    			}

    			case 'Apple_Terminal': {
    				return 2;
    			}
    			// No default
    		}
    	}

    	if (/-256(color)?$/i.test(env.TERM)) {
    		return 2;
    	}

    	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    		return 1;
    	}

    	if ('COLORTERM' in env) {
    		return 1;
    	}

    	return min;
    }

    function createSupportsColor(stream, options = {}) {
    	const level = _supportsColor(stream, {
    		streamIsTTY: stream && stream.isTTY,
    		...options,
    	});

    	return translateLevel(level);
    }

    const supportsColor = {
    	stdout: createSupportsColor({isTTY: tty.isatty(1)}),
    	stderr: createSupportsColor({isTTY: tty.isatty(2)}),
    };

    // TODO: When targeting Node.js 16, use `String.prototype.replaceAll`.
    function stringReplaceAll(string, substring, replacer) {
    	let index = string.indexOf(substring);
    	if (index === -1) {
    		return string;
    	}

    	const substringLength = substring.length;
    	let endIndex = 0;
    	let returnValue = '';
    	do {
    		returnValue += string.slice(endIndex, index) + substring + replacer;
    		endIndex = index + substringLength;
    		index = string.indexOf(substring, endIndex);
    	} while (index !== -1);

    	returnValue += string.slice(endIndex);
    	return returnValue;
    }

    function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
    	let endIndex = 0;
    	let returnValue = '';
    	do {
    		const gotCR = string[index - 1] === '\r';
    		returnValue += string.slice(endIndex, (gotCR ? index - 1 : index)) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
    		endIndex = index + 1;
    		index = string.indexOf('\n', endIndex);
    	} while (index !== -1);

    	returnValue += string.slice(endIndex);
    	return returnValue;
    }

    const {stdout: stdoutColor, stderr: stderrColor} = supportsColor;

    const GENERATOR = Symbol('GENERATOR');
    const STYLER = Symbol('STYLER');
    const IS_EMPTY = Symbol('IS_EMPTY');

    // `supportsColor.level` → `ansiStyles.color[name]` mapping
    const levelMapping = [
    	'ansi',
    	'ansi',
    	'ansi256',
    	'ansi16m',
    ];

    const styles = Object.create(null);

    const applyOptions = (object, options = {}) => {
    	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    		throw new Error('The `level` option should be an integer from 0 to 3');
    	}

    	// Detect level if not set manually
    	const colorLevel = stdoutColor ? stdoutColor.level : 0;
    	object.level = options.level === undefined ? colorLevel : options.level;
    };

    const chalkFactory = options => {
    	const chalk = (...strings) => strings.join(' ');
    	applyOptions(chalk, options);

    	Object.setPrototypeOf(chalk, createChalk.prototype);

    	return chalk;
    };

    function createChalk(options) {
    	return chalkFactory(options);
    }

    Object.setPrototypeOf(createChalk.prototype, Function.prototype);

    for (const [styleName, style] of Object.entries(ansiStyles)) {
    	styles[styleName] = {
    		get() {
    			const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
    			Object.defineProperty(this, styleName, {value: builder});
    			return builder;
    		},
    	};
    }

    styles.visible = {
    	get() {
    		const builder = createBuilder(this, this[STYLER], true);
    		Object.defineProperty(this, 'visible', {value: builder});
    		return builder;
    	},
    };

    const getModelAnsi = (model, level, type, ...arguments_) => {
    	if (model === 'rgb') {
    		if (level === 'ansi16m') {
    			return ansiStyles[type].ansi16m(...arguments_);
    		}

    		if (level === 'ansi256') {
    			return ansiStyles[type].ansi256(ansiStyles.rgbToAnsi256(...arguments_));
    		}

    		return ansiStyles[type].ansi(ansiStyles.rgbToAnsi(...arguments_));
    	}

    	if (model === 'hex') {
    		return getModelAnsi('rgb', level, type, ...ansiStyles.hexToRgb(...arguments_));
    	}

    	return ansiStyles[type][model](...arguments_);
    };

    const usedModels = ['rgb', 'hex', 'ansi256'];

    for (const model of usedModels) {
    	styles[model] = {
    		get() {
    			const {level} = this;
    			return function (...arguments_) {
    				const styler = createStyler(getModelAnsi(model, levelMapping[level], 'color', ...arguments_), ansiStyles.color.close, this[STYLER]);
    				return createBuilder(this, styler, this[IS_EMPTY]);
    			};
    		},
    	};

    	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
    	styles[bgModel] = {
    		get() {
    			const {level} = this;
    			return function (...arguments_) {
    				const styler = createStyler(getModelAnsi(model, levelMapping[level], 'bgColor', ...arguments_), ansiStyles.bgColor.close, this[STYLER]);
    				return createBuilder(this, styler, this[IS_EMPTY]);
    			};
    		},
    	};
    }

    const proto = Object.defineProperties(() => {}, {
    	...styles,
    	level: {
    		enumerable: true,
    		get() {
    			return this[GENERATOR].level;
    		},
    		set(level) {
    			this[GENERATOR].level = level;
    		},
    	},
    });

    const createStyler = (open, close, parent) => {
    	let openAll;
    	let closeAll;
    	if (parent === undefined) {
    		openAll = open;
    		closeAll = close;
    	} else {
    		openAll = parent.openAll + open;
    		closeAll = close + parent.closeAll;
    	}

    	return {
    		open,
    		close,
    		openAll,
    		closeAll,
    		parent,
    	};
    };

    const createBuilder = (self, _styler, _isEmpty) => {
    	// Single argument is hot path, implicit coercion is faster than anything
    	// eslint-disable-next-line no-implicit-coercion
    	const builder = (...arguments_) => applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));

    	// We alter the prototype because we must return a function, but there is
    	// no way to create a function with a different prototype
    	Object.setPrototypeOf(builder, proto);

    	builder[GENERATOR] = self;
    	builder[STYLER] = _styler;
    	builder[IS_EMPTY] = _isEmpty;

    	return builder;
    };

    const applyStyle = (self, string) => {
    	if (self.level <= 0 || !string) {
    		return self[IS_EMPTY] ? '' : string;
    	}

    	let styler = self[STYLER];

    	if (styler === undefined) {
    		return string;
    	}

    	const {openAll, closeAll} = styler;
    	if (string.includes('\u001B')) {
    		while (styler !== undefined) {
    			// Replace any instances already present with a re-opening code
    			// otherwise only the part of the string until said closing code
    			// will be colored, and the rest will simply be 'plain'.
    			string = stringReplaceAll(string, styler.close, styler.open);

    			styler = styler.parent;
    		}
    	}

    	// We can move both next actions out of loop, because remaining actions in loop won't have
    	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
    	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
    	const lfIndex = string.indexOf('\n');
    	if (lfIndex !== -1) {
    		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
    	}

    	return openAll + string + closeAll;
    };

    Object.defineProperties(createChalk.prototype, styles);

    const chalk = createChalk();
    createChalk({level: stderrColor ? stderrColor.level : 0});

    /*
     * @Date: 2024-04-12 09:54:48
     * @LastEditTime: 2024-04-12 10:08:42
     * @Description: node模块操作相关方法
     * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\utils\file.ts
     */
    const fs = require("fs");
    const { resolve, join } = require("path");
    const error = chalk.red;
    const sucess = chalk.green;
    /*
     获取（以当前文件路径util位置）的项目根目录路径
     __dirname 是当前文件夹路径 d:\web_si\my_webDemo\my-projectFrame\zip-pack\src\util
     需要注意：
     在node环境可以直接访问，而在浏览器中会找不到！ 需要声明
     const __dirname = resolve()
    */
    const zipPackRootDir = resolve(); // xxx\zip-pack
    /* 设置.zip最终输出目录（默认项目根目录）
       设置打包名称+打包时间
    */
    const setOutputDir = (optZipName, isPackagingTime) => {
        const res = join(zipPackRootDir, isPackagingTime
            ? `${optZipName}-${getNowDate().distDate}.zip`
            : `${optZipName}.zip`);
        return res;
    };
    /* 获取目标路径 */
    const getTargetDir = (targetDir) => resolve(zipPackRootDir, targetDir);
    /* 判断文件是否存在 */
    const isPathExists = (filePath) => fs.existsSync(filePath);
    /* 删除文件 */
    function deleteFile(filePath) {
        try {
            fs.unlinkSync(filePath);
            console.log(sucess("File deleted successfully."));
        }
        catch (err) {
            console.error(error("Error deleting file:", err));
        }
    }
    /** 递归添加文件和子文件夹 */
    function addFilesToZip(jszip, folderPath) {
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            const filePath = `${folderPath}/${file}`;
            if (fs.statSync(filePath).isDirectory()) {
                const subFolder = jszip.folder(file);
                addFilesToZip(subFolder, filePath); // 递归处理子文件夹
            }
            else {
                const content = fs.readFileSync(filePath);
                jszip.file(file, content);
            }
        }
    }

    /*
     * @Date: 2024-04-12 09:31:09
     * @LastEditTime: 2024-04-12 15:46:16
     * @Description
     * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\utils\constant.ts
     */
    const pubStyle = {
        width: "100%",
        height: "auto",
        padding: '5px 3px',
        textAlign: 'left',
        background: "rgba(235,238,245,1)",
        border: "3px dashed rgb(103, 194, 58)",
        borderRadius: "20px",
        boxShadow: "0 2px 12px 0 rgba(0,0,0,.1)",
    };
    const xtsBgStyle = {
        ...pubStyle,
    };
    const xtsBgStyle2 = {
        ...pubStyle,
        fontSize: "24px",
        marginTop: "20px",
    };

    /*
     * @Date: 2024-04-11 09:52:14
     * @LastEditTime: 2024-04-11 16:49:27
     * @Description:
     * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\http\index.ts
     */
    const http = require("http");
    const httpGet = (api) => {
        return new Promise((resolve, reject) => {
            http
                .get(api, (res) => {
                let bufferData;
                res.on("data", (chunk) => {
                    bufferData = chunk;
                });
                res.on("end", () => {
                    resolve(bufferData);
                });
            })
                .on("error", (err) => {
                console.log("Error: ", err.message);
                reject(err);
            });
        });
    };

    /*
     * @Date: 2024-04-11 17:09:22
     * @LastEditTime: 2024-04-15 12:51:08
     * @Description: 消息推送
     * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\utils\msgPush.ts
     */
    /** 虾推啥服务推送到微信
     *  get请求地址：'https://wx.xtuis.cn/您的token.send?text=黄金大涨&desp=黄金大涨100元'
     *
     */
    async function xtsMsgPushWeChat(content, token, titleStr) {
        const api = `http://wx.xtuis.cn/${token}.send`; // 完整服务接口
        const title = titleStr || "【前端项目打包】结果通知！";
        const fullUrl = `${api}?text=${title}&desp=${content}`; // 拼接对应get请求参数
        const res = (await httpGet(fullUrl)); // 结果肯定是buffer类型数据 所以用as 断言一下
        // 这里接口请求到的是 buffer类型数据，方便查看需要转换一下
        const strData = res.toString();
        console.log("消息推送接口调用结果：", strData);
    }
    /** 日志打印 */
    function zipPackLogs(obj, type = 1) {
        const { projectName, name, version, targetDir, outputFilePath, doneTime } = obj;
        // 终端打印
        const cmdMsg = `
      <===========  zip打包成功 ======>
      ${name} 插件版本：${version}
      打包目标目录: ${targetDir}
      打包输出路径：${outputFilePath}
      打包完成时间：${doneTime}
      <===========  ${name}   =======>
      `;
        const disable = `
      <===========   插件已禁用   ======>
      ${name} 插件版本：${version}
      如需开启请在参数选项 enable 字段传入值为 true
      <=========== ${name} ======>`;
        const wxMsg = `
        <div style="${getStyleString(xtsBgStyle)}">
          <div>当前项目名称: <font color="red">${projectName}</font> </div>
          <div>插件名称: <font color="red">${name}</font> </div>
          <div>插件版本: <font color="red">${version}</font> </div>
          <div>打包输出路径: <font color="red">${outputFilePath}</font> </div>
          <div>打包目标目录: ${targetDir}</div>
          <div>打包完成时间: ${doneTime}</div>
        </div>
        <div style="${getStyleString(xtsBgStyle2)}">
          <div>插件地址:  <a href="https://www.npmjs.com/package/plugin-zip-pack">plugin-zip-pack</a>  </div>
          <div>插件作者:  尖椒土豆sss</div>
        </div>
      `;
        const logs = {
            1: cmdMsg,
            2: disable,
            3: wxMsg,
        };
        return logs[type];
    }

    var name = "plugin-zip-pack";
    var version = "1.0.18";

    /*
     * @Date: 2024-02-23 16:20:49
     * @LastEditTime: 2024-04-25 09:22:09
     * @Description: plugin-zip-pack 插件实现
     * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\plugins\plugin-zip-pack.ts
     */
    // TODO 判断当前环境是 Vite 还是 Webpack
    /**  插件入口函数  */
    // export const pluginZipPack = () => {
    //   // 判断当前环境是 Vite 还是 Webpack
    //   if (isVite()) {
    //     return pluginZipPackVite;
    //   } else if (isWebpack()) {
    //     return PluginZipPackWebpack;
    //   } else {
    //     throw new Error("Unsupported build tool environment[不支持的生成工具环境]");
    //   }
    // };
    //  require引入时， 在项目.js配置文件中使用打包报错  Error: Cannot find module 'jszip'
    // import jszip from "jszip";
    const jszip = require('jszip');
    const JSZip = new jszip();
    const pluginNameVersion = { name, version };
    const logStr = 'plugin-zip-pack----->   ';
    console.log(logStr + version);
    /** 支持vite打包指定文件夹为.zip包的插件函数 */
    const pluginZipPackVite = (options) => {
        return {
            name: "vite-plugin-zip-pack",
            apply: "build",
            closeBundle() {
                // vite打包结束时的钩子
                console.log(sucess(logStr + "Vite build completed!"));
                dirToZipFun(options);
            },
        };
    };
    /** 支持webpack打包指定文件夹为.zip包的类插件函数 */
    class PluginZipPackWebpack {
        options;
        constructor(options) {
            this.options = options;
        }
        apply(compiler) {
            // 判断是否是生产环境
            if (compiler.options.mode === "production") {
                compiler.hooks.done.tap("WebpackPluginZipPack", () => {
                    console.log(sucess(logStr + "Webpack build completed!"));
                    dirToZipFun(this.options);
                });
            }
        }
    }
    /** 支持 rollup 打包指定文件夹为.zip包的插件函数 */
    const pluginZipPackRollup = (options) => {
        return {
            name: "rollup-plugin-zip-pack",
            generateBundle(options2, bundle) {
                console.log(sucess(logStr + "Rollup build finished!"));
                dirToZipFun(options);
            },
        };
    };
    /**
     * @description: 将文件夹打包为.zip
     * 在这里对参数设置一些默认值
     * @return {*}
     */
    function dirToZipFun({ enable = true, isPushVx = false, xtsToken = "", optZipName = "dist", targetDir = "dist", isPackagingTime = true }) {
        if (!enable) {
            console.log(sucess(zipPackLogs(pluginNameVersion, 2)));
            return;
        }
        if (!isPathExists(getTargetDir(targetDir))) {
            console.log(sucess(getTargetDir(targetDir), "目标路径不存在，请传入存在的指定目录！"));
            return;
        }
        const params = {
            optZipName,
            targetDir,
            isPushVx,
            xtsToken,
            isPackagingTime,
        };
        // 设置 .zip包输出到当前项目跟目录
        const outputFilePath = setOutputDir(optZipName, isPackagingTime);
        if (isPathExists(outputFilePath)) {
            console.log(sucess("先删除已存在的.zip文件-->", outputFilePath));
            deleteFile(outputFilePath);
            setTimeout(() => {
                dirToZipHandle(params);
            }, 800);
        }
        else {
            dirToZipHandle(params);
        }
    }
    /**
     * @description: 将指定文件夹打包为.zip
     * @param {*} optZipName 打包后文件夹名称 xxx
     * @param {*} targetDir 需要打包的文件夹 dist
     * @return {*}
     */
    // function dirToZipHandle(optZipName: string, targetDir: string, isPushVx?: boolean) {
    function dirToZipHandle({ optZipName, targetDir, isPushVx, xtsToken, isPackagingTime }) {
        // 获取要打包的目录路径
        const targetPath = getTargetDir(targetDir);
        // 设置 .zip包输出到当前项目跟目录
        const outputFilePath = setOutputDir(optZipName, isPackagingTime); // 使用断言告诉ts isPackagingTime确定不会是 undefined 而是 boolean值
        // 打包zip
        addFilesToZip(JSZip, targetPath);
        // 生成zip压缩包内容的Buffer值，专门为Node.js使用
        JSZip.generateAsync({ type: "nodebuffer" })
            .then((content) => {
            // 将压缩后的内容写入文件
            fs.writeFileSync(outputFilePath, content);
            const logInfo = {
                projectName: optZipName, // 打包文件名称（项目名称）
                ...pluginNameVersion,
                targetDir,
                outputFilePath,
                doneTime: getNowDate().distDate,
            };
            // node终端打印
            console.log(sucess(zipPackLogs(logInfo)));
            // 开启 微信消息推送提醒
            if (isPushVx && xtsToken) {
                xtsMsgPushWeChat(zipPackLogs(logInfo, 3), xtsToken);
            }
        })
            .catch((err) => {
            console.error(error("Compression failed:", err));
        });
    }

    exports.PluginZipPackWebpack = PluginZipPackWebpack;
    exports.deepClone = deepClone;
    exports.pluginZipPackRollup = pluginZipPackRollup;
    exports.pluginZipPackVite = pluginZipPackVite;
    exports.test = test;

}));
