import Elysia from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { html, render } from "@lit-labs/ssr";
import type { BuildOutput } from "bun";

const build = await Bun.build({
  entrypoints: ["./app/app-root.ts", "./app/styles/app.css"],
  format: "esm",
  target: "browser",
  publicPath: "/",
  naming: {
    asset: "[dir]/[name].[ext]",
    chunk: "[dir]/[name].[ext]",
  },
  root: "app",
});

const buildManifest = (manifest: { build: BuildOutput }) => {
  return (app: Elysia) => {
    for (const output of manifest.build.outputs) {
      const { hash, path, type } = output;
      app.get(path.slice(1), ({ set }) => {
        set.headers["Content-Type"] = type;
        set.headers["ETag"] = hash ?? "";
        return output.stream();
      });
    }
    return app;
  };
};

new Elysia()
  .use(
    staticPlugin({
      assets: ".",
      alwaysStatic: false,
      noCache: true,
    })
  )
  .use(buildManifest({ build }))
  .get("/", async (ctx) => {
    ctx.set.headers["Content-Type"] = "text/html";
    return render(
      html`<html>
        <script type="module" src="app-root.js"></script>
        <link rel="stylesheet" href="styles/app.css" />
        <body>
          <app-root>
            <h1>Hello World</h1>
          </app-root>
        </body>
      </html>`
    );
  })
  .listen(3000, ({ url }) => {
    console.log(`Server is running on ${url}`);
  });
