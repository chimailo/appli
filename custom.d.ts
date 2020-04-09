// Declare image modules
declare module '*.(ico|gif|png|jpg|jpeg|webp|svg)' {
  const content: string;
  export default content;
}

declare module '*.(scss|css)' {
  const content: string;
  export default content;
}
