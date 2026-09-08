import { ArrowDownToLine, ArrowUpFromLine, CircleHelp } from "lucide-react";
import { Button } from "../../components/ui/button";
import { getSelection } from "./progress";
import { ProfileSummary } from "./ProfileSummary";
import { Snowflake } from "./Snowflake";
import { TrackList } from "./TrackList";
import { LevelDetails } from "./LevelDetails";
import type { CareerDocument, Selection } from "./types";

interface CareerDashboardProps {
  document: CareerDocument;
  busy: boolean;
  selection: Selection | null;
  onSelect: (selection: Selection) => void;
  onImport: () => void;
  onExport: () => void;
  onSave: (document: CareerDocument) => void;
}

export function CareerDashboard({
  document,
  busy,
  selection,
  onSelect,
  onImport,
  onExport,
  onSave,
}: CareerDashboardProps) {
  const selected = getSelection(document, selection);
  if (!selected) return null;
  return (
    <>
      {" "}
      <section className="page-heading">
        <div>
          <p className="eyebrow">ЛИЧНАЯ КАРТА РАЗВИТИЯ</p>
          <h1>
            Расти в своём направлении<span>.</span>
          </h1>
          <p className="page-description">
            Большая карьера складывается из маленьких шагов. Отметь свой следующий.
          </p>
        </div>
        <div className="file-actions">
          <Button variant="ghost" disabled={busy} onClick={onImport}>
            <ArrowDownToLine />
            Импорт
          </Button>
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => {
              onExport();
            }}
          >
            <ArrowUpFromLine />
            Экспорт
          </Button>
        </div>
      </section>
      <ProfileSummary document={document} />
      <div className="workspace">
        <section className="chart-panel" aria-labelledby="schema-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">ОБЗОР</p>
              <h2 id="schema-title">{document.schema.name}</h2>
            </div>
            <span className="small-badge">Направлений: {document.schema.groups.length}</span>
          </div>
          <div className="chart-layout">
            <div className="chart-container">
              <Snowflake
                document={document}
                selection={{ trackId: selected.track.id, level: selected.level }}
                onSelect={onSelect}
              />
              <p className="chart-hint">
                <CircleHelp size={14} />
                Выбери сектор, чтобы узнать больше об этапе
              </p>
            </div>
            <TrackList
              document={document}
              selection={{ trackId: selected.track.id, level: selected.level }}
              onSelect={onSelect}
            />
          </div>
          <div className="chart-footer">
            <span>
              <i className="legend-completed" />
              Достигнуто
            </span>
            <span>
              <i className="legend-upcoming" />
              Впереди
            </span>
            <span>
              <i className="legend-selected" />
              Выбранный этап
            </span>
          </div>
        </section>
        <LevelDetails
          group={selected.group}
          track={selected.track}
          level={selected.level}
          progress={document.progress[selected.track.id] ?? 0}
          busy={busy}
          onSelectLevel={(level) => onSelect({ trackId: selected.track.id, level })}
          onSetProgress={(level) => {
            onSave({
              ...document,
              progress: { ...document.progress, [selected.track.id]: level },
            });
          }}
        />
      </div>
      <footer className="app-footer">
        <span>У каждого свой рисунок роста.</span>
        <span>Вдохновлено Medium Engineering Growth Framework</span>
      </footer>
    </>
  );
}
