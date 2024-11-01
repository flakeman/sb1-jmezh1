export interface Document {
  id: string;
  name: string;
  levels: string[];
  uploadDate: string;
}

export interface GraphNode {
  id: string;
  label: string;
  level: number;
}

export interface GraphLink {
  source: string;
  target: string;
}