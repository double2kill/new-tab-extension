/// <reference types="vite/client" />

declare global {
  const __MANIFEST_VERSION__: string
  const __BUILD_TIME__: string
}

export {}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
