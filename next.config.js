module.exports = {
webpack: (config, { isServer }) => {
// Exclude certain modules from the client-side bundle.
// This is crucial for libraries like Playwright that are server-only.
if (!isServer) {
config.externals.push('@sparticuz/chromium', 'playwright-core');
}
return config;
},
};
