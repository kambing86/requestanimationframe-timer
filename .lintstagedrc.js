module.exports = {
  "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
    "prettier --write",
    () => "yarn lint",
    "git add",
  ],
};
