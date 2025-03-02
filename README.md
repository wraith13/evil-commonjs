# evil-commonjs

evil-commonjs is a simple commonjs implement.

## Usage by TypeScript

Copy [`index.ts`](index.ts) as `evil-commonjs/index.ts` or `evil-commonjs.ts` into your TypeScript project ( and change `tsconfig.json` if necessary ).

and

```typescript
await window.module.load("aaa/bbb/index.js", ["bbb"]); // aaa depends on bbb.
await window.module.load("aaa/index.js", ["aaa"]);
```

or

```typescript
await window.module.sequentialLoad
([
    { path:"aaa/bbb/index.js", mapping:["bbb"] }, // aaa depends on bbb.
    { path:"aaa/index.js", mapping:["aaa"] },
]);
```

You can now use `window.require("aaa")` and `import aaa from 'aaa'` !

Specify a relative path from `location.href` or a absolute path for first parameter of `window.module.load()`.

```typescript
await window.module.load("aaa/bbb/index.js", ["bbb"]); // aaa depends on bbb.
const aaa = await window.module.load("aaa/index.js");
```

Like this, you can also get directly from `window.module.load()` without using `require`.

## Usage by JavaScript

```html
<script src="https://wraith13.github.io/evil-commonjs/index.js"></script>
<script>
window.module.sequentialLoad
([
    { path:"aaa/bbb/index.js", mapping:["bbb"] }, // aaa depends on bbb.
    { path:"aaa/index.js", mapping:["aaa"] },
]).then
(
    map =>
    {
        var aaa = require("aaa/index.js");
        ...
    }
);
</script>
```

You can also use like this style.

## Console log settings

You can specify console output settings as follows.

```html
<script>
const evilCommonjsConfig =
{
    log:
    {
        config: false,
        load: true,
        define: true,
        readyToCapture: true,
        results: false,
    },
    loadingTimeout: 1500,
};
</script>
<script src="https://wraith13.github.io/evil-commonjs/index.js"></script>
```

All individual settings are optional.

### on URL

You can also specify console output settings on URL. Note that the arguments here must be valid as JSON.( 🚫 `...?evil-commonjs={loadingTimeout:1500,}` → ✅ `...?evil-commonjs={"loadingTimeout":1500}` )

```url
https://example.com/your-page-path?evil-commonjs={"log":{"config":false,"load":true,"define":true,"results":false},"loadingTimeout":1500}
```

## How to build

requires: [Node.js](https://nodejs.org/), [TypeScript Compiler](https://www.npmjs.com/package/typescript)

`tsc -P .` or `tsc -P . -w`

### In VS Code

You can use automatic build. Run `Tasks: Allow Automatic Tasks in Folder` command from command palette ( Mac: <kbd>F1</kbd> or <kbd>Shift</kbd>+<kbd>Command</kbd>+<kbd>P</kbd>, Windows and Linux: <kbd>F1</kbd> or <kbd>Shift</kbd>+<kbd>Ctrl</kbd>+<kbd>P</kbd>), and restart VS Code.

## License

[Boost Software License](LICENSE_1_0.txt)

## Related projects

- [evil-tsconfig.paths.ts](https://github.com/wraith13/evil-tsconfig.paths.ts)
