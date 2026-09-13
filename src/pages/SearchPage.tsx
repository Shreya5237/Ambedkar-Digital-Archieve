/**
 * SearchPage — redirects to Knowledge Garden.
 *
 * The Search Page has been replaced by the Knowledge Garden (/garden).
 * This component exists only to honour any remaining internal references
 * or browser bookmarks; the actual redirect is handled at the routing level
 * in App.tsx via <Navigate to="/garden" replace />.
 *
 * @deprecated Use KnowledgeGardenPage instead.
 */
import { Navigate } from "react-router-dom";

export default function SearchPage() {
  return <Navigate to="/garden" replace />;
}
