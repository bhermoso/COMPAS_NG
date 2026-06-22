# Auditoría IBSE — Biblioteca Metodológica

Fecha: 2026-06-22

## Hallazgo

El módulo `IBSE_MODULE` está actualmente en estado `draft` y mantiene `items: []`.

Sin embargo, el repositorio contiene el diccionario REDCap:

`MonitorIBSEATARFE2026_DataDictionary_2026-06-20.csv`

Este diccionario incluye los 8 ítems IBSE, sus opciones de respuesta y las variables calculadas de factores e índice total.

## Ítems IBSE localizados

| Variable REDCap | Texto |
|---|---|
| `ibse_deprimido` | Deprimido/a |
| `ibse_feliz` | Feliz |
| `ibse_solo` | Solo/a |
| `ibse_disfrutar` | Ha tenido la sensación de disfrutar de la vida |
| `ibse_energia` | Rebosante de energía |
| `ibse_tranquilo` | Tranquilo/a y relajado/a |
| `ibse_optimista` | Me he sido optimista respecto a mi futuro |
| `ibse_bienmismo` | Por lo general me he sentido bien conmigo mismo |

## Escalas de respuesta

Ítems 1–6:

- 1 = En ningún momento o en casi ningún momento
- 2 = En algún momento
- 3 = Buena parte del tiempo
- 4 = Todo o casi todo el tiempo

Ítems 7–8:

- 1 = Muy de acuerdo
- 2 = De acuerdo
- 3 = Ni de acuerdo ni en desacuerdo
- 4 = En desacuerdo
- 5 = Muy en desacuerdo

## Variables calculadas REDCap

| Variable | Fórmula |
|---|---|
| `ibse_factor_vinculo` | `(((5-[ibse_deprimido])+(5-[ibse_solo]))/2-1)*25` |
| `ibse_factor_situacion` | `((([ibse_feliz]+1)+([ibse_disfrutar]+1))/2-1)*25` |
| `ibse_factor_control` | `((([ibse_energia]+1)+([ibse_tranquilo]+1))/2-1)*25` |
| `ibse_factor_persona` | `(((6-[ibse_optimista])+(6-[ibse_bienmismo]))/2-1)*25` |
| `ibse_total` | `([ibse_factor_vinculo]+[ibse_factor_situacion]+[ibse_factor_control]+[ibse_factor_persona])/4` |

## Decisión pendiente

Completar `IBSE_MODULE.items` usando este diccionario como contrato interno verificado.

No cambiar todavía el estado de `draft` a `validated` salvo decisión expresa, porque el propio módulo exige contraste con fuente primaria Bericat 2014.
