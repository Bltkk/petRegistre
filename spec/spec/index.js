// Carga *todas* las specs .spec.js dentro de /spec recursivamente
const ctx = require.context('.', true, /\.spec\.js$/);
ctx.keys().forEach(ctx);
