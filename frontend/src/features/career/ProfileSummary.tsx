import { getProgress, getTracks } from "./progress";
import type { CareerDocument } from "./types";

export function ProfileSummary({ document }: { document: CareerDocument }) {
  const progress = getProgress(document);
  return (
    <section className="profile-bar" aria-label="Общий прогресс">
      <div className="profile-info">
        <span className="profile-avatar">{document.profile.name.slice(0, 1).toUpperCase()}</span>
        <div>
          <h2>{document.profile.name}</h2>
          <p>{document.profile.role}</p>
        </div>
      </div>
      <div className="stat">
        <span>Достигнуто этапов</span>
        <strong>
          {progress.completed}
          <small> / {progress.total}</small>
        </strong>
      </div>
      <div className="stat">
        <span>Треков в развитии</span>
        <strong>
          {progress.started}
          <small> / {getTracks(document).length}</small>
        </strong>
      </div>
      <div className="stat overall-stat">
        <span>Освоено схемы</span>
        <strong>
          {progress.percent}
          <small>%</small>
        </strong>
        <progress
          className="overall-progress"
          aria-label="Освоено схемы"
          value={progress.percent}
          max={100}
        />
      </div>
    </section>
  );
}
