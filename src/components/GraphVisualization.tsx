import React, { useEffect, useRef } from 'react';
import { GraphNode, GraphLink } from '../types';

interface GraphVisualizationProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function GraphVisualization({ nodes, links }: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = svgRef.current;
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    const levelHeight = height / 6;
    
    // Position nodes
    const nodeElements = nodes.map(node => {
      const nodesAtLevel = nodes.filter(n => n.level === node.level).length;
      const nodeIndex = nodes.filter(n => n.level === node.level)
        .findIndex(n => n.id === node.id);
      
      const x = (width / (nodesAtLevel + 1)) * (nodeIndex + 1);
      const y = levelHeight * node.level;

      return `
        <g transform="translate(${x},${y})" class="node">
          <circle r="20" fill="#3B82F6" />
          <text dy=".35em" text-anchor="middle" fill="white" font-size="12">
            ${node.label}
          </text>
        </g>
      `;
    }).join('');

    // Create links
    const linkElements = links.map(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      if (!source || !target) return '';

      const sourceX = (width / (nodes.filter(n => n.level === source.level).length + 1)) * 
        (nodes.filter(n => n.level === source.level)
          .findIndex(n => n.id === source.id) + 1);
      const sourceY = levelHeight * source.level;

      const targetX = (width / (nodes.filter(n => n.level === target.level).length + 1)) * 
        (nodes.filter(n => n.level === target.level)
          .findIndex(n => n.id === target.id) + 1);
      const targetY = levelHeight * target.level;

      return `
        <path 
          d="M ${sourceX},${sourceY} C ${sourceX},${(sourceY + targetY) / 2} ${targetX},${(sourceY + targetY) / 2} ${targetX},${targetY}"
          stroke="#94A3B8"
          stroke-width="2"
          fill="none"
        />
      `;
    }).join('');

    svg.innerHTML = linkElements + nodeElements;
  }, [nodes, links]);

  return (
    <div className="w-full h-[600px] bg-white rounded-lg shadow p-4">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}