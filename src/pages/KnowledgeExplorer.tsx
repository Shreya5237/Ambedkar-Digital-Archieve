import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionLineType,
} from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { getGraph } from "@/services/api";
import type { GraphNode } from "@/types/archive";
import { Network, X, FileText, Users, Calendar, Tag, MapPin, BookOpen, ArrowRight, ShieldCheck } from "lucide-react";

const ENTITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  PERSON: { bg: "#c8621a20", border: "#c8621a", text: "#c8621a" },
  DOCUMENT: { bg: "#1b4f7220", border: "#1b4f72", text: "#1b4f72" },
  EVENT: { bg: "#2d6a4f20", border: "#2d6a4f", text: "#2d6a4f" },
  TOPIC: { bg: "#7d3c9820", border: "#7d3c98", text: "#7d3c98" },
  PLACE: { bg: "#c0392b20", border: "#c0392b", text: "#c0392b" },
  PUBLICATION: { bg: "#6b422620", border: "#6b4226", text: "#6b4226" },
  SOURCE: { bg: "#0284c720", border: "#0284c7", text: "#0284c7" },
};

const ENTITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PERSON: Users,
  DOCUMENT: FileText,
  EVENT: Calendar,
  TOPIC: Tag,
  PLACE: MapPin,
  PUBLICATION: BookOpen,
  SOURCE: ShieldCheck,
};

function toFlowNodes(nodes: GraphNode[]): Node[] {
  // Cluster layout by entity type for clarity
  const typeOffsets: Record<string, { x: number; y: number; colWidth: number }> = {
    TOPIC: { x: 50, y: 40, colWidth: 200 },
    PERSON: { x: 50, y: 320, colWidth: 220 },
    EVENT: { x: 520, y: 60, colWidth: 240 },
    DOCUMENT: { x: 1040, y: 80, colWidth: 230 },
    PLACE: { x: 1040, y: 520, colWidth: 220 },
    PUBLICATION: { x: 50, y: 650, colWidth: 200 },
    SOURCE: { x: 520, y: 700, colWidth: 220 },
  };

  const typeCounters: Record<string, number> = {};

  return nodes.map((n) => {
    const type = n.type;
    const count = typeCounters[type] || 0;
    typeCounters[type] = count + 1;

    const offset = typeOffsets[type] || { x: 50, y: 50, colWidth: 200 };
    const cols = type === "EVENT" ? 2 : 2;
    const col = count % cols;
    const row = Math.floor(count / cols);

    const x = offset.x + col * offset.colWidth;
    const y = offset.y + row * 110;

    return {
      id: n.id,
      type: "default",
      position: { x, y },
      data: { label: n.label, entity: n },
      style: {
        background: ENTITY_COLORS[n.type]?.bg ?? "#f0f0f0",
        border: `1.5px solid ${ENTITY_COLORS[n.type]?.border ?? "#999"}`,
        borderRadius: "6px",
        padding: "8px 12px",
        fontSize: "11px",
        fontFamily: "'Source Sans 3', sans-serif",
        fontWeight: 600,
        color: "var(--foreground, #1a1410)",
        maxWidth: 190,
        textAlign: "center" as const,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      },
    };
  });
}

function toFlowEdges(edges: { id: string; source: string; target: string; relation: string }[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.relation,
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
    style: { stroke: "#c8b89a", strokeWidth: 1.5 },
    labelStyle: { fontSize: 10, fill: "#6b5c48", fontFamily: "monospace" },
    labelBgStyle: { fill: "#fbf8f3", fillOpacity: 0.95 },
  }));
}

export default function KnowledgeExplorer() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  const { data: graphData } = useQuery({
    queryKey: ["graph"],
    queryFn: () => getGraph(),
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync graph data once loaded
  useEffect(() => {
    if (graphData) {
      setNodes(toFlowNodes(graphData.nodes));
      setEdges(toFlowEdges(graphData.edges));
    }
  }, [graphData, setNodes, setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data.entity as GraphNode);
  }, []);

  const TYPES = ["ALL", "PERSON", "EVENT", "DOCUMENT", "TOPIC", "PLACE"];

  const visibleNodes = filter === "ALL" ? nodes : nodes.filter((n) => n.data.entity.type === filter);
  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = edges.filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));

  const entityToRoute = (node: GraphNode): string => {
    const map: Record<string, string> = {
      PERSON: `/people/${node.id}`,
      DOCUMENT: `/documents/${node.id}`,
      EVENT: `/events/${node.id}`,
    };
    return map[node.type] ?? "#";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-5 h-5 text-[var(--primary)]" />
          <h1 className="font-display text-3xl font-bold">Historical Knowledge Graph</h1>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          Traverse multi-relational connections linking Dr. Ambedkar's historical events, documents, people, and locations.
        </p>
      </div>

      {/* Legend + filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {TYPES.map((type) => {
          const colors = ENTITY_COLORS[type] ?? { bg: "#f0f0f0", border: "#999", text: "#666" };
          const Icon = ENTITY_ICONS[type];
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded border transition-all cursor-pointer ${
                filter === type ? "font-bold shadow-xs" : "opacity-70 hover:opacity-100"
              }`}
              style={
                filter === type
                  ? { borderColor: colors.border, backgroundColor: colors.bg, color: colors.text }
                  : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
              }
            >
              {Icon && <Icon className="w-3 h-3" />}
              {type === "ALL" ? "All Entities" : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* Graph Area */}
      <div className="relative border border-[var(--border)] rounded-md overflow-hidden bg-[var(--background)] shadow-xs" style={{ height: 620 }}>
        {graphData ? (
          <ReactFlow
            nodes={visibleNodes}
            edges={visibleEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
          >
            <Background color="#c8b89a" gap={20} size={1} />
            <Controls className="bg-[var(--card)] border border-[var(--border)]" />
            <MiniMap
              nodeColor={(n) => ENTITY_COLORS[n.data?.entity?.type]?.border ?? "#ccc"}
              className="bg-[var(--card)] border border-[var(--border)] rounded"
            />
          </ReactFlow>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-[var(--muted-foreground)]">
            Loading Knowledge Graph…
          </div>
        )}

        {/* Selected node sidebar */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 bg-[var(--card)] border border-[var(--border)] rounded-md shadow-xl p-5 z-20 space-y-4 animate-modal-in">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="text-[10px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: ENTITY_COLORS[selectedNode.type]?.bg,
                    color: ENTITY_COLORS[selectedNode.type]?.text,
                  }}
                >
                  {selectedNode.type}
                </span>
                <h3 className="font-display font-bold text-lg leading-snug mt-1.5">
                  {selectedNode.label}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedNode.year && (
              <p className="font-mono text-xs text-[var(--muted-foreground)]">
                Historical Year: {selectedNode.year}
              </p>
            )}

            {selectedNode.description && (
              <p className="text-xs text-[var(--foreground)] leading-relaxed">
                {selectedNode.description}
              </p>
            )}

            {/* Entity route action */}
            {entityToRoute(selectedNode) !== "#" && (
              <div className="pt-3 border-t border-[var(--border)]">
                <Link
                  to={entityToRoute(selectedNode)}
                  className="w-full text-xs font-mono font-bold bg-[var(--primary)] text-[var(--primary-foreground)] py-2 px-3 rounded flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <span>Open Full Archival Record</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
