export const on = <K extends keyof DocumentEventMap>(
  name: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
) => {
  document.addEventListener(name, listener, options);
};

export const off = <K extends keyof DocumentEventMap>(
  name: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: boolean | EventListenerOptions
) => {
  document.removeEventListener(name, listener, options);
};
