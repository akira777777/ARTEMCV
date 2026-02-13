# Task Progress — OPTIMIZE

- [x] Проанализирована текущая точка входа и маршрутизация (`App.tsx`, `Home2026.tsx`, `vite.config.ts`).
- [x] Найдены узкие места начальной загрузки: синхронный импорт роутов и лишний `Suspense` для non-lazy Hero.
- [x] Внесены оптимизации:
  - `App.tsx`: `HomePage` и `Home2026` переведены на `React.lazy`, чтобы уменьшить initial JS для первого экрана.
  - `pages/Home2026.tsx`: удалён лишний `Suspense` вокруг `CinematicHero` (компонент не lazy), что снижает runtime-обвязку и убирает ненужный fallback-слой.
- [x] Выполнена верификация команд:
  - `npm run build` — failed в текущем окружении на pre-existing ошибке Vite HTML proxy (`index.html?html-proxy...`).
  - `npm run typecheck` — failed из-за большого количества pre-existing ошибок и отсутствующих модулей/типов вне scope текущей задачи.
- [x] Обновлён `walkthrough.md` по фактически внесённым оптимизациям.