//  fxxking commonjs
declare const global: any;
declare const evilCommonjsConfig: undefined |
{
    log?:
    {
        config?: boolean;
        load?: boolean;
        define?: boolean;
        readyToCapture?: boolean;
        results?: boolean;
    }
    loadingTimeout?: number;
};
interface Module
{
    registerMapping: (path: string, mapping: string[]) => void;
    load: (path: string, mapping?: string[]) => Promise<any>;
    capture: (path: string, mapping?: string[]) => any;
    readyToCapture: (path?: string) => void;
    pauseCapture: () => void;
    exports: any;
}
interface Window
{
    require: (path: string) => any;
    module: Module;
    exports: any;
}
(() =>
{
    const pathStack: string[] = [];
    pathStack.push(location.href);
    const getBasePath = (): string => location.href;
    const getCurrentPath = () => pathStack[pathStack.length -1] ?? location.href;
    const loadScript = async (src: string): Promise<void> => new Promise<void>
    (
        (resolve, reject) =>
        {
            const script = <HTMLScriptElement>document.createElement("script");
            script.src = src;
            script.onload = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
        }
    );
    const loadJsonRaw = async (src: string): Promise<void> => new Promise<void>
    (
        (resolve, reject) =>
        {
            const request = new XMLHttpRequest();
            request.open('GET', src, true);
            request.onreadystatechange = function()
            {
                if (4 === request.readyState)
                {
                    if (200 <= request.status && request.status < 300)
                    {
                        try
                        {
                            resolve(JSON.parse(request.responseText));
                        }
                        catch(err)
                        {
                            reject(err);
                        }
                    }
                    else
                    {
                        reject(request);
                    }
                }
            };
            request.send(null);
        }
    );
    const makeAbsoluteUrl = function(path: string): string
    {
        const mappedPath = resolveMapping(path);
        const base = mappedPath ? getBasePath(): getCurrentPath();
        const url = mappedPath ?? path;
        let baseParts = base.split("?")[0].split("/");
        if (4 <= baseParts.length && "" !== baseParts[baseParts.length -1])
        {
            // ファイル名部分の除去
            baseParts = baseParts.slice(0, -1);
        }
        if (4 <= baseParts.length && "" === baseParts[baseParts.length -1])
        {
            // 末尾の空要素を除去(しておかないと結合時に余分に / が挟まる)
            baseParts = baseParts.slice(0, -1);
        }
        let urlParts = url.split("/");
        if (0 <= urlParts[0].indexOf(":"))
        {
            //  絶対パスなので base 側は全て破棄
            baseParts = [];
        }
        else
        {
            if ("" === urlParts[0])
            {
                urlParts = urlParts.slice(1);
                if ("" === urlParts[0])
                {
                    //  プロトコルだけ利用
                    baseParts = baseParts.slice(0, 1);
                }
                else
                {
                    //  サーバー名まで利用
                    baseParts = baseParts.slice(0, 3);
                }
            }
            else
            {
                while(true)
                {
                    if ("." === urlParts[0])
                    {
                        urlParts = urlParts.slice(1);
                        continue;
                    }
                    if (".." === urlParts[0])
                    {
                        urlParts = urlParts.slice(1);
                        if (4 <= baseParts.length)
                        {
                            baseParts = baseParts.slice(0, -1);
                        }
                        continue;
                    }
                    break;
                }
            }
        }
        return baseParts.concat(urlParts).join("/");
    };
    const evil =
    {
        unresolved : [ ] as unknown [ ],
        modules : { } as { [name:string]: unknown },
        mapping : { } as { [name:string]: string },
        module : <Module>
        {
            registerMapping: (path: string, mapping: string[]): void => mapping.forEach(i => evil.mapping[i] = path),
            load: async (path: string, mapping?: string[]): Promise<any> =>
            {
                if (/\.json(\?.*)?$/i.test(path))
                {
                    if (mapping)
                    {
                        evil.module.registerMapping(path, mapping);
                    }
                    const absolutePath = makeAbsoluteUrl(path);
                    if (config.log.load)
                    {
                        console.log(`evil-commonjs: load("${absolutePath}", ${JSON.stringify(mapping)})`);
                    }
                    const result = evil.modules[absolutePath] = await loadJsonRaw(absolutePath);
                    window.module.pauseCapture();
                    return result;
                }
                else
                {
                    const absolutePath = makeAbsoluteUrl(path);
                    try
                    {
                        pathStack.push(absolutePath);
                        window.module.readyToCapture(absolutePath);
                        if (config.log.load)
                        {
                            console.log(`evil-commonjs: load("${absolutePath}", ${JSON.stringify(mapping)})`);
                        }
                        await loadScript(absolutePath);
                    }
                    finally
                    {
                        pathStack.pop();
                    }
                    const result = evil.module.capture(path, mapping);
                    return result;
                }
            },
            sequentialLoad: async (map: [{ path: string, mapping?: string[] }]): Promise<any[]> =>
            {
                const result = [];
                for(const i in map)
                {
                    result.push(await evil.module.load(map[i].path, map[i].mapping));
                }
                return result;
            },
            capture: (path: string, mapping?: string[]): any =>
            {
                if (mapping)
                {
                    evil.module.registerMapping(path, mapping);
                }
                const absolutePath = makeAbsoluteUrl(path);
                window.module.exports.default = window.module.exports.default || window.module.exports;
                const result = evil.modules[absolutePath] = window.module.exports;
                window.module.pauseCapture();
                evil.unresolved = evil.unresolved.filter(i => i !== absolutePath);
                return result;
            },
            readyToCapture: (path?: string) =>
            {
                if (config.log.readyToCapture)
                {
                    console.log(`readyToCapture("${path}")`);
                }
                window.module.exports = window.exports = { };
                if (path)
                {
                    const absolutePath = makeAbsoluteUrl(path);
                    if (evil.modules[absolutePath])
                    {
                        window.module.exports = window.exports = evil.modules[absolutePath];
                    }
                }
            },
            pauseCapture: () => window.exports = undefined,
            exports: { },
        },
    };
    const resolveMapping = (path: string): string =>
    {
        return evil.mapping[path];
    };
    //const gThis = globalThis;
    const gThis = (self ?? window ?? global) as unknown as
    {
        require: (path: string) => any;
        define: (path: string, requires: string[], content: any) => unknown;
    };
    try
    {
        evilCommonjsConfig;
    }
    catch
    {
        (evilCommonjsConfig as any) = undefined;
    }
    const config =
    {
        log:
        {
            config: true === evilCommonjsConfig?.log?.config,
            load: false !== evilCommonjsConfig?.log?.load,
            define: false !== evilCommonjsConfig?.log?.define,
            readyToCapture: false !== evilCommonjsConfig?.log?.readyToCapture,
            results: true === evilCommonjsConfig?.log?.results,
        },
        loadingTimeout: "number" === typeof evilCommonjsConfig?.loadingTimeout ? evilCommonjsConfig.loadingTimeout: 1500,
    };
    try
    {
        const urlConfig = location.href
            .split("#")[0]
            .split("?")[1]
            ?.split("&")
            ?.filter(i => i.startsWith("evil-commonjs="))
            ?.map(i => JSON.parse(decodeURIComponent(i.substring("evil-commonjs=".length))))
            ?.[0];
        if (urlConfig)
        {
            if ("object" === typeof urlConfig)
            {
                if ("log" in urlConfig)
                {
                    if ("object" === typeof urlConfig["log"])
                    {
                        const urlConfigLog = urlConfig["log"];
                        if ("config" in urlConfigLog && "boolean" === typeof urlConfigLog["config"])
                        {
                            config.log.config = urlConfigLog["config"];
                        }
                        if ("load" in urlConfigLog && "boolean" === typeof urlConfigLog["load"])
                        {
                            config.log.load = urlConfigLog["load"];
                        }
                        if ("define" in urlConfigLog && "boolean" === typeof urlConfigLog["define"])
                        {
                            config.log.define = urlConfigLog["define"];
                        }
                        if ("results" in urlConfigLog && "boolean" === typeof urlConfigLog["results"])
                        {
                            config.log.results = urlConfigLog["results"];
                        }
                    }
                }
                if ("loadingTimeout" in urlConfig && "number" === typeof urlConfig["loadingTimeout"])
                {
                    config.loadingTimeout = urlConfig["loadingTimeout"];
                }
            }
        }
    }
    catch(err)
    {
        console.error(err);
    }
    if (config.log.config)
    {
        console.log(`evil-commonjs: evilCommonjsConfig: ${JSON.stringify(config)}`);
    }
    gThis.require = (path: string): any =>
    {
        switch(path)
        {
        case "require":
            return window.require;
        case "exports":
            return evil.module.exports;
        default:
            const absolutePath = makeAbsoluteUrl(path);
            let result = evil.modules[absolutePath] ?? evil.modules[path];
            if (!result)
            {
console.log(`evil-commonjs: require("${path}") -> "${absolutePath}"`, getCurrentPath(), resolveMapping(path));
                result = evil.modules[absolutePath] = { };
                evil.unresolved.push(absolutePath);
            }
            return result;
        }
    };
    gThis.define = (path: string, requires: string[], content: any) =>
    {
        const absolutePath = makeAbsoluteUrl(path);
        if (evil.modules[absolutePath])
        {
            if (config.log.define)
            {
                console.log(`evil-commonjs: "${absolutePath}" is already defined!`);
            }
        }
        else
        {
            if (config.log.define)
            {
                console.log(`evil-commonjs: define("${absolutePath}", ${JSON.stringify(requires)}, ...)`);
            }
            if (/\.json(\?.*)?$/i.test(path) || "function" !== typeof content)
            {
                return evil.modules[absolutePath] = content;
            }
            else
            {
                evil.module.readyToCapture(absolutePath);
                content.apply(null, requires.map(i => gThis.require(i)));
                evil.module.capture(absolutePath);
            }
        }
    };
    setTimeout
    (
        () =>
        {
            if (0 < evil.unresolved.length)
            {
                console.error(`evil-commonjs: unresoled modules: ${JSON.stringify(evil.unresolved)}`);
                // console.error(`"${path}" is not found! require() of evil-commonjs need to load() in advance.`);
                console.error(`evil-commonjs: module mapping: ${JSON.stringify(evil.mapping)}`);
                console.error(`evil-commonjs: loaded modules: ${JSON.stringify(Object.keys(evil.modules))}`);
                console.error(evil.modules);
            }
            else
            {
                if (config.log.results)
                {
                    console.log("evil-commonjs: everything is OK!");
                    console.log(`evil-commonjs: module mapping: ${JSON.stringify(evil.mapping)}`);
                    console.log(`evil-commonjs: loaded modules: ${JSON.stringify(Object.keys(evil.modules))}`);
                    console.log(evil.modules);
                }
            }
        },
        config.loadingTimeout
    );
    window.module = evil.module;
}
)();
