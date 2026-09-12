# Legacy frontend reference

Этот каталог — замороженный снимок прежнего фронтенда. Он нужен только для точечного поиска поведения, компонентов и Tailwind-вёрстки при написании нового кода в `frontend/src`.

## Правила работы

- Не импортируйте файлы из `_legacy` в актуальный `src` и не добавляйте `_legacy` в TypeScript, Vite, Vitest или Tailwind sources.
- Не поддерживайте, не форматируйте и не исправляйте legacy-код. Старые абсолютные импорты `@/...` после переноса намеренно могут не разрешаться.
- Не копируйте целые срезы. Найдите минимальный подходящий фрагмент и перепишите его с учётом новой архитектуры и текущих типов.
- Не обходите каталог целиком. Сначала выберите область по карте ниже, затем ищите через `rg` по имени компонента, видимому тексту, callback или Tailwind-классу.
- Сначала открывайте `index.ts` нужного среза и файл композиции, затем конкретный leaf-компонент. Тесты рядом используйте как описание поведения.

Примеры точечного поиска из `frontend`:

```sh
rg -n "Snowflake|Карта развития" _legacy/widgets/career-dashboard
rg -n "Импортировать другую схему" _legacy/features/import-career
rg -n "SettingsEditor|onSave" _legacy/features/edit-career _legacy/pages/career
```

## Карта каталогов

- `entities/career` — типы карьерного документа, Wails-клиент, операции с прогрессом, цвета треков и тестовая fixture.
- `pages/career` — композиция главного экрана и lifecycle загрузки, сохранения, импорта и экспорта.
- `widgets/career-dashboard` — SVG snowflake, геометрия и клавиатурная навигация, список треков и диалог уровня.
- `widgets/career-actions` — плавающая панель импорта, экспорта, темы и настроек.
- `features/manage-career-progress` — содержимое карточки/диалога уровня и изменение прогресса.
- `features/edit-career` — прежний полноценный редактор профиля и схемы, включая группы, треки и уровни.
- `features/template-form` — незавершённый альтернативный редактор схемы на React Hook Form и Zod.
- `features/import-career` и `features/toggle-theme` — диалог импорта и переключатель темы.
- `pages/settings` — незавершённые настройки и форма профиля.
- `shared/ui` — прежние примитивы shadcn/Base UI; `shared/lib` — `cn`; `shared/testing` — настройка Vitest.

## Основные цепочки композиции

- Главный экран: `pages/career/ui/CareerPage.tsx` → `widgets/career-dashboard` и `widgets/career-actions`.
- Snowflake: `CareerDashboard.tsx` → `CareerOverview.tsx` → `Snowflake.tsx` и `TrackList.tsx`.
- Детали уровня: `LevelDetailsDialog.tsx` → `features/manage-career-progress/ui/LevelDetails.tsx`.
- Редактор: `features/edit-career/ui/SettingsEditor.tsx` → `SchemaEditor.tsx` → редакторы групп, треков и уровней.
- Доступ к backend: `pages/career/model/use-career-session.ts` → `entities/career/api/client.ts` → `frontend/bindings`.
