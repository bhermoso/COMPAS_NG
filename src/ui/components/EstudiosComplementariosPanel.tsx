import { useState } from "react";
import type { IBSEStudy } from "../../domain/ibse";
import type { DUKEStudy } from "../../domain/duke";
import type { PREDIMEDStudy } from "../../domain/predimed";
import type { SF12Study } from "../../domain/sf12";
import type { SuenoStudy } from "../../domain/sueno";
import type { CAGEStudy } from "../../domain/cage";
import type { AUDITCStudy } from "../../domain/auditc";
import type { IPAQStudy } from "../../domain/ipaq";
import type { GHQ12Study } from "../../domain/ghq12";
import type { PHQ9Study } from "../../domain/phq9";
import type { PSQIStudy } from "../../domain/psqi";
import type { MunicipalDocumentRepository } from "../../domain/repository";
import { IBSEPanel } from "./IBSEPanel";
import { DUKEPanel } from "./DUKEPanel";
import { PREDIMEDPanel } from "./PREDIMEDPanel";
import { SF12Panel } from "./SF12Panel";
import { SuenoPanel } from "./SuenoPanel";
import { CAGEPanel } from "./CAGEPanel";
import { AUDITCPanel } from "./AUDITCPanel";
import { IPAQPanel } from "./IPAQPanel";
import { GHQ12Panel } from "./GHQ12Panel";
import { PHQ9Panel } from "./PHQ9Panel";
import { PSQIPanel } from "./PSQIPanel";

// ── Fila de instrumento ───────────────────────────────────────────────────────
// Lista fija y ordenada. El botón de carga es siempre visible.
// El input de fichero siempre está en el DOM — no se oculta nunca.
// Los detalles del estudio se muestran inline cuando está cargado.

interface StudyRowProps {
  name: string;
  subtitle: string;
  inputId: string;
  loaded: boolean;
  isLoading?: boolean;
  recordSummary?: string;
  sourceFileName?: string;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

function StudyRow({
  name,
  subtitle,
  inputId,
  loaded,
  isLoading,
  recordSummary,
  sourceFileName,
  message,
  onLoadCSV,
  onDelete,
  children,
}: StudyRowProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className={`ec-study-row${loaded ? " ec-study-row--loaded" : ""}`}>
      <div className="ec-study-row__header">
        <span
          className={`ec-study-row__dot${loaded ? " ec-study-row__dot--loaded" : ""}`}
          aria-hidden="true"
        />
        <div className="ec-study-row__meta">
          <span className="ec-study-row__name">{name}</span>
          <span className="ec-study-row__subtitle">{subtitle}</span>
        </div>
        <div className="ec-study-row__summary">
          {loaded ? (
            <>
              <span className="ec-study-row__record">{recordSummary ?? "Cargado"}</span>
              {sourceFileName && (
                <span className="ec-study-row__file">{sourceFileName}</span>
              )}
            </>
          ) : (
            <span className="ec-study-row__empty">Sin datos</span>
          )}
        </div>
        <div className="ec-study-row__actions">
          {/* Input siempre en el DOM — accesible vía label aunque invisible */}
          <label
            htmlFor={inputId}
            className={`ec-study-row__upload${isLoading ? " ec-study-row__upload--loading" : ""}`}
            aria-disabled={isLoading === true}
          >
            {isLoading
              ? "Procesando…"
              : loaded
              ? "Sustituir CSV"
              : "Cargar CSV"}
          </label>
          <input
            id={inputId}
            type="file"
            accept=".csv"
            disabled={isLoading === true}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file !== undefined && onLoadCSV !== undefined) onLoadCSV(file);
              e.target.value = "";
            }}
            className="ec-study-row__input"
          />
          {loaded && onDelete && (
            <button
              type="button"
              className="ec-study-row__delete"
              onClick={() => {
                if (window.confirm(`¿Eliminar ${name}?\nSe borrarán también sus evidencias derivadas.`)) {
                  onDelete();
                }
              }}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
      {message !== undefined && message !== null && !isLoading && (
        <p className="ec-study-row__message">{message}</p>
      )}
      {loaded && children && (
        <>
          <button
            type="button"
            className="ec-study-row__detail-toggle"
            onClick={() => setShowDetail((v) => !v)}
            aria-expanded={showDetail}
          >
            {showDetail ? "Ocultar detalle ▲" : "Ver detalle ▾"}
          </button>
          {showDetail && (
            <div className="ec-study-row__detail">{children}</div>
          )}
        </>
      )}
    </div>
  );
}

