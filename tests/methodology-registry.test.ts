/**
 * Test de integridad estructural de la Biblioteca Metodológica.
 *
 * Recorre todos los módulos registrados en getAllMethodologicalModules()
 * y verifica un contrato mínimo por sección: identidad, fuente,
 * ítems, dimensiones, interpretación y adaptadores opcionales.
 *
 * Restricciones de diseño:
 *   - Permite módulos en estado "draft": no exige status === "validated".
 *   - Permite estructuras parciales: los adaptadores (SAV, REDCap) son opcionales.
 *   - Los thresholds son opcionales; solo se validan si existen.
 *   - Los referenceValues son opcionales; solo se validan si existen.
 *   - Las dimensiones compuestas (isComposite: true) pueden tener itemIds vacíos.
 */

import { describe, it, expect } from 'vitest'
import { getAllMethodologicalModules } from '../src/domain/methodology/registry'

// ── Conjuntos de valores válidos por tipo ────────────────────────────────────

const VALID_STATUSES     = new Set(['draft', 'validated', 'deprecated'])
const VALID_CATEGORIES   = new Set([
  'eas-sociodemographic', 'eas-official-block', 'validated-scale',
  'municipal-module', 'external-official-module', 'custom',
])
const VALID_DIRECTIONS   = new Set(['higher-is-better', 'lower-is-better', 'neutral'])
const VALID_MEAS_LEVELS  = new Set(['nominal', 'ordinal', 'scale'])

// ── Carga del registro ───────────────────────────────────────────────────────

const ALL_MODULES = getAllMethodologicalModules()

// ── Suite principal ──────────────────────────────────────────────────────────

