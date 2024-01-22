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
    { path:"aaa/bbb/index.js", mapping:["bbb"] },  // aaa depends on bbb.
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
module.readyToCapture();
</script>

<script src="aaa/bbb/index.js"></script>
<script>
module.capture("aaa/bbb/index.js", ["bbb"]); // aaa depends on bbb.
module.readyToCapture();
</script>

<script src="aaa/index.js"></script>
<script>
module.capture("aaa/index.js", ["aaa"]);
</script>
```

You can now use `require("aaa")` !

Specify a relative path from `location.href` or a absolute path for first parameter of `module.capture()`.　( In this case, the specified path is used only for identify. )

```html
<script src="https://wraith13.github.io/evil-commonjs/index.js"></script>
<script>
module.readyToCapture();
</script>

<script src="aaa/bbb/index.js"></script>
<script>
module.capture("aaa/bbb/index.js", ["bbb"]); // aaa depends on bbb.
module.readyToCapture();
</script>

<script src="aaa/index.js"></script>
<script>
var aaa = module.capture("aaa/index.js"); // 👈
</script>
```

Like this, you can also get directly from `window.module.capture()` without using `require`.

```html
<script src="https://wraith13.github.io/evil-commonjs/index.js"></script>
<script>
window.module.sequentialLoad
([
    { path:"aaa/bbb/index.js", mapping:["bbb"] },  // aaa depends on bbb.
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

## How to build

requires: [Node.js](https://nodejs.org/), [TypeScript Compiler](https://www.npmjs.com/package/typescript)

`tsc -P .` or `tsc -P . -w`

### In VS Code

You can use automatic build. Run `Tasks: Allow Automatic Tasks in Folder` command from command palette ( Mac: <kbd>F1</kbd> or <kbd>Shift</kbd>+<kbd>Command</kbd>+<kbd>P</kbd>, Windows and Linux: <kbd>F1</kbd> or <kbd>Shift</kbd>+<kbd>Ctrl</kbd>+<kbd>P</kbd>), and restart VS Code.

## License

[Boost Software License](LICENSE_1_0.txt)

## Related projects

- [evil-tsconfig.paths.ts](https://github.com/wraith13/evil-tsconfig.paths.ts)
