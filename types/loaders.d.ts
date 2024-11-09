declare module "*.css?url" {
  const value: string;
  export default value;
}

declare module "*.css" {
  const value: string;
  export default value;
}
