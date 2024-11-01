import { Document, GraphNode, GraphLink } from '../types';

export function buildGraphData(documents: Document[]) {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const levelMap = new Map<string, string[]>();

  // Group nodes by level content
  documents.forEach(doc => {
    doc.levels.forEach((content, level) => {
      const existing = levelMap.get(content) || [];
      levelMap.set(content, [...existing, `${doc.id}-${level + 1}`]);
    });
  });

  // Create nodes
  documents.forEach(doc => {
    doc.levels.forEach((content, index) => {
      const nodeId = `${doc.id}-${index + 1}`;
      nodes.push({
        id: nodeId,
        label: `${doc.name.slice(0, 3)}:L${index + 1}`,
        level: index + 1
      });
    });
  });

  // Create links based on content similarity
  levelMap.forEach((nodeIds, content) => {
    // Connect nodes with same content
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        links.push({
          source: nodeIds[i],
          target: nodeIds[j]
        });
      }
    }
  });

  // Add hierarchical links within documents
  documents.forEach(doc => {
    for (let i = 0; i < doc.levels.length - 1; i++) {
      links.push({
        source: `${doc.id}-${i + 1}`,
        target: `${doc.id}-${i + 2}`
      });
    }
  });

  return { nodes, links };
}