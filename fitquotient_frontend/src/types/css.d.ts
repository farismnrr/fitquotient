// Provide type declarations for CSS imports used as side-effects in Next.js
// This lets TypeScript accept "import './globals.css'" without errors.
declare module "*.css";
declare module "*.scss";
declare module "*.sass";

// If you use CSS modules with *.module.css, add a typed mapping:
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Optionally declare common asset imports used in JSX/TSX
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
