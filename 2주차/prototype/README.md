# Wound Routine Player

Engineering CT 2주차 React prototype.

## Run

```powershell
npm install
npm run dev -- --port 5174
```

## Verify

```powershell
npm test
npm run build
```

## Concept

This prototype abstracts the shared structure of an hourglass and a wind-up music box:

- a finite resource is charged by a physical input;
- the resource is released over time through a regulator;
- progress is shown through a perceivable output pattern;
- completion happens automatically when the resource reaches zero.

The implemented interface is a wound routine player, not a direct simulation of either source object.

