declare module '*.css';
declare module '*.scss';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg' {
  const content: any;
  export default content;
}

// Allow importing data URLs and other static assets without type errors
declare module '*?url' {
  const url: string;
  export default url;
}

export {};
