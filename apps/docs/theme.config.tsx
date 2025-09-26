import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { RxGlobe } from "react-icons/rx";

export default {
  logo: <span>PDPX Docs</span>,
  project: {
    link: "https://github.com/jhonatasfender/PDPX",
  },
  docsRepositoryBase:
    "https://github.com/jhonatasfender/PDPX/tree/main/apps/docs",
  footer: {
    text: (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span>PDPX Documentation</span>
        <span style={{ marginLeft: "auto", display: "flex", gap: "12px" }}>
          <a
            href="https://www.linkedin.com/in/jhonatasfender/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://jhonatasfender.github.io/"
            target="_blank"
            rel="noreferrer"
            aria-label="Website"
            title="Website"
          >
            <RxGlobe size={20} />
          </a>
          <a
            href="https://github.com/jhonatasfender"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <FaGithub size={20} />
          </a>
        </span>
      </div>
    ),
  },
} as const;
