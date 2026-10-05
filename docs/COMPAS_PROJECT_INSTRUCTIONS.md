# COMPAS_NG — Project Instructions

## Purpose

This document contains the canonical functional, factual and editorial constraints of COMPAS_NG.

It is distinct from the author's style guide.

Use this document to decide **what COMPAS_NG is allowed to say and do**.
Use `BLAS_WRITING_STYLE.md` to decide **how Spanish prose in COMPAS_NG should be written**.

The style guide is not external decoration. It applies to interface copy, reports, methodological documentation, contracts and generated-text templates. COMPAS_NG should speak with analytical precision, natural Spanish, conceptual care and hostility to commonplaces, filler phrases, bureaucratic padding and mass-produced AI prose.

---

# 1. Core factual rule

Never invent or infer unsupported:

- indicator values;
- survey results;
- samples;
- percentages;
- means;
- rates;
- dates;
- instruments;
- sources;
- references;
- DOI;
- page numbers;
- quotations;
- local evidence;
- diagnoses;
- implementation status;
- strategic priorities.

If a value or fact is unavailable, state that it is unavailable.

Do not transform absence of data into:

- zero;
- normality;
- absence of a problem;
- estimated value;
- assumed baseline.

A precise unsupported value is worse than an explicit absence of data.

---

# 2. Source traceability

Whenever COMPAS_NG presents a factual claim, indicator, diagnosis, strategic interpretation or recommendation:

- preserve the source;
- preserve territorial scope;
- preserve temporal scope;
- distinguish observed data from interpretation;
- distinguish local evidence from provincial, regional or national context;
- do not silently extrapolate one territory to another.

Whenever the interface supports it, provide a link or traceable reference to the original source document.

---

# 3. Territorial discipline

Always distinguish the level to which a datum refers:

- person;
- centre;
- UGC / health centre;
- neighbourhood;
- district;
- municipality;
- province;
- autonomous community;
- Spain.

Never attribute a provincial, regional or municipal value to a district, centre or neighbourhood unless the source supports that attribution.

Contextual data may be displayed as context, but must be labelled as such.

---

# 4. Temporal discipline

Every datum has a time reference.

Preserve:

- reference year;
- study period;
- publication date where relevant;
- whether the datum is current, historical or contextual.

Do not present an old result as current without qualification.

Do not infer a trend from isolated cross-sectional values.

---

# 5. Instruments versus observed results

Maintain a strict distinction between:

- instrument available in COMPAS_NG;
- instrument selected;
- instrument administered;
- valid responses obtained;
- result calculated.

Availability does not imply administration.

Administration in one territory does not imply administration in another.

Do not create results for instruments that have not been applied.

Use **IBSE** for **Índice de Bienestar Socioemocional**.

---

# 6. Current known constraint on complementary studies

Where COMPAS_NG includes complementary study instruments such as:

- IBSE;
- DUKE-EAS;
- PREDIMED-EAS;
- SF-12 EAS;
- sleep instruments;
- other available scales;

their availability in the application must not be interpreted as evidence that they were applied in every territory.

In particular, do not assign scale results to El Zaidín unless the underlying data explicitly support that attribution.

---

# 7. Separation of analytical stages

Maintain strict separation between:

## Perfil de Salud Local
Describes and organizes the available health and contextual evidence for the territory.

## Lectura Estratégica Local
Interprets the validated local profile and identifies strategic implications.

## Plan de Acción
Transforms validated priorities and strategic lines into objectives, indicators, actions and monitoring structures.

Do not allow later phases to fabricate or backfill evidence required by earlier phases.

A Plan de Acción should not become available merely because draft content exists if the validated prerequisites are not satisfied.

---

# 8. Strategic lines, objectives and indicators

Maintain the distinction between:

- strategic line;
- strategic objective;
- general objective;
- specific objective;
- indicator;
- action;
- responsible actor;
- source of verification;
- baseline;
- target.

Do not use these categories interchangeably.

An indicator is not an objective.
An action is not an outcome.
A strategic line is not evidence.
A diagnosis is not automatically a priority.

---

# 9. Objectives

Objectives should be:

- intelligible;
- evaluable;
- proportionate to available evidence;
- consistent with the intervention level;
- linked to plausible indicators.

Do not formulate objectives whose achievement cannot be assessed with the proposed indicators.

Do not create artificial numerical precision merely because a field expects a target.

---

# 10. Indicators

For each indicator, check:

- definition;
- numerator and denominator where applicable;
- source;
- territorial level;
- periodicity;
- direction of improvement;
- feasibility of obtaining the data;
- existence of baseline;
- justification of target.

Never invent a baseline.

Never invent a target merely to complete the interface.

If no baseline exists, state that it is pending or unavailable.

---

# 11. Local Health Plan — El Zaidín

For the Plan Local de Salud 2027–2030 de El Zaidín, preserve the currently established strategic context unless the user changes it explicitly.

The prioritised lines include:

- Envejecimiento saludable;
- Adicciones.

For Envejecimiento saludable, the working conceptual structure includes:

- Edadismo;
- Soledad no deseada;
- Autonomía;
- Participación.

The digital divide belongs under **Participación**, not Autonomía, unless explicitly revised.

Do not treat working drafts as final approved content unless they have been validated.

---

# 12. Documentation links

Where COMPAS_NG mentions a source document, report, strategy, profile or supporting file, prefer creating an accessible link to that document whenever the repository and deployment context allow it.

