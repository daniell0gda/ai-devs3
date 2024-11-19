await Bun.build({
    entrypoints: ['./app.ts'],
    sourcemap: "inline",
    outdir: './public',
});