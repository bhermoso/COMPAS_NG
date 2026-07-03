import {
  interpretTerritorialMetric,
  type TerritorialComparison as TerritorialComparisonModel,
} from "../../application/complementary-studies";

interface TerritorialComparisonProps {
  comparison: TerritorialComparisonModel;
}

function formatValue(value: number | null, unit: string): string {
  if (value === null) return "No disponible";
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return `${formatted}${unit}`;
}

export function TerritorialComparison({ comparison }: TerritorialComparisonProps) {
  return (
    <section className="territorial-comparison" aria-label="Comparación territorial">
      <div className="territorial-comparison__heading">
        <div>
          <p className="study-report__section-title">Comparación territorial</p>
          <p className="territorial-comparison__subtitle">
            Referencias calculadas con el mismo algoritmo del estudio.
          </p>
        </div>
      </div>

      <div className="territorial-comparison__table-wrap">
        <table className="territorial-comparison__table">
          <thead>
            <tr>
              <th scope="col">Indicador</th>
              <th scope="col">{comparison.municipalityName}</th>
              <th scope="col">Provincia de Granada</th>
              <th scope="col">Andalucía</th>
            </tr>
          </thead>
          <tbody>
            {comparison.metrics.map((metric) => (
              <tr key={metric.label}>
                <th scope="row">{metric.label}</th>
                <td className="territorial-comparison__municipal">
                  {formatValue(metric.municipalityValue, metric.unit)}
                </td>
                <td>{formatValue(metric.granadaValue, metric.unit)}</td>
                <td>{formatValue(metric.andaluciaValue, metric.unit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="territorial-comparison__interpretation">
        <span className="territorial-comparison__interpretation-label">Interpretación automática</span>
        {comparison.metrics.map((metric) => (
          <p key={metric.label}>{interpretTerritorialMetric(metric)}</p>
        ))}
      </div>

      {comparison.source !== null && (
        <p className="territorial-comparison__source">Fuente de referencia: {comparison.source}</p>
      )}
      {comparison.methodologicalNote && (
        <p className="territorial-comparison__note">{comparison.methodologicalNote}</p>
      )}
    </section>
  );
}
