import { beforeEach, describe, expect, it } from 'vitest';
import { createCompleteMunicipalityWorkspace } from '../src/application/workspace/CreateMunicipalityWorkspace';
import {
  inspectWorkspaceImport,
  restoreWorkspaceImport,
} from '../src/infrastructure/recovery/browserRecovery';
import { buildWorkspaceStorageKey } from '../src/infrastructure/persistence/local-storage';
import { ACTIVE_MUNICIPALITY_STORAGE_KEY } from '../src/appWorkspaceHydration';

const CUSTOM_MUNICIPALITIES_KEY = 'compas-ng:custom-municipalities';

function lojaJSON() {
  return JSON.stringify(createCompleteMunicipalityWorkspace({
    id: 'loja',
    name: 'Loja',
    province: 'Granada',
    ineCode: '18122',
    createdBy: 'COMPÁS NG',
  }));
}

describe('importación de un expediente individual', () => {
  beforeEach(() => localStorage.clear());

  it('registra el ámbito, conserva el expediente y lo deja activo', () => {
    const text = lojaJSON();
    expect(inspectWorkspaceImport(text)).toMatchObject({name:'Loja', conflict:undefined});

    restoreWorkspaceImport(text);

    expect(localStorage.getItem(buildWorkspaceStorageKey('loja'))).toBe(text);
    expect(JSON.parse(localStorage.getItem(CUSTOM_MUNICIPALITIES_KEY) ?? '[]')).toContainEqual(
      expect.objectContaining({id:'loja', name:'Loja', province:'Granada', ineCode:'18122'})
    );
    expect(localStorage.getItem(ACTIVE_MUNICIPALITY_STORAGE_KEY)).toBe('loja');
  });

  it('no sobrescribe una versión diferente ya guardada', () => {
    const text = lojaJSON();
    localStorage.setItem(buildWorkspaceStorageKey('loja'), JSON.stringify({different:true}));

    const checked = inspectWorkspaceImport(text);
    expect(checked.conflict).toContain('versión diferente');
    expect(() => restoreWorkspaceImport(text)).toThrow('No se ha sobrescrito');
    expect(localStorage.getItem(buildWorkspaceStorageKey('loja'))).toBe(JSON.stringify({different:true}));
  });
});