// ── Props del panel principal ─────────────────────────────────────────────────

interface EstudiosComplementariosPanelProps {
  municipalityName?: string;

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

  suenoStudy?: SuenoStudy;
  isLoadingSueno?: boolean;
  suenoMessage?: string | null;
  onLoadSuenoCSV?: (file: File) => void;

  cageStudy?: CAGEStudy;
  isLoadingCAGE?: boolean;
  cageMessage?: string | null;
  onLoadCAGECSV?: (file: File) => void;

  auditcStudy?: AUDITCStudy;
  isLoadingAUDITC?: boolean;
  auditcMessage?: string | null;
  onLoadAUDITCCSV?: (file: File) => void;

  ipaqStudy?: IPAQStudy;
  isLoadingIPAQ?: boolean;
  ipaqMessage?: string | null;
  onLoadIPAQCSV?: (file: File) => void;

  ghq12Study?: GHQ12Study;
  isLoadingGHQ12?: boolean;
  ghq12Message?: string | null;
  onLoadGHQ12CSV?: (file: File) => void;

  phq9Study?: PHQ9Study;
  isLoadingPHQ9?: boolean;
  phq9Message?: string | null;
  onLoadPHQ9CSV?: (file: File) => void;

  psqiStudy?: PSQIStudy;
  isLoadingPSQI?: boolean;
  psqiMessage?: string | null;
  onLoadPSQICSV?: (file: File) => void;

  // Repositorio y callback de borrado para el botón Eliminar
  repository?: MunicipalDocumentRepository;
  onDeleteDocument?: (documentId: string) => void;
}

// ── Componente principal ──────────────────────────────────────────────────────

