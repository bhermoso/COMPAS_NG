import type { StrategicFramework } from "../../domain/strategic-framework";

interface StrategicFrameworkPanelProps {
  framework: StrategicFramework;
}

export function StrategicFrameworkPanel({ framework }: StrategicFrameworkPanelProps) {
  return (
    <section className="workspace-panel sf-panel">
      <div className="sf-panel__header">
        <div className="sf-panel__header-top">
          <span className="sf-panel__block-num">01</span>
          <p className="eyebrow">Perfil de Salud Local · {framework.municipalityName}</p>
        </div>
        <h2 className="sf-panel__title">Marco estratégico de la acción local en salud</h2>
        <p className="sf-panel__subtitle">Marco normativo, estratégico y metodológico</p>
      </div>

      <div className="sf-panel__sections">
        {framework.sections.map((section) => (
          <div key={section.id} className="sf-section">
            <h3 className="sf-section__title">{section.title}</h3>
            <div className="sf-section__body">
              {section.body.map((paragraph, i) => (
                <p key={i} className="sf-section__paragraph">{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {framework.sanitaryDistrict !== undefined && (
        <p className="sf-panel__district">
          Distrito Sanitario de referencia: <strong>{framework.sanitaryDistrict}</strong>
        </p>
      )}
    </section>
  );
}
