"use client"

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface NodeDatum {
  id: string;
  label: string;
  color: string;
  link_count: number;
  url?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface LinkDatum {
  source: string | NodeDatum;
  target: string | NodeDatum;
}

const centerForceStrength = 0.08;

const nodesData: NodeDatum[] = [
    { id: 'email', label: 'Email', color: '#ffcc00', link_count: 1 },
    { id: 'development', label: 'Development', color: '#ffcc00', link_count: 1 },
    { id: 'monitoring', label: 'Monitoring', color: '#ffcc00', link_count: 1 },
    { id: 'learning', label: 'Learning', color: '#ffcc00', link_count: 1 },
    { id: 'terminal', label: 'Terminal', color: '#ffcc00', link_count: 1 },
    { id: 'enterprise', label: 'Enterprise', color: '#ffcc00', link_count: 1 },
    { id: 'ai', label: 'AI', color: '#ffcc00', link_count: 1 },
    { id: 'torrent', label: 'Torrent', color: '#ffcc00', link_count: 1 },
    { id: 'books', label: 'Books', color: '#ffcc00', link_count: 1 },
    { id: 'darknet', label: 'PUB', color: '#ffcc00', link_count: 1 },

    { id: 'protonmail', label: 'ProtonMail', color: '#bb86fc', link_count: 1, url: 'https://proton.me' },
    { id: 'replit', label: 'Replit', color: '#00b4d8', link_count: 1, url: 'https://replit.com' },
    { id: 'vercel', label: 'Vercel', color: '#ffffff', link_count: 1, url: 'https://vercel.com' },
    { id: 'codepen', label: 'CodePen', color: '#000000', link_count: 1, url: 'https://codepen.io' },
    { id: 'anthropic', label: 'Anthropic', color: '#ff6600', link_count: 1, url: 'https://www.anthropic.com' },
    { id: 'railway', label: 'Railway', color: '#5a3fc0', link_count: 1, url: 'https://railway.app' },
    { id: 'github', label: 'GitHub', color: '#181717', link_count: 1, url: 'https://github.com' },
    { id: 'netdata', label: 'Netdata', color: '#00875f', link_count: 1, url: 'https://www.netdata.cloud' },
    { id: 'leetcode', label: 'LeetCode', color: '#f89f1b', link_count: 1, url: 'https://leetcode.com' },
    { id: 'warp', label: 'Warp', color: '#673ab7', link_count: 1, url: 'https://www.warp.dev' },
    { id: 'workos', label: 'WorkOS', color: '#ff3366', link_count: 1, url: 'https://workos.com' },
    { id: 'deadnet', label: 'DeadNet', color: '#990000', link_count: 1, url: 'https://deadnet.com' },
    { id: '1337x', label: '1337x', color: '#ff0000', link_count: 1, url: 'https://www.1337x.to' },
    { id: 'libgen', label: 'LibGen', color: '#009933', link_count: 1, url: 'https://libgen.is' },
  ];


  const linksData: LinkDatum[] = [
    { source: 'email', target: 'protonmail' },
    { source: 'development', target: 'replit' },
    { source: 'development', target: 'vercel' },
    { source: 'development', target: 'codepen' },
    { source: 'development', target: 'railway' },
    { source: 'development', target: 'github' },
    { source: 'monitoring', target: 'netdata' },
    { source: 'learning', target: 'leetcode' },
    { source: 'terminal', target: 'warp' },
    { source: 'enterprise', target: 'workos' },
    { source: 'ai', target: 'anthropic' },
    { source: 'ai', target: 'warp' },
    { source: 'torrent', target: '1337x' },
    { source: 'books', target: 'libgen' },
    { source: 'darknet', target: 'deadnet' },
  ];

const ObsidianGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const zoomG = svg.append("g");

    const simulation = d3
      .forceSimulation<NodeDatum>(nodesData)
      .force(
        "link",
        d3
          .forceLink<NodeDatum, LinkDatum>(linksData)
          .id((d) => d.id)
          .distance(60)
          .strength(0.8)
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("collision", d3.forceCollide().radius(35))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "attract",
        d3.forceRadial(
          Math.min(width, height) / 4,
          width / 2,
          height / 2
        ).strength(centerForceStrength)
      )
      .alphaMin(0.05)
      .alphaDecay(0.02)
      .on("tick", ticked);

    const link = zoomG
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(linksData)
      .enter()
      .append("line")
      .attr("class", "link");

    const node = zoomG
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodesData)
      .enter()
      .append("circle")
      .attr("class", "node")
      // Override color for all nodes:
      .attr("fill", (d) => d.color)
      .attr("r", 10)
      .call(
        d3
          .drag<SVGCircleElement, NodeDatum>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )
      // Click handler:
      .on("click", (event, d) => {
        // Avoid click if it was a drag
        if (!event.defaultPrevented && d.url) {
          window.open(d.url, "_blank");
        }
      });

    const text = zoomG
      .append("g")
      .attr("class", "texts")
      .selectAll("text")
      .data(nodesData)
      .enter()
      .append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text((d) => d.label)
      .style("pointer-events", "none");

    function ticked() {
      requestAnimationFrame(() => {
        link
          .attr("x1", (d) => (d.source as NodeDatum).x ?? 0)
          .attr("y1", (d) => (d.source as NodeDatum).y ?? 0)
          .attr("x2", (d) => (d.target as NodeDatum).x ?? 0)
          .attr("y2", (d) => (d.target as NodeDatum).y ?? 0);

        node
          .attr("cx", (d) => d.x ?? 0)
          .attr("cy", (d) => d.y ?? 0);

        text
          .attr("x", (d) => d.x ?? 0)
          .attr("y", (d) => (d.y ?? 0) - 12);
      });
    }

    function dragstarted(event: any, d: NodeDatum) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: NodeDatum) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: NodeDatum) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    svg
      .call(
        d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.5, 2.5])
          .on("zoom", (event) => {
            zoomG.attr("transform", event.transform);
          })
      )
      .on("dblclick.zoom", null);

    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
    };
  }, []);

  return (
    <>
      <style>{`
        /* Obsidian-Inspired Theme */
        body {
          margin: 0;
          padding: 0;
          color: #c9d1d9;
          background-color: #000; /* Make sure the background is black */
          overflow: hidden;
        }
        svg {
          width: 100vw;
          height: 100vh;
          display: block;
        }

        .node {
          cursor: grab;
          transition: r 0.2s ease-out, filter 0.2s ease-out;
        }

        .node:hover {
          r: 16px !important;
          filter: drop-shadow(0px 0px 12px rgba(255, 255, 255, 0.9));
        }

        .link {
          stroke: #7a828e;
          stroke-opacity: 0.7;
          stroke-width: 2px;
          transition: stroke 0.3s ease-out;
        }

        .highlighted {
          stroke: #ffdd44 !important;
          stroke-width: 3px !important;
        }

        text {
          font-size: 14px;
          font-weight: bold;
          pointer-events: none;
          fill: #c9d1d9;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
        }
      `}</style>

      <a
        href="/"
        className="absolute w-24 m-12 h-12 px-4 py-2 rounded-md bg-[#111827] text-[#4A90E2] hover:bg-[#1A1A1A] transition-all flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-arrow-left w-4 h-4 mr-2"
        >
          <path d="m12 19-7-7 7-7"></path>
          <path d="M19 12H5"></path>
        </svg>
        Back
      </a>

      <div id="graph" className="font-mono w-screen h-screen overflow-hidden">
        <svg ref={svgRef} />
      </div>
    </>
  );
};

export default ObsidianGraph;