export function EstudiosComplementariosPanel({
  municipalityName,
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
  suenoStudy,
  isLoadingSueno,
  suenoMessage,
  onLoadSuenoCSV,
  cageStudy,
  isLoadingCAGE,
  cageMessage,
  onLoadCAGECSV,
  auditcStudy,
  isLoadingAUDITC,
  auditcMessage,
  onLoadAUDITCCSV,
  ipaqStudy,
  isLoadingIPAQ,
  ipaqMessage,
  onLoadIPAQCSV,
  ghq12Study,
  isLoadingGHQ12,
  ghq12Message,
  onLoadGHQ12CSV,
  phq9Study,
  isLoadingPHQ9,
  phq9Message,
  onLoadPHQ9CSV,
  psqiStudy,
  isLoadingPSQI,
  psqiMessage,
  onLoadPSQICSV,
  repository,
  onDeleteDocument,
}: EstudiosComplementariosPanelProps) {
  const loadedCount = [ibseStudy, dukeStudy, predimedStudy, sf12Study, suenoStudy, cageStudy, auditcStudy, ipaqStudy, ghq12Study, phq9Study, psqiStudy].filter(Boolean).length;

  // Busca el documentId de un estudio por su tag en el repositorio
  function docIdByTag(tag: string): string | undefined {
    return repository?.documents.find((d) => d.tags.includes(tag))?.id;
  }

  function makeDeleteHandler(tag: string) {
    const id = docIdByTag(tag);
    if (id === undefined || onDeleteDocument === undefined) return undefined;
    return () => onDeleteDocument(id);
  }

  return (
    <section className="workspace-panel ec-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Estudios complementarios</p>
          <h2>Estudios Complementarios</h2>
        </div>
        <p className="panel-note">
          Instrumentos de medición sobre bienestar, apoyo social, alimentación y
          conductas de salud, aplicados sobre microdatos de la Encuesta Andaluza de Salud.{" "}
          {loadedCount > 0
            ? `${loadedCount} de 11 disponibles en este espacio de trabajo.`
            : "Ningún estudio cargado en este espacio de trabajo."}
        </p>
      </div>

      <div className="ec-studies">
        <StudyRow
          name="IBSE"
          subtitle="Bienestar socioemocional escolar"
          inputId="ibse-csv-input"
          loaded={ibseStudy !== undefined}
          isLoading={isLoadingIBSE}
          recordSummary={ibseStudy ? `${ibseStudy.aggregates.nValid} válidos · media ${ibseStudy.aggregates.meanTotal}` : undefined}
          sourceFileName={ibseStudy?.sourceFileName}
          message={ibseMessage}
          onLoadCSV={onLoadIBSECSV}
          onDelete={makeDeleteHandler("ibse")}
        >
          <IBSEPanel ibseStudy={ibseStudy} isLoading={isLoadingIBSE} message={ibseMessage} onLoadCSV={onLoadIBSECSV} municipalityName={municipalityName} />
        </StudyRow>

        <StudyRow
          name="DUKE-EAS"
          subtitle="Apoyo social funcional"
          inputId="duke-csv-input"
          loaded={dukeStudy !== undefined}
          isLoading={isLoadingDUKE}
          recordSummary={dukeStudy ? `${dukeStudy.aggregates.nValidGlobal} válidos · media ${dukeStudy.aggregates.meanGlobal}/55` : undefined}
          sourceFileName={dukeStudy?.sourceFileName}
          message={dukeMessage}
          onLoadCSV={onLoadDUKECSV}
          onDelete={makeDeleteHandler("duke-eas")}
        >
          <DUKEPanel dukeStudy={dukeStudy} isLoading={isLoadingDUKE} message={dukeMessage} onLoadCSV={onLoadDUKECSV} municipalityName={municipalityName} />
        </StudyRow>

        <StudyRow
          name="PREDIMED-EAS"
          subtitle="Adherencia a dieta mediterránea"
          inputId="predimed-csv-input"
          loaded={predimedStudy !== undefined}
          isLoading={isLoadingPREDIMED}
          recordSummary={predimedStudy ? `${predimedStudy.aggregates.nValid} válidos · media ${predimedStudy.aggregates.meanScore}` : undefined}
          sourceFileName={predimedStudy?.sourceFileName}
          message={predimedMessage}
          onLoadCSV={onLoadPREDIMEDCSV}
          onDelete={makeDeleteHandler("predimed-eas")}
        >
          <PREDIMEDPanel predimedStudy={predimedStudy} isLoading={isLoadingPREDIMED} message={predimedMessage} onLoadCSV={onLoadPREDIMEDCSV} municipalityName={municipalityName} />
        </StudyRow>

        <StudyRow
          name="SF-12 EAS"
          subtitle="Salud percibida (PCS / MCS)"
          inputId="sf12-csv-input"
          loaded={sf12Study !== undefined}
          isLoading={isLoadingSF12}
          recordSummary={sf12Study ? `${sf12Study.aggregates.nValidPCS} válidos · PCS ${sf12Study.aggregates.meanPCS.toFixed(1)} / MCS ${sf12Study.aggregates.meanMCS.toFixed(1)}` : undefined}
          sourceFileName={sf12Study?.sourceFileName}
          message={sf12Message}
          onLoadCSV={onLoadSF12CSV}
          onDelete={makeDeleteHandler("sf12-eas")}
        >
          <SF12Panel sf12Study={sf12Study} isLoading={isLoadingSF12} message={sf12Message} onLoadCSV={onLoadSF12CSV} municipalityName={municipalityName} />
        </StudyRow>

        <StudyRow
          name="Sueño EAS"
          subtitle="Duración y calidad subjetiva del sueño"
          inputId="sueno-csv-input"
          loaded={suenoStudy !== undefined}
          isLoading={isLoadingSueno}
          recordSummary={suenoStudy ? `${suenoStudy.aggregates.nValidP33R} válidos P33_R · ${suenoStudy.aggregates.pctInsufficientSleep.toFixed(1)} % insuficiente` : undefined}
          sourceFileName={suenoStudy?.sourceFileName}
          message={suenoMessage}
          onLoadCSV={onLoadSuenoCSV}
          onDelete={makeDeleteHandler("sueno-eas")}
        >
          <SuenoPanel suenoStudy={suenoStudy} isLoading={isLoadingSueno} message={suenoMessage} onLoadCSV={onLoadSuenoCSV} municipalityName={municipalityName} />
        </StudyRow>

        <StudyRow
          name="CAGE-EAS"
          subtitle="Riesgo de alcoholismo"
          inputId="cage-csv-input"
          loaded={cageStudy !== undefined}
          isLoading={isLoadingCAGE}
          recordSummary={cageStudy ? `${cageStudy.aggregates.nValidCAGER} válidos CAGE_R · riesgo ${cageStudy.aggregates.pctRisk.toFixed(1)} %` : undefined}
          sourceFileName={cageStudy?.sourceFileName}
          message={cageMessage}
          onLoadCSV={onLoadCAGECSV}
          onDelete={makeDeleteHandler("cage-eas")}
        >
          <CAGEPanel cageStudy={cageStudy} isLoading={isLoadingCAGE} message={cageMessage} onLoadCSV={onLoadCAGECSV} municipalityName={municipalityName} />
        </StudyRow>

        <StudyRow
          name="AUDIT-C"
          subtitle="Consumo de riesgo de alcohol (REDCap)"
          inputId="auditc-csv-input"
          loaded={auditcStudy !== undefined}
          isLoading={isLoadingAUDITC}
          recordSummary={auditcStudy ? `${auditcStudy.aggregates.nValid} válidos · riesgo ${auditcStudy.aggregates.pctPositive.toFixed(1)} %` : undefined}
          sourceFileName={auditcStudy?.sourceFileName}
          message={auditcMessage}
          onLoadCSV={onLoadAUDITCCSV}
          onDelete={makeDeleteHandler("auditc")}
        >
          <AUDITCPanel auditcStudy={auditcStudy} municipalityName={municipalityName} />
        </StudyRow>

        <StudyRow
          name="IPAQ-EAS"
          subtitle="Actividad física (EAS oficial)"
          inputId="ipaq-csv-input"
          loaded={ipaqStudy !== undefined}
          isLoading={isLoadingIPAQ}
          recordSummary={ipaqStudy ? `${ipaqStudy.aggregates.nValidIPAQ} válidos IPAQ_DICO · alta actividad ${ipaqStudy.aggregates.pctHigh.toFixed(1)} %` : undefined}
          sourceFileName={ipaqStudy?.sourceFileName}
          message={ipaqMessage}
          onLoadCSV={onLoadIPAQCSV}
          onDelete={makeDeleteHandler("ipaq-eas")}
        >
          <IPAQPanel ipaqStudy={ipaqStudy} municipalityName={municipalityName} />
        </StudyRow>

        <StudyRow
          name="GHQ-12"
          subtitle="Malestar psicológico (REDCap)"
          inputId="ghq12-csv-input"
          loaded={ghq12Study !== undefined}
          isLoading={isLoadingGHQ12}
          recordSummary={ghq12Study ? `${ghq12Study.aggregates.nValid} válidos · probable malestar ${ghq12Study.aggregates.pctPositive.toFixed(1)} %` : undefined}
          sourceFileName={ghq12Study?.sourceFileName}
          message={ghq12Message}
          onLoadCSV={onLoadGHQ12CSV}
          onDelete={makeDeleteHandler("ghq12")}
        >
          <GHQ12Panel ghq12Study={ghq12Study} municipalityName={municipalityName} />
        </StudyRow>

        <StudyRow
          name="PHQ-9"
          subtitle="Síntomas depresivos (REDCap)"
          inputId="phq9-csv-input"
          loaded={phq9Study !== undefined}
          isLoading={isLoadingPHQ9}
          recordSummary={phq9Study ? `${phq9Study.aggregates.nValid} válidos · síntomas mod.+ ${phq9Study.aggregates.pctPositive.toFixed(1)} %` : undefined}
          sourceFileName={phq9Study?.sourceFileName}
          message={phq9Message}
          onLoadCSV={onLoadPHQ9CSV}
          onDelete={makeDeleteHandler("phq9")}
        >
          <PHQ9Panel phq9Study={phq9Study} municipalityName={municipalityName} />
        </StudyRow>

        <StudyRow
          name="PSQI"
          subtitle="Calidad del sueño (REDCap)"
          inputId="psqi-csv-input"
          loaded={psqiStudy !== undefined}
          isLoading={isLoadingPSQI}
          recordSummary={psqiStudy ? `${psqiStudy.aggregates.nValid} válidos · mal dormidor ${psqiStudy.aggregates.pctPositive.toFixed(1)} %` : undefined}
          sourceFileName={psqiStudy?.sourceFileName}
          message={psqiMessage}
          onLoadCSV={onLoadPSQICSV}
          onDelete={makeDeleteHandler("psqi")}
        >
          <PSQIPanel psqiStudy={psqiStudy} municipalityName={municipalityName} />
        </StudyRow>
      </div>
    </section>
  );
}
