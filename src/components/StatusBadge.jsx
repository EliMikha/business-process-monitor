import { statusDefinitions } from '../data/statuses.js';

export default function StatusBadge({ status }) {
  const definition = statusDefinitions[status];
  return (
    <span className={`status status--${definition.className}`}>
      <img className="status-dot" src={`${import.meta.env.BASE_URL}assets/${definition.asset}`} width="5" height="5" alt="" />
      {definition.label}
    </span>
  );
}
