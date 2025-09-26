"use client";

import { useEffect } from "react";

type RapiDocViewerProps = {
  specUrl: string;
};

export function RapiDocViewer({ specUrl }: RapiDocViewerProps) {
  useEffect(() => {
    // Load web component on client only
    import("rapidoc");
  }, []);

  return (
    // @ts-expect-error - custom element provided by rapidoc
    <rapi-doc
      spec-url={specUrl}
      render-style="read"
      theme="dark"
      show-header="false"
      sort-endpoints-by="path"
      allow-spec-url-load="true"
      allow-search="true"
      regular-font="Inter, ui-sans-serif, system-ui"
      mono-font="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
      style={{ height: "100vh", width: "100vw" }}
    />
  );
}
