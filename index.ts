//  fxxking commonjs
declare const global: any;
interface Module
{
    registerMapping: (path : string, mapping : string[]) => void;
    load: (path : string, mapping ? : string[]) => Promise<any>;
    capture: (path : string, mapping ? : string[]) => any;
    readyToCapture: () => void;
    pauseCapture: () => void;
    exports: any;
}
interface Window
{
    require: (path : string) => any;
    module: Module;
    exports: any;
}
(() =>
{
    const loadScript = async (src : string) : Promise<void> => new Promise<void>
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
    const loadJsonRaw = async (src : string) : Promise<void> => new Promise<void>
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
    const makeAbsoluteUrl = function(base : string, url : string) : string
    {
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
        modules : { },
        mapping : { },
        module : <Module>
        {
            registerMapping: (path : string, mapping : string[]) : void => mapping.forEach(i => evil.mapping[i] = path),
            load: async (path : string, mapping ? : string[]) : Promise<any> =>
            {
                if (/\.json(\?.*)?$/i.test(path))
                {
                    if (mapping)
                    {
                        evil.module.registerMapping(path, mapping);
                    }
                    const absolutePath = makeAbsoluteUrl(location.href, resolveMapping(path));
                    console.log(`load("${absolutePath}", ${JSON.stringify(mapping)})`);
                    const result = evil.modules[absolutePath] = await loadJsonRaw(absolutePath);
                    window.module.pauseCapture();
                    return result;
                }
                else
                {
                    const absolutePath = makeAbsoluteUrl(location.href, resolveMapping(path));
                    window.module.readyToCapture();
                    console.log(`load("${absolutePath}", ${JSON.stringify(mapping)})`);
                    await loadScript(absolutePath);
                    const result = evil.module.capture(path, mapping);
                    return result;
                }
            },
            sequentialLoad: async (map: [{ path : string, mapping ? : string[] }]) : Promise<any[]> =>
            {
                const result = [];
                for(const i in map)
                {
                    result.push(await evil.module.load(map[i].path, map[i].mapping));
                }
                return result;
            },
            capture: (path : string, mapping ? : string[]) : any =>
            {
                if (mapping)
                {
                    evil.module.registerMapping(path, mapping);
                }
                const absolutePath = makeAbsoluteUrl(location.href, resolveMapping(path));
                window.module.exports.default = window.module.exports.default || window.module.exports;
                const result = evil.modules[absolutePath] = window.module.exports;
                window.module.pauseCapture();
                return result;
            },
            readyToCapture: () => window.module.exports = window.exports = { },
            pauseCapture: () => window.exports = undefined,
            exports: { },
        },
    };
    const resolveMapping = (path : string) : string =>
    {
        return evil.mapping[path] || path;
    };
    const gThis = globalThis ?? self ?? window ?? global;
    gThis.require = (path : string) :any =>
    {
        switch(path)
        {
        case "require":
            return window.require;
        case "exports":
            return evil.module.exports;
        default:
            const absolutePath = makeAbsoluteUrl(location.href, resolveMapping(path));
            let result = evil.modules[absolutePath] ?? evil.modules[path];
            if (!result)
            {
                console.error(evil.modules);
                console.error(`"${path}" is not found! require() of evil-commonjs need to load() in advance.`);
                console.error(`loaded modules: "${JSON.stringify(Object.keys(evil.modules))}"`);
                console.error(`module mapping: "${JSON.stringify(evil.mapping)}"`);
            }
            return result;
        }
    };
    gThis.define = (path : string, requires: string[], content: any) =>
    {
        if (/\.json(\?.*)?$/i.test(path) || "function" !== typeof content)
        {
            return evil.modules[path] = content;
        }
        else
        {
            evil.module.readyToCapture();
            content.apply(null, requires.map(i => globalThis.require(i)));
            evil.module.capture(path);
        }
    };
    window.module = evil.module;
}
)();
