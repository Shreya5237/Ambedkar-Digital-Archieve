import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  ConnectionLineType,
} from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { getGraph } from "@/services/api";
import type { GraphNode } from "@/types/archive";
import { Network, X, FileText, Users, Calendar, Tag, MapPin, BookOpen } from "lucide-react";

const ENTITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  PERSON: { bg: "#c8621a20", border: "#c8621a", text: "#c8621a" },
  DOCUMENT: { bg: "#1b4f7220", border: "#1b4f72", text: "#1b4f72" },
  EVENT: { bg: "#2d6a4f20", border: "#2d6a4f", text: "#2d6a4f" },
  TOPIC: { bg: "#7d3c9820", border: "#7d3c98", text: "#7d3c98" },
  PLACE: { bg: "#c0392b20", border: "#c0392b", text: "#c0392b" },
  PUBLICATION: { bg: "#6b422620", border: "#6b4226", text: "#6b4226" },
};

const ENTITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PERSON: Users,
  DOCUMENT: FileText,
  EVENT: Calendar,
  TOPIC: Tag,
  PLACE: MapPin,
  PUBLICATION: BookOpen,
};

function toFlowNodes(nodes: GraphNode[]): Node[] {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  return nodes.map((n, i) => ({
    id: n.id,
    type: "default",
    position: {
      x: (i % cols) * 220 + 50,
      y: Math.floor(i / cols) * 140 + 50,
    },
    data: { label: n.label, entity: n },
    style: {
      background: ENTITY_COLORS[n.type]?.bg ?? "#f0f0f0",
      border: `1.5px solid ${ENTITY_COLORS[n.type]?.border ?? "#999"}`,
      borderRadius: "4px",
      padding: "8px 12px",
      fontSize: "11px",
      fontFamily: "'Source Sans 3', sans-serif",
      fontWeight: 500,
      color: "#1a1410",
      maxWidth: 160,
      textAlign: "center" as const,
    },
  }));
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
    labelStyle: { fontSize: 10, fill: "#6b5c48", fontFamily: "JetBrains Mono, monospace" },
    labelBgStyle: { fill: "#f5f0e8", fillOpacity: 0.9 },
  }));
}

export default function KnowledgeExplorer() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  const { data: graphData } = useQuery({
    queryKey: ["graph"],
    queryFn: () => getGraph(),
  });

  const initialNodes = graphData ? toFlowNodes(graphData.nodes) : [];
  const initialEdges = graphData ? toFlowEdges(graphData.edges) : [];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data.entity as GraphNode);
  }, []);

  const TYPES = ["ALL", "PERSON", "DOCUMENT", "EVENT", "TOPIC", "PLACE"];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-5 h-5 text-[var(--primary)]" />
          <h1 className="font-display text-3xl font-semibold">Knowledge Explorer</h1>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          Navigate the network of people, documents, events, topics, and places in the archive
        </p>
      </div>

      {/* Legend + filter */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {TYPES.map((type) => {
          const colors = ENTITY_COLORS[type] ?? { bg: "#f0f0f0", border: "#999", text: "#666" };
          const Icon = ENTITY_ICONS[type];
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                filter === type ? "font-medium" : "opacity-60 hover:opacity-100"
              }`}
              style={
                filter === type
                  ? { borderColor: colors.border, backgroundColor: colors.bg, color: colors.text }
                  : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
              }
            >
              {Icon && <Icon className="w-3 h-3" />}
              {type === "ALL" ? "All entities" : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* Graph */}
      <div
        className="border border-[var(--border)] rounded-sm overflow-hidden"
        style={{ height: 580 }}
      >
        {graphData ? (
          <ReactFlow
            nodes={visibleNodes}
            edges={visibleEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            style={{ backgroundColor: "var(--muted)" }}
          >
            <Background color="var(--border)" gap={24} />
            <Controls className="!bg-[var(--card)] !border-[var(--border)]" />
            <MiniMap
              nodeColor={(n) => ENTITY_COLORS[n.data?.entity?.type]?.border ?? "#999"}
              className="!bg-[var(--card)] !border-[var(--border)]"
            />
          </ReactFlow>
        ) : (
          <div className="h-full flex items-center justify-center text-[var(--muted-foreground)]">
            <div className="text-center">
              <Network className="w-12 h-12 mx-auto mb-3 opacity-40 animate-pulse" />
              <p className="text-sm">Loading knowledge graph…</p>
            </div>
          </div>
        )}
      </div>

      {/* Selected node panel */}
      {selectedNode && (
        <div className="mt-4 p-5 border border-[var(--border)] rounded-sm bg-[var(--card)] relative">
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-3 right-3 p-1 hover:bg-[var(--muted)] rounded-sm transition-colors"
          >
            <X className="w-4 h-4 text-[var(--muted-foreground)]" />
          </button>
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: ENTITY_COLORS[selectedNode.type]?.bg,
                color: ENTITY_COLORS[selectedNode.type]?.text,
              }}
            >
              {(() => {
                const Icon = ENTITY_ICONS[selectedNode.type];
                return Icon ? <Icon className="w-5 h-5" /> : null;
              })()}
            </div>
            <div>
              <span
                className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm mb-2 inline-block"
                style={{
                  backgroundColor: ENTITY_COLORS[selectedNode.type]?.bg,
                  color: ENTITY_COLORS[selectedNode.type]?.text,
                }}
              >
                {selectedNode.type}
              </span>
              <h3 className="font-display text-lg font-semibold mb-1">{selectedNode.label}</h3>
              {selectedNode.description && (
                <p className="text-sm text-[var(--muted-foreground)]">{selectedNode.description}</p>
              )}
              {["PERSON", "DOCUMENT", "EVENT"].includes(selectedNode.type) && (
                <Link
                  to={entityToRoute(selectedNode)}
                  className="mt-3 inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
                >
                  View full record →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Entity type legend */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(ENTITY_COLORS).map(([type, colors]) => {
          const Icon = ENTITY_ICONS[type];
          return (
            <div key={type} className="p-3 border border-[var(--border)] rounded-sm flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-medium">{type.charAt(0) + type.slice(1).toLowerCase()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