Do not present a document as available if the file cannot actually be opened.

---

# 13. Uploaded reports and local evidence

When a report has been uploaded to COMPAS_NG:

- confirm which file is actually present;
- avoid creating duplicate phantom entries;
- distinguish files that are viewable from files that are only removable;
- preserve the original document as the source of truth unless a transformed derivative is explicitly created.

Do not claim that a report exists merely because a database record or UI label exists if the underlying file is missing.

---

# 14. Data hierarchy

When multiple sources conflict, prefer:

1. verified local primary data;
2. validated local reports;
3. official administrative data;
4. official regional or national contextual data;
5. peer-reviewed literature;
6. secondary or illustrative sources.

Do not silently resolve conflicts. Surface them when they matter.

---

# 15. Interpretation

Always distinguish:

## Observed result
What the source or dataset actually shows.

## Interpretation
What COMPAS_NG infers from that result.

## Recommendation
What action, objective or strategic response is proposed.

Never present interpretation as observed fact.

Never present recommendation as if it were empirical evidence.

---

# 16. Evidence quality

When a claim depends on a source, ask:

> What exactly supports this claim?

A source may:

- document a finding;
- provide context;
- define a concept;
- establish a methodological rule;
- offer an alternative explanation;
- provide contrary evidence;
- justify a strategic recommendation.

Do not cite a source for a proposition it does not support.

---

# 17. User control over strategic content

Where the application presents strategic lines, objectives or indicators, preserve the user's ability to:

- select;
- reject;
- modify;
- replace;
- add;
- remove;

when the relevant workflow is intended to support deliberation.

Do not lock generated proposals as if they were validated decisions.

---

# 18. AI-generated content inside COMPAS_NG

AI assistance must not conceal uncertainty.

When generated content depends on incomplete evidence:

- state the limitation;
- avoid fabricated specificity;
- preserve editability;
- preserve provenance where feasible.

Generated text should support deliberation, not impersonate validated evidence.

---

# 19. Repository integrity

Before modifying code or content:

- inspect the relevant implementation;
- understand current state;
- identify the smallest coherent change;
- avoid parallel implementations;
- preserve existing valid behavior;
- check whether the source of truth already exists.

Do not solve a UI problem by creating duplicate data.

Do not create fallback content that masks missing backend or source data unless the fallback is explicitly intended and labelled.

---

# 20. Local versus remote repository

Treat GitHub as the canonical remote repository.

When working from a synchronized local or Drive-based checkout:

- confirm branch;
- confirm repository state;
- avoid assuming that a local copy is current;
- compare with remote before destructive or structural changes.

Do not claim that local and remote are synchronized without checking.

---

# 21. Git operations

Before commit:

- inspect diff;
- inspect status;
- verify only intended files changed;
- check generated files;
- run relevant tests or build checks.

Do not commit, push, merge or deploy without explicit authorization when the user has not already granted it for the current task.

When the user requests an audit without commit, stop after the audit.

---

# 22. Deployment verification

After deployment, verify the actual deployed behavior rather than assuming success from a completed pipeline.

Check, where relevant:

- main index;
- affected route;
- document links;
- data loading;
- Plan de Acción availability;
- visible terminology;
- absence of stale content.

A successful build is not equivalent to a correct deployment.

---

# 23. Terminology

Use project terminology consistently.

Examples:

- **IBSE**, not ISBE;
- Perfil de Salud Local;
- Lectura Estratégica Local;
- Plan de Acción;
- línea estratégica;
- objetivo;
- indicador;
- activo para la salud.

Do not silently rename established concepts.

---

# 24. No fabricated local knowledge

COMPAS_NG is designed to remain usable without relying on conversational memory.

Therefore:

- important project facts must live in the repository or data;
- do not make the application depend on facts remembered only from chat;
- if a rule matters operationally, encode or document it in the repo;
- if a source matters analytically, link or store it appropriately.

Conversational memory is not a valid project database.

---

# 25. Final validation checklist

Before considering a substantive COMPAS_NG change complete, verify:

- factual accuracy;
- source traceability;
- territorial attribution;
- temporal attribution;
- terminology;
- data/narrative consistency;
- no fabricated precision;
- no invented local results;
- correct distinction between instrument availability and application;
- correct stage: Perfil / Lectura / Plan;
- user editability where required;
- documentation links work;
- build/tests pass where applicable;
- deployed result matches intended behavior.

---

# 26. Final rule

COMPAS_NG must never create the appearance of knowledge that the project does not actually possess.

If evidence is missing, show the gap.
If evidence is contextual, label it as contextual.
If a proposal is provisional, keep it provisional.
If a value is unknown, do not invent it.

---

# 27. Discursive style as a product constraint

`docs/BLAS_WRITING_STYLE.md` governs substantive Spanish prose in COMPAS_NG.

Apply it to:

- interface text;
- report and profile prose;
- methodological and contractual documentation;
- generated-text templates;
- explanatory notes, warnings and captions;
- any prose that shapes how the user understands evidence, interpretation, uncertainty or action.

The goal is not to imitate a few phrases. It is to make COMPAS_NG write from analysis: precise, natural, attentive to implications, able to distinguish what matters, and intolerant of commonplaces, filler, bureaucratic padding, generic AI cadence and rhetorical polish that hides weak reasoning.

When there is tension between style and factual discipline, factual discipline prevails. A beautiful sentence that invents knowledge is still wrong.
