import { useEffect, useRef, useState } from "react";
import type { IBSEStudy } from "../../domain/ibse";
import type { DUKEStudy } from "../../domain/duke";
import type { PREDIMEDStudy } from "../../domain/predimed";
import type { SF12Study } from "../../domain/sf12";
import { IBSEPanel } from "./IBSEPanel";
import { DUKEPanel } from "./DUKEPanel";
import { PREDIMEDPanel } from "./PREDIMEDPanel";
import { SF12Panel } from "./SF12Panel";

// ── Sub-acordeón por instrumento ──────────────────────────────────────────────
// Se abre automáticamente cuando se carga datos; el usuario puede cerrarlo.
// No se cierra automáticamente al eliminar datos (evitar pérdida accidental).

interface InstrumentAccordionProps {
  name: string;
  subtitle: string;
  loaded: boolean;
  recordSummary?: string;
  children: React.ReactNode;
}

function InstrumentAccordion({
  name,
  subtitle,
  loaded,
  recordSummary,
  children,
}: InstrumentAccordionProps) {
  const [open, setOpen] = useState(loaded);
  const prevLoaded = useRef(loaded);

  useEffect(() => {
    if (loaded && !prevLoaded.current) {
      setOpen(true);
    }
    prevLoaded.current = loaded;
  }, [loaded]);

  return (
    <div className={`ec-instrument${open ? " ec-instrument--open" : ""}`}>
      <button
        type="button"
        className="ec-instrument__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span
          className={`ec-instrument__dot${loaded ? " ec-instrument__dot--loaded" : ""}`}
        />
        <span className="ec-instrument__name">{name}</span>
        <span className="ec-instrument__subtitle">{subtitle}</span>
        <span className="ec-instrument__status">
          {loaded ? (recordSummary ?? "Cargado") : "Sin datos"}
        </span>
        <span className="ec-instrument__arrow">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="ec-instrument__body">{children}</div>}
    </div>
  );
}

// ── Props del panel principal ─────────────────────────────────────────────────

interface EstudiosComplementariosPanelProps {
  ibseStudy?: IBSEStudy;
  isLoadingIBSE?: boolean;
  ibseMessage?: string | null;
  onLoadIBSECSV?: (file: File) => void;

  dukeStudy?: DUKEStudy;
  isLoadingDUKE?: boolean;
  dukeMessage?: string | null;
  onLoadDUKECSV?: (file: File) => void;

  predimedStudy?: PREDIMEDStudy;
  isLoadingPREDIMED?: boolean;
  predimedMessage?: string | null;
  onLoadPREDIMEDCSV?: (file: File) => void;

  sf12Study?: SF12Study;
  isLoadingSF12?: boolean;
  sf12Message?: string | null;
  onLoadSF12CSV?: (file: File) => void;
}

// ── Componente principal ──────────────────────────────────────────────────────

export function EstudiosComplementariosPanel({
  ibseStudy,
  isLoadingIBSE,
  ibseMessage,
  onLoadIBSECSV,
  dukeStudy,
  isLoadingDUKE,
  dukeMessage,
  onLoadDUKECSV,
  predimedStudy,
  isLoadingPREDIMED,
  predimedMessage,
  onLoadPREDIMEDCSV,
  sf12Study,
  isLoadingSF12,
  sf12Message,
  onLoadSF12CSV,
}: EstudiosComplementariosPanelProps) {
  const loadedCount = [ibseStudy, dukeStudy, predimedStudy, sf12Study].filter(Boolean).length;

  return (
    <section className="workspace-panel ec-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Diagnóstico sociosanitario complementario</p>
          <h2>Estudios Complementarios</h2>
        </div>
        <p className="panel-note">
          Instrumentos EAS de bienestar, apoyo social y alimentación.
          {loadedCount > 0
            ? ` ${loadedCount} instrumento${loadedCount > 1 ? "s" : ""} cargado${loadedCount > 1 ? "s" : ""}.`
            : " Ningún instrumento cargado aún."}
        </p>
      </div>

      <div className="ec-instruments">
        <InstrumentAccordion
          name="IBSE"
          subtitle="Bienestar socioemocional escolar"
          loaded={ibseStudy !== undefined}
          recordSummary={
            ibseStudy
              ? `${ibseStudy.aggregates.nValid} registros · media ${ibseStudy.aggregates.meanTotal}`
              : undefined
          }
        >
          <IBSEPanel
            ibseStudy={ibseStudy}
            isLoading={isLoadingIBSE}
            message={ibseMessage}
            onLoadCSV={onLoadIBSECSV}
          />
        </InstrumentAccordion>

        <InstrumentAccordion
          name="DUKE-EAS"
          subtitle="Apoyo social funcional"
          loaded={dukeStudy !== undefined}
          recordSummary={
            dukeStudy
              ? `${dukeStudy.aggregates.nValidGlobal} registros válidos`
              : undefined
          }
        >
          <DUKEPanel
            dukeStudy={dukeStudy}
            isLoading={isLoadingDUKE}
            message={dukeMessage}
            onLoadCSV={onLoadDUKECSV}
          />
        </InstrumentAccordion>

        <InstrumentAccordion
          name="PREDIMED-EAS"
          subtitle="Adherencia a dieta mediterránea"
          loaded={predimedStudy !== undefined}
          recordSummary={
            predimedStudy
              ? `${predimedStudy.aggregates.nValid} registros · media ${predimedStudy.aggregates.meanScore}`
              : undefined
          }
        >
          <PREDIMEDPanel
            predimedStudy={predimedStudy}
            isLoading={isLoadingPREDIMED}
            message={predimedMessage}
            onLoadCSV={onLoadPREDIMEDCSV}
          />
        </InstrumentAccordion>

        <InstrumentAccordion
          name="SF-12 EAS"
          subtitle="Salud percibida (PCS / MCS)"
          loaded={sf12Study !== undefined}
          recordSummary={
            sf12Study
              ? `${sf12Study.aggregates.nValidPCS} registros · PCS ${sf12Study.aggregates.meanPCS.toFixed(1)} / MCS ${sf12Study.aggregates.meanMCS.toFixed(1)}`
              : undefined
          }
        >
          <SF12Panel
            sf12Study={sf12Study}
            isLoading={isLoadingSF12}
            message={sf12Message}
            onLoadCSV={onLoadSF12CSV}
          />
        </InstrumentAccordion>
      </div>
    </section>
  );
}