describe('Biblioteca Metodológica — integridad estructural', () => {

  it('el registro contiene al menos un módulo registrado', () => {
    expect(ALL_MODULES.length).toBeGreaterThan(0)
  })

  for (const mod of ALL_MODULES) {
    const mid = mod.identity.id

    describe(`módulo "${mid}"`, () => {

      // ── Identidad ────────────────────────────────────────────────────────

      describe('identidad', () => {
        it('id no está vacío', () => {
          expect(mid.trim()).toBeTruthy()
        })

        it('name no está vacío', () => {
          expect(mod.identity.name.trim()).toBeTruthy()
        })

        it('shortName no está vacío', () => {
          expect(mod.identity.shortName.trim()).toBeTruthy()
        })

        it('status es un valor reconocido', () => {
          expect(
            VALID_STATUSES.has(mod.identity.status),
            `status inválido: "${mod.identity.status}"`
          ).toBe(true)
        })

        it('category es un valor reconocido', () => {
          expect(
            VALID_CATEGORIES.has(mod.identity.category),
            `category inválida: "${mod.identity.category}"`
          ).toBe(true)
        })

        it('createdAt tiene formato YYYY-MM-DD', () => {
          expect(mod.identity.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        })
      })

      // ── Fuente y bibliografía ─────────────────────────────────────────────

      describe('fuente y bibliografía', () => {
        it('source.authors no está vacío', () => {
          expect(mod.source.authors.trim()).toBeTruthy()
        })

        it('bibliography tiene al menos una entrada', () => {
          expect(mod.bibliography.length).toBeGreaterThan(0)
        })

        it('cada referencia bibliográfica tiene authors no vacío', () => {
          for (const ref of mod.bibliography) {
            expect(
              ref.authors.trim(),
              `entrada bibliográfica con authors vacío en módulo "${mid}"`
            ).toBeTruthy()
          }
        })

        it('limitations tiene al menos un elemento', () => {
          expect(mod.limitations.length).toBeGreaterThan(0)
        })

        it('ninguna limitación está vacía', () => {
          for (const lim of mod.limitations) {
            expect(lim.trim(), `limitación vacía en módulo "${mid}"`).toBeTruthy()
          }
        })
      })

      // ── Ítems ─────────────────────────────────────────────────────────────

      describe('ítems', () => {
        const itemIds   = mod.items.map(i => i.id)
        const dimIdSet  = new Set(mod.dimensions.map(d => d.id))

        it('ningún item.id está vacío', () => {
          for (const item of mod.items) {
            expect(item.id.trim(), `ítem con id vacío en módulo "${mid}"`).toBeTruthy()
          }
        })

        it('los item.id no están duplicados', () => {
          expect(itemIds.length).toBe(new Set(itemIds).size)
        })

        it('cada item.dimensionId referencia una dimensión existente', () => {
          for (const item of mod.items) {
            expect(
              dimIdSet.has(item.dimensionId),
              `ítem "${item.id}" tiene dimensionId "${item.dimensionId}" que no existe en módulo "${mid}"`
            ).toBe(true)
          }
        })
      })

      // ── Dimensiones ───────────────────────────────────────────────────────

      describe('dimensiones', () => {
        const dimIds   = mod.dimensions.map(d => d.id)
        const itemIdSet = new Set(mod.items.map(i => i.id))

        it('ningún dimension.id está vacío', () => {
          for (const dim of mod.dimensions) {
            expect(dim.id.trim(), `dimensión con id vacío en módulo "${mid}"`).toBeTruthy()
          }
        })

        it('los dimension.id no están duplicados', () => {
          expect(dimIds.length).toBe(new Set(dimIds).size)
        })

        it('cada dimension.outputField no está vacío', () => {
          for (const dim of mod.dimensions) {
            expect(
              dim.outputField.trim(),
              `dimensión "${dim.id}" tiene outputField vacío en módulo "${mid}"`
            ).toBeTruthy()
          }
        })

        it('los itemIds de las dimensiones referencian ítems existentes', () => {
          for (const dim of mod.dimensions) {
            if (dim.isComposite) continue  // compuestas pueden tener itemIds vacíos
            for (const itemId of dim.itemIds) {
              expect(
                itemIdSet.has(itemId),
                `dimensión "${dim.id}" referencia ítem "${itemId}" inexistente en módulo "${mid}"`
              ).toBe(true)
            }
          }
        })

        it('no hay itemIds duplicados dentro de una dimensión', () => {
          for (const dim of mod.dimensions) {
            const seen = new Set<string>()
            for (const itemId of dim.itemIds) {
              expect(
                !seen.has(itemId),
                `dimensión "${dim.id}" tiene itemId "${itemId}" duplicado en módulo "${mid}"`
              ).toBe(true)
              seen.add(itemId)
            }
          }
        })
      })

      // ── Interpretación ────────────────────────────────────────────────────

      describe('interpretación', () => {
        it('scale.min es estrictamente menor que scale.max', () => {
          expect(mod.interpretation.scale.min).toBeLessThan(mod.interpretation.scale.max)
        })

        it('scale.direction es un valor reconocido', () => {
          expect(
            VALID_DIRECTIONS.has(mod.interpretation.scale.direction),
            `direction inválida: "${mod.interpretation.scale.direction}" en módulo "${mid}"`
          ).toBe(true)
        })

        it('contextualNotes tiene al menos un elemento', () => {
          expect(mod.interpretation.contextualNotes.length).toBeGreaterThan(0)
        })

        // Thresholds — solo si están definidos
        const thresholds = mod.interpretation.thresholds
        if (thresholds && thresholds.length > 0) {
          it('cada threshold tiene etiqueta no vacía', () => {
            for (const t of thresholds) {
              expect(t.label.trim(), `threshold sin etiqueta en módulo "${mid}"`).toBeTruthy()
            }
          })

          it('cada threshold tiene min <= max', () => {
            for (const t of thresholds) {
              expect(t.min, `threshold con min > max en módulo "${mid}"`).toBeLessThanOrEqual(t.max)
            }
          })

          it('los thresholds no se solapan al ordenarlos por min', () => {
            // Se ordena por min antes de comparar para soportar tanto orden
            // ascendente (PREDIMED) como descendente (DUKE-EAS).
            const sorted = [...thresholds].sort((a, b) => a.min - b.min)
            for (let i = 0; i < sorted.length - 1; i++) {
              expect(
                sorted[i].max,
                `threshold [${sorted[i].min}–${sorted[i].max}] se solapa con ` +
                `[${sorted[i + 1].min}–${sorted[i + 1].max}] en módulo "${mid}"`
              ).toBeLessThan(sorted[i + 1].min)
            }
          })
        }

        // referenceValues — solo si están definidos
        const refVals = mod.interpretation.referenceValues
        if (refVals) {
          it('referenceValues.source no está vacío', () => {
            expect(refVals.source.trim(), `referenceValues sin source en módulo "${mid}"`).toBeTruthy()
          })

          it('referenceValues.population no está vacío', () => {
            expect(refVals.population.trim()).toBeTruthy()
          })
        }
      })

      // ── Adaptador SAV (opcional) ──────────────────────────────────────────

      const sav = mod.adapters?.sav
      if (sav) {
        describe('adaptador SAV', () => {
          const vars = sav.variables

          it('tiene al menos una variable SAV declarada', () => {
            expect(vars.length).toBeGreaterThan(0)
          })

          it('todas las variables tienen outputField no vacío', () => {
            for (const v of vars) {
              expect(
                v.outputField.trim(),
                `variable SAV con outputField vacío en módulo "${mid}"`
              ).toBeTruthy()
            }
          })

          it('todas las variables tienen savVariable no vacía', () => {
            for (const v of vars) {
              expect(
                v.savVariable.trim(),
                `variable SAV con savVariable vacía en módulo "${mid}"`
              ).toBeTruthy()
            }
          })

          it('no hay outputField duplicados en el adaptador SAV', () => {
            const fields = vars.map(v => v.outputField)
            expect(
              fields.length,
              `outputField duplicados en adaptador SAV del módulo "${mid}"`
            ).toBe(new Set(fields).size)
          })

          it('no hay savVariable duplicadas en el adaptador SAV', () => {
            const savVarNames = vars.map(v => v.savVariable)
            expect(
              savVarNames.length,
              `savVariable duplicadas en adaptador SAV del módulo "${mid}"`
            ).toBe(new Set(savVarNames).size)
          })

          it('measurementLevel tiene valor válido cuando está presente', () => {
            for (const v of vars) {
              if (v.measurementLevel !== undefined) {
                expect(
                  VALID_MEAS_LEVELS.has(v.measurementLevel),
                  `variable "${v.outputField}" tiene measurementLevel inválido: "${v.measurementLevel}"`
                ).toBe(true)
              }
            }
          })
        })
      }

      // ── Adaptador REDCap (opcional) ───────────────────────────────────────

      const redcap = mod.adapters?.redcap
      if (redcap) {
        describe('adaptador REDCap', () => {
          it('completedColumn no está vacío', () => {
            expect(redcap.completedColumn.trim()).toBeTruthy()
          })

          it('completedValue no está vacío', () => {
            expect(redcap.completedValue.trim()).toBeTruthy()
          })

          it('tiene al menos una columna declarada', () => {
            expect(redcap.columns.length).toBeGreaterThan(0)
          })

          it('todas las columnas tienen outputField y redcapColumn no vacíos', () => {
            for (const col of redcap.columns) {
              expect(col.outputField.trim(), `columna REDCap con outputField vacío`).toBeTruthy()
              expect(col.redcapColumn.trim(), `columna REDCap con redcapColumn vacía`).toBeTruthy()
            }
          })

          it('no hay outputField duplicados en el adaptador REDCap', () => {
            const fields = redcap.columns.map(c => c.outputField)
            expect(fields.length).toBe(new Set(fields).size)
          })

          it('no hay redcapColumn duplicadas en el adaptador REDCap', () => {
            const cols = redcap.columns.map(c => c.redcapColumn)
            expect(cols.length).toBe(new Set(cols).size)
          })
        })
      }

    })  // end describe módulo
  }  // end for mod

})  // end describe principal
