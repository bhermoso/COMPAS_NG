import { describe, it, expect } from 'vitest';
import { PLANNING_INSTRUMENTS } from '../src/domain/action-plan-catalog/PlanningInstruments';
import { ZAIDIN_AGING_PROPOSAL } from '../src/domain/action-plan-catalog/PlanPreparationDraft';
describe('Catálogo de preparación de instrumentos',()=>{
 it('cubre todos los objetivos y no introduce referencias inexistentes',()=>{
  const objectives=ZAIDIN_AGING_PROPOSAL.generalObjectives.flatMap(g=>g.specificObjectives.map(o=>o.code));
  const covered=new Set(PLANNING_INSTRUMENTS.flatMap(i=>i.objectives));
  expect([...covered].sort()).toEqual([...objectives].sort());
  expect(new Set(PLANNING_INSTRUMENTS.map(i=>i.id)).size).toBe(PLANNING_INSTRUMENTS.length);
 });
 it('identifica procedencia y limitaciones sin incorporar datos ni puntuaciones',()=>{
  for(const instrument of PLANNING_INSTRUMENTS){
   expect(instrument.population).toBeTruthy();expect(instrument.limitation).toBeTruthy();
   if(instrument.kind==='Escala candidata') expect(instrument.reference).toMatch(/^https:\/\//);
   expect(instrument).not.toHaveProperty('responses');expect(instrument).not.toHaveProperty('score');
  }
 });
});
