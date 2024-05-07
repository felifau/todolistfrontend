# todolistfrontend

Die Anwendung stellt eine To-Do-Liste dar. Zu den Grundfunktionalitäten der Anweundung zählen:

-Erstellen von Tasks
-Bearbeiten von Tasks, darunter: den Titel und die Beschreibung eines Tasks, Deadline hinzufügen, Task löschen
-Markieren von Tasks als "erledigt"
-Löschen von Tasks
Die Entity-Klasse ist ein Task, das folgende Variable hat: Titel (String), Beschreibung (String), Deadline (LocalDate)

Bei dem weiteren Projektverlauf ist geplannt (sortiert nach Priorität):

-Markieren von Tasks als "wichtig" (Sternchen)
-Implementierung von Listen von Tasks. Eine Liste umfasst mehrere Tasks. Bei Default wird ein Task einer "Grundliste" zu implementieren

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
