import type { MunicipalInventory } from "../../application/municipal-inventory";

interface InventoryItemProps {
  label: string;
  present: boolean;
  detail?: string;
}

function InventoryItem({ label, present, detail }: InventoryItemProps) {
  return (
    <li className={`inv-item${present ? " inv-item--present" : " inv-item--absent"}`}>
      <span className="inv-item__mark" aria-hidden="true">
        {present ? "✓" : "✗"}
      </span>
      <span className="inv-item__label">{label}</span>
      {detail !== undefined && (
        <span className="inv-item__detail">{detail}</span>
      )}
    </li>
  );
}

interface MunicipalInventoryPanelProps {
  inventory: MunicipalInventory;
}

export function MunicipalInventoryPanel({
  inventory,
}: MunicipalInventoryPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Diagnóstico municipal</p>
          <h2>Inventario de información disponible</h2>
        </div>
        <p className="panel-note">
          Fuentes de información presentes en este espacio de trabajo. Ningún
          dato implica juicio de calidad ni suficiencia.
        </p>
      </div>

      <p className="inv-section-label">Fuentes de datos</p>
      <ul className="inv-list">
        <InventoryItem
          label="Informe de Salud"
          present={inventory.hasHealthReport}
        />
        <InventoryItem
          label="Activos comunitarios"
          present={inventory.hasAssets}
        />
        <InventoryItem
          label="IBSE"
          present={inventory.hasIBSE}
          detail={
            inventory.hasIBSE
              ? `${inventory.ibseValidRecordCount} registros válidos`
              : undefined
          }
        />
        <InventoryItem
          label="Apoyo social funcional (DUKE-EAS)"
          present={inventory.hasDUKE}
          detail={
            inventory.hasDUKE
              ? `${inventory.dukeRecordCount} registros globales válidos`
              : undefined
          }
        />
        <InventoryItem
          label="Adherencia dieta mediterránea (PREDIMED-EAS)"
          present={inventory.hasPREDIMED}
          detail={
            inventory.hasPREDIMED
              ? `${inventory.predimedRecordCount} registros válidos`
              : undefined
          }
        />
        <InventoryItem
          label="Salud percibida — PCS/MCS (SF-12 EAS)"
          present={inventory.hasSF12}
          detail={
            inventory.hasSF12
              ? `${inventory.sf12RecordCount} registros válidos`
              : undefined
          }
        />
      </ul>

      {/* Recuentos */}
      <div className="inv-counts">
        <span className="inv-count-item">
          <strong>{inventory.repositoryDocumentCount}</strong> documento
          {inventory.repositoryDocumentCount !== 1 ? "s" : ""}
        </span>
        <span className="inv-count-sep">·</span>
        <span className="inv-count-item">
          <strong>{inventory.evidenceAtomCount}</strong> unidad
          {inventory.evidenceAtomCount !== 1 ? "es" : ""} de evidencia
        </span>
      </div>

      {/* Avisos técnicos (solo si existen) */}
      {inventory.warnings.length > 0 && (
        <ul className="inv-warnings">
          {inventory.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
