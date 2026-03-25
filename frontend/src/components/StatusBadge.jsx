import { formatEnumLabel } from "../lib/utils";

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${String(status).toLowerCase()}`}>
      {formatEnumLabel(status)}
    </span>
  );
}
