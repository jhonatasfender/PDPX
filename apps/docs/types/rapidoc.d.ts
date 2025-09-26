import type React from "react";

declare module "rapidoc";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "rapi-doc": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "spec-url"?: string;
        "render-style"?: string;
        theme?: string;
        "show-header"?: boolean | string;
        "sort-endpoints-by"?: string;
        "allow-spec-url-load"?: boolean | string;
        "allow-search"?: boolean | string;
        "regular-font"?: string;
        "mono-font"?: string;
      };
    }
  }
}

export {};
