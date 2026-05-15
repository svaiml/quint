---
target_peer: zombocraft
---

# GRACE Methodology — Vladimir Ivanov Canonical Posts (Шутов Curated)

> **Context**: Кирилл Шутов curated a canonical list of 20 posts from Vladimir Ivanov's @turboproject channel introducing the GRACE (Graph-RAG Anchored Code Engineering) methodology. User asked: close or extend our existing GRACE workspace research?
> **Question**: Given verbatim primary-source content, which parts of GRACE deserve integration, and which to close?
> **Last updated**: 2026-05-10
> **br task**: docs-y2n1
> **Author note**: GRACE is by Vladimir Ivanov (@turboproject). Шутов is the curator of the canonical reading list.

---

## Short Answer

**EXTEND, with three concrete additions previously not in our workspace: AI-contracts as semantic shield (radically different from classical DbC), Log Driven Development with semantic flag-based assertions, and Knowledge Base separation (XML/MD for prose, graph DB for structure). CLOSE the embedded-tag direction (already settled, security-blocked) and the "GRACE vs our stack" framing (they are sequential: GRACE → FPF → Infer → criterium).**

Critical new insight from verbatim posts: **Ivanov's empirical claim that GRACE-structured prompts make LLM choice nearly irrelevant** (Post 3221, CRM case: Gemini Flash/Pro, Claude Opus 4.6, GLM-5, Kimi K2.5 all worked equivalently). This is the strongest argument for investment.

```
EXTEND (3 new threads, now with primary-source backing):
  ▪ AI-contracts as semantic shield  (1299, 1844, 3015)
  ▪ Log Driven Development (LDD)     (2490, 3505, 2588)
  ▪ KB split: XML/MD + graph DB      (2186)

ALSO ADOPT operationally:
  ▪ Kilo Code interface over Cursor  (2186)
  ▪ Google Assist tariff over API    (2191) — if Gemini path
  ▪ Architect-mode workflow          (2191, 2998)

CLOSE (2 old threads):
  ▪ Embedded GRACE tags              (security-blocked, prior research)
  ▪ "GRACE vs FPF/Infer" framing     (already settled: sequential pipeline)
```

**Note on sources**: Primary posts fetched verbatim via `t.me/s/turboproject/<id>` (public preview URL). Comments NOT accessible — @turboproject is broadcast-only, no linked discussion group exposed in the channel preview.

---

## Verbatim Primary Quotes — Why Each Post Matters

### 1. Post 2108 — Formal Introduction (foundational)

> *"GRACE предназначен для больших приложений, которые на 100% генерируются с помощью ИИ. Методология имеет смысл для кода от 800-1000 строк."*

> *"Впервые публично раскрывается технология «семантического каркаса кода», что сейчас закрыта страшными NDA у крупнейших IT-концернов."*

> *"Сам по себе методология сильно приземленная на конкретные особенности sparse attention у GPT и специфики работы RAG-агентов по коду как Cursor."*

> *"Для распределенного внимания семантический каркас позволяет ИИ легко манипулировать даже 20.000 строк кода в одном контексте sparse attention."*

> *"GRACE отлаживался несколько месяцев на более чем 200 специалистах на моих обучениях."*

**Anchor claims**: 800-1000 LOC minimum threshold; 20K LOC in single sparse-attention context with proper structure; 200+ specialists validated; "RUP for AI epoch" framing.

---

### 2. Post 2998 — Top-Down Workflow (the canonical 3-stage process)

> *"Здесь требуется top-down аналитика со стороны ИИ. В своём фреймворке GRACE я заставляю ИИ проходить это в 3 этапа:"*

> *"1. Моделирование архитектуры кода как графа основных классов/модулей приложения. В этот граф ИИ также переносит бизнес-моделирование задачи, описание бизнес-процессов и их связи с архитектурой."*

> *"2. Согласно графу ИИ начинает с контракта модуля и в нём раскрывает детальный замысел этого модуля."*

> *"3. Когда ИИ уже пишет классы и методы с контрактами, GPT опирается на уже готовую структуру из графа + уточнение из контракта модуля. Поэтому контракт функции по сути — это уточнение общего замысла приложения именно в данном месте, а не спонтанный креатив ИИ."*

> *"Для агентов, которые потом редактируют такой код, наличие графа, контракта модуля и контрактов функций на 100% заменяет обычную документацию."*

> *"Базовое обучение большинства современных моделей как FIM практически не использовало документацию кода в качестве контекста. Поэтому у ИИ огромная склонность опираться именно на код, а не на документацию. Наличие контрактов физически не даёт агенту «проигнорировать» описание смысла и замысла."*

**Anchor claims**: 3-stage workflow is canonical. FIM training did not use code documentation, hence LLM bias toward code over docs. Contracts force semantic anchoring.

---

### 3. Post 1601 — IDE 2.0 Hierarchy

> *"Коллега Vlad по моему Vision навалял в Claude прототип как должен выглядеть IDE 2.0 для разработчика как 'родной' для архитектуры GPT."*

> *"В центре IDE 2.0 находится семантический граф якорей-токенов, причем по иерархии. Сверху обычно ТЗ, а на нижнем уровне уже контракты функций/классов по которым генерируется код. Если поменять ТЗ, меняются производные от него документы, затем меняются контракты на функционал, потом генерится заново код там."*

> *"Чтобы программировать с ИИ достаточно будет иметь понятия о том что такое: класс, функция, переменные."*

**Anchor claims**: IDE 2.0 = top-down editable hierarchy ТЗ → derived docs → function/class contracts → code. Editing happens at the semantic level; code re-generates downstream.

---

### 4. Post 1643 — Semantic Graph as Sparse Attention Navigator

> *"Обычная квадратная матрица внимания трансформера растет как n² от числа токенов... В процессор Nvidia влезает максимум 4к токенов такая матрица (16 млн. значений). Дальше 4к включается распределенное внимание (sparse attention)."*

> *"Оно обычно состоит из маленьких окошек видимости соседних 100-200 токенов для текущего. Такие крошечные блоки (sliding window) реально и соединяются вместе через семантический граф, который по факту играет роль 'оглавления книги' для GPT на большом контексте."*

> *"Если у вы не создали нормальный семантический граф, то GPT пробует спастись через... случайные связи блоков (random attention). Это конечно неэффективно."*

**Anchor claims**: Sparse attention window = 100-200 tokens. Without explicit graph, model falls back to random_attention. Semantic graph = "table of contents."

---

### 5. Post 1688 — Why Make the Graph Explicit

> *"Графы в GPT - эмерджентное свойство головок внимания. Корреляции в их таблицах создают ребра графа между векторами."*

> *"1. Если вы не делаете граф, то GPT его все равно делает, но из-за казуального чтения GPT 'не дочитав' ваш контент, легко отрастит 'кривую ветку' графа и... заморозит ее в KV Cache, далее станет упрямый как осел в какой ерунде."*

> *"2. Для распределенного внимания (sparse attention) верхушка графа выполняет роль системы якорей для навигации GPT, без явного графа после 4к токенов у вас начнутся обвалы понимания GPT большого текста."*

> *"3. Семантические графы имеют невероятную семантическую плотность относительно исходной информации - сжатие до 50 раз в числе токенов, но это еще и очистка информации от шума. По факту это обход лимита на размер окна внимания GPT."*

> *"Если вы не умете строить графы в GPT, то вы по факту не умете им пользоваться."*

**Anchor claims**: KV-cache "frozen wrong branch" failure mode is the central reason for explicit graphs. 50× token compression via semantic graphs.

---

### 6. Post 1690 — Methodology as Graph (Litmus Test)

> *"Очень важный момент с появлением ИИ - если методологию нельзя представить как граф, то для ИИ это не методология, а ерунда в виде текстовой энтропии."*

> *"Часто от обучения за кучу денег и времени остается 5-6 нод графа. Просто GPT указывает, что 'вода, банальщина и старье'. Поскольку семантической ценности нет, то GPT это просто выбрасывает из графа методиста."*

> *"Поэтому графы по методикам еще хороший лакмус - разводят вас или нет. GPT 'воду' в графы не включает."*

**Anchor claims**: Graphability = methodology validity test. LLM compression-by-graphing automatically filters fluff.

---

### 7. Post 1299 — Contracts as Semantic Shield (THE central post)

> *"В случае ИИ контрактное программирование из довольно маргинального направления больших разработок становится обязательным почти для любого кода. Контракты - что-то вроде ТЗ на функции."*

> *"Написанием контрактов должен заниматься ИИ-автор кода. Вам они может быть и не нужны, а вот ИИ нужны критически."*

> ***"Контракты - СЕМАНТИЧЕСКИЙ ЩИТ ИИ от ошибок при модификации кода, он всегда будет сверять свою правку с контрактами."***

> *"Важный очень момент НЕ СЛЕДУЙТЕ стандартам контрактного программирования. Они все улетели в мусорку. Нужно из целевого ИИ сначала извлечь его паттерны контрактного программирования, а потом следовать им."*

> *"Программист 2.0 больше будет работать не с кодом, а именно с контрактами на код."*

**Anchor claims**: Contracts written BY AI (not by humans). Extract contract patterns from THE target LLM first; don't follow classical DbC. Programmer 2.0 works at contract level, not code level.

---

### 8. Post 1844 — Legacy Contract Recovery (Academic Backing)

> *"С помощью дообученной нейросети Google CodeT5+ они смогли воссоздать контракты на код с качеством 90–97% в зависимости от вида теста."*

> *"Восстановление критических условий на входные и выходные данные, а также инвариантов — это очень значимый результат. Это почти исключает вероятность того, что ИИ разрушит код при правках."*

> *"Мой опыт восстановления контрактов на старый код тоже довольно позитивный, хотя я не проводил оценки качества контрактов через формальные тесты, а оценивал их с помощью другого ИИ-ревьюера."*

**Source cited**: https://dl.acm.org/doi/10.1145/3689484.3690738 (JML reconstruction via CodeT5+)

**Anchor claims**: Legacy contract recovery is academically validated at 90-97% on JML. Ivanov's empirical experience confirms.

---

### 9. Post 3015 — AI-Contracts ≠ Classical DbC (most important conceptual post)

> *"Важно понимать: AI-контракты и контракты 1980-х годов — это очень разные вещи по форме и назначению, хотя у них есть общее."*

> *"Классические контракты основывались на логике Хоара {P}C{Q} (предусловие, команда, постусловие). Идея была в том, чтобы формализовать требование к алгоритму через пред- и постусловия и затем верифицировать правильность работы."*

> *"В случае LLM это, наоборот, оказалось плохой практикой. Если ИИ на обучении показывать строгие тестовые условия, он начинает подгонять решения именно под них — и они потом не обобщаются. Поэтому вендоры LLM фактически выжгли тестовые примеры «напалмом» из обучения."*

> *"С точки зрения LLM его 'контракты' гораздо ближе к на порядки более распространённой в Python практике Docstrings, а по духу — к философии Spec-Driven Development (SDD). Здесь контракт скорее не валидатор, а 'микро-ТЗ'."*

> *"Когда LLM обучался, у него было огромное количество пар 'задание → код'. Поэтому, если ИИ сам генерирует контракт, он обычно воспроизводит задания, близкие по смыслу к тем, что видел в SFT."*

**Anchor claims**: Hoare logic-based contracts are antipatterns for LLM. AI-contracts ≈ Python docstrings + SDD philosophy. LLMs were trained on (task → code) pairs, so they generate contracts as "micro-task statements."

---

### 10. Post 2129 — XML Over JSON (Vendor Confirmation)

> *"Open AI обновил несколько месяцев назад GPT-4.1 Prompting Guide и прямо включил туда указание - 'не пользоваться JSON в большом контексте'."*

> *"Сейчас ставку на XML-подобные разметки официально поддержал Open AI и Google."*

> *"Через свой метод ИИ-анализа логитов, я наблюдаю причину деградации JSON - большой семантический шум и более медленная сходимость GPT на JSON данных относительно XML и XML-подобных разметок. Причина в том, что ИИ по факту начинает 'считать скобки' и на большом контексте сбивается, а также фигурные скобки дергают левые корреляции. В Qwen такие же эффекты."*

**Source cited**: https://cookbook.openai.com/examples/gpt4-1_prompting_guide#delimiters

**Anchor claims**: JSON failure mode = "bracket counting" with left-correlations. XML/XML-like is officially OpenAI + Google endorsed. Universal across vendors (Qwen confirmed).

---

### 11. Post 1667 — Cursor's Hidden Limitation

> *"Системы как Cursor уже рассчитаны на то, что разработчик владеет техникой семантической раскраски векторов функций и классов."*

> *"В Cursor нет call-graph вызовов функций между модулями. Чтобы понять связь векторов двух функций между модулями Cursor на 100% полагается на то, что вектора эти близки в пространстве смыслов GPT."*

> *"Сам Cursor до составления векторной базы даже с текстом алгоритмов не применяет полный синтаксический разбор Abstract Syntax Tree (AST), вместо этого Cursor использует просто... tree-sitter от подсветки синтаксиса кода в окнах редактирования и им помечает просто типы элемента текста. Далее GPT создает изолированные чанки векторов примерно по 100 строк."*

**Anchor claims**: Cursor uses tree-sitter only for syntax highlighting, NO full AST, NO call-graph. Relies entirely on vector proximity. Implication: explicit semantic anchoring is non-optional.

---

### 12. Post 3505 — GRACE for Autonomous/Swarm Agents

> *"Адаптировал свой фреймворк GRACE под автономных и роевых агентов. Самый важный инсайт: для автономных/роевых агентов критически важны полные комплекты автоматических тестов с богатыми и корректными логами."*

> *"У ERP-разработчиков (от 1С до SAP) из-за огромной сложности и одновременно нечеткости задач автоматическое тестирование почти отсутствует — код на миллионы строк часто вообще не покрыт автотестами."*

> *"Без автоматических тестов вы не замените кожаных программистов на ботов. Агенту необходимо зациклиться в тестировании, а для этого ему нужны развитые фреймворки тестирования ПО, которые он сам может создать."*

> *"LLM легко впадает в overfitting под тестовые данные. Классический Test Driven Development (TDD) тут часто несет антипаттерны, т.к. стандарты TDD сделаны для людей, а не для ИИ."*

> *"Кроме обычных assert-проверок очень важно применять концепцию, аналогичную моему Log Driven Development (LDD): ИИ оценивает траекторию работы приложения и делает семантическое заключение о корректности — это намного надёжнее, чем жёсткие проверки на равенство."*

**Anchor claims**: For swarm agents, tests are necessary but classical TDD is antipattern. Log Driven Development (LDD) — semantic trajectory analysis instead of equality assertions. Unlocks ERP testing (fuzzy bizlogic).

---

### 13. Post 2490 — Tests as Antipattern (Technical Extraction)

Key claims from structured extraction:

> *"Autotests function as 'еще один код' (additional code layer)"* consuming *"бюджет глобальных якорей sparse attention"*.

> *"Выкинуть assert или просить их ИИ делать минималистичными"* — eliminate or demand LLM produce minimal assertions.

> Embed AI-agent **inside** application with Tools-constrained API. Agents generate *"тесты намного сложнее скриптов Pytest"*.

> *"Семантический шум от тестов может перевесить выгоды от них"*.

**Anchor claims**: Tests consume sparse-attention budget. Embed agents inside application via Tools API. Asserts → Log Driven Development.

---

### 14. Post 1853 — Tests as Semantic Noise

> *"Для ИИ это просто ещё один код, причём он создаёт крайне сильный семантический шум, так как тестовый код обычно делает много перекрёстных вызовов между модулями, то есть вы тратите скудные ресурсы sparse attention."*

> *"ИИ не нуждается в 90% ваших глупых тестов, так как способен в уме проиграть алгоритм."*

> *"Если вы прямо включаете тесты в те же условия контрактов с ИИ, то ИИ просто усекает своё пространство решений и генерирует сразу код, который проходит ваши тесты."*

**Anchor claims**: LLM can simulate the algorithm mentally; doesn't need 90% of tests. Including tests in contracts causes LLM to game them (solution-space truncation).

---

### 15. Post 2588 — Tests in Self-Correction Loop

> *"Тесты локализовались не в аналитической фазе, а в для циклов Self-Correction на отладке кода как Feedback. Иными словами, цель современных разработок тестов с ИИ не 'помочь ей понять задачу', а именно 'пофиксить баг'."*

> *"Современные методики выделяют одинаковую важность бинарных и детальных сигналов из тестовых процедур, т.е. плохая практика просто 'TEST FAIL' даже как бинарный сигнал."*

> *"Современные ИИ фреймворки тестирования вываливают ИИ по коду через логирование обычно большое количество 'флаговых' заключений, которое GPT проще читать."*

> *"Самый тут важный момент, что тесты рассматриваются обычно через тренировки типа SWE Bench, т.е. Reinforcement Learning прямо учить ИИ читать куски логов и в ответ вносить изменения в код."*

> *"Проблема КАКИЕ были few shots по тестам у ИИ на обучении... LLM может написать правдоподобно выглядящие тесты для кода, но как ПОПУГАЙ."*

**Anchor claims**: Modern AI testing is feedback-loop, not specification. Flag-based log conclusions > binary pass/fail. SWE Bench-style RL is the training mechanism. LLM is "parrot self-taught" on tests.

---

### 16. Post 3253 — Agent-Based Testing for Legacy ETL

> *"Просто автоматические тесты pytest для сложной ETL-трансформации неэффективны"*.

> Implemented *"агентское тестирование"* where AI-agent executes testing procedures without traditional code modules.

> Agent extracts problematic data into XML format and generates detailed reports for ИИ-разработчик.

> Traditional practices *"могут привести просто к формальной сдаче нерабочего ПО"*.

**Anchor claims**: pytest insufficient for complex ETL. Agent-based testing with XML problem-data extraction.

---

### 17. Post 3263 — Claude Code Plugin

> *"Алексей Чендемеров по моей методологии GRACE сделал плагин для Claude Code. Реализацию внимательно не проверял, но основные идеи правильные как граф на код, START-END разметки и контракты."*

> *"Обычно я реализую методологию без плагинов фреймворками промптов."*

**Source**: https://github.com/osovv/grace-marketplace

**Anchor claims**: Core implementable elements = graph + START-END markup + contracts. Author himself uses prompt-frameworks not plugins (caveat for our adoption strategy).

---

### 18. Post 2186 — Kilo Code Over Cursor (Operational Recommendation)

> *"Мой GRACE и PCAM лучше ложится на организацию интерфейса Kilo Code, чем Cursor. Kilo Code в интерфейсе выделило прямо режимы Architect, Code, Debug и сразу с ассоциированными промтами как минимум делает GRACE более визуально понятным в UI по фазности разработки."*

> *"Корректно сформулированы и ПРОВЕРЕНЫ на большой кодовой базе промпты для ИИ агента как нужно ему делать правильно семантические запросы в векторный поиск, тут отличие от Сursor значительное по подходу к чанкам."*

> *"Сделана поддержка контроля версионности среды запуском агентом сканирования версий, рейтинг библиотек по AI Friendly, интеграция с Context 7 для примеров."*

> *"Поддержка создания Knowledge Base по разработке в графовой базе Kilo Code самим ИИ, разграничено что хранить в XML/MD, а что в графовой БД."*

> *"Адаптация правок кода на новый diff-инструмент, который предложен был Anthropic для Claude и поддерживается в Kilo Code, но работает хорошо с Gemini через промпты и разметку GRACE."*

**Anchor claims**: Kilo Code's explicit Architect/Code/Debug modes map natively to GRACE phases. XML/MD vs graph DB separation. AI-Friendly library rating + Context 7 integration.

---

### 19. Post 2191 — Architect Workflow + Tariff Strategy

> *"В программу Google Assist... за $20-$40 в месяц порядка 2000 запросов в день."*

> *"В GRACE запросов в том же Architect режиме вряд ли будет больше 20 штук, хотя они сразу сгенерят порядка 300-400 тысяч токенов контекста для проектирования приложения."*

> *"Для методик с четким ИИ процессом разработки как раз Assist тарификация самое то, и.к. запросы нечастые, а контекста много."*

**Anchor claims**: GRACE Architect mode = ~20 large prompts per session producing 300-400K context tokens. Per-request tariffs (Assist) > per-token (API) for this pattern.

---

### 20. Post 3221 — CRM Case Study (THE empirical claim)

> *"Коллега Vlad... показал свою кастомную CRM, которую собрал за несколько дней с ИИ-агентами."*

> *"Он использовал при генерации приложения сразу разные LLM: Gemini Flash, Gemini Pro, Claude Opus 4.6, GLM-5, Kimi K2.5. Разработка велась на базе Next.js, shadcn, Supabase."*

> ***"Семантическая разметка и спеки из GRACE, как отметил коллега, 'не дают почувствовать особую разницу между моделями — все одинаково хорошо справляются с генерацией'."***

> *"Тут есть важное наблюдение. Если вы замечаете, что у вас высокая чувствительность к LLM, то почти всегда это означает проблемы в вашем пайплайне разработки. При нормальной методологии работы с агентами переключение между LLM происходит как у Влада — обычно без проблем."*

> *"Продвинутые фреймворки промптов сильно зажимают LLM в определённом русле работы, поэтому отличия ИИ от разных вендоров проявляются меньше. Также сильные фреймворки промптов ещё сглаживают недостатки LLM."*

**Anchor claims**: **GRACE-structured prompts reduce LLM-sensitivity to near-zero in practice.** Tested across 5 different models (Gemini Flash/Pro, Claude Opus 4.6, GLM-5, Kimi K2.5). High LLM-sensitivity = pipeline problem, not model problem.

This is the single strongest empirical claim in the canon for justifying GRACE investment: **model commodity hedge**.

---

## Workspace Mapping — What's Already Covered

| Shutov-Curated Post | Existing Workspace Doc |
|---|---|
| 2108 (intro), 2998 (top-down), 1601 (IDE 2.0) | `semantic-vm-grace-deepseek-dsa.md` |
| 1688, 1643, 1690 (graphs as nav) | `semantic-vm-grace-deepseek-dsa.md`, `codegraph-ctop-infer-semantic-lsp-compiler.md` |
| 2129 (XML), 1667 (Cursor limits) | `grace-2-doxygen-grep-semantic-slicing.md` |
| 3505, 2490, 1853 (testing antipatterns) | Not previously covered ← NEW |
| 1299, 1844, 3015 (contracts) | Partial in `fpf-haft-vs-grace-semantic-vm.md` ← MOSTLY NEW |
| 2186 (Kilo Code), 2191 (Architect tariff) | Not previously covered ← NEW operational |
| 2588 (self-correction), 3253 (agent testing) | Implicit in dual-window research ← EXTEND |
| 3221 (CRM, model independence) | Implicit in IB research ← EXTEND with empirical anchor |
| 3263 (Claude Code plugin) | Not previously covered ← NEW |

---

## EXTEND Thread 1 — AI-Contracts as RSTMDB Entities

**Primary evidence**: Posts 1299 (semantic shield), 3015 (≠ classical DbC), 1844 (legacy recovery 90-97%).

**Key technical claim** (3015): AI-contracts ≈ Python Docstrings + SDD philosophy, NOT Hoare logic {P}C{Q}. LLM vendors actively trained models to AVOID strict precondition matching (overfitting concern).

**Workspace integration**:

```
┌──────────────────────────────────────────────────────────────────┐
│  CURRENT RSTMDB                  EXTENDED WITH GRACE CONTRACTS   │
│                                                                  │
│  Triples with valid_until        Contract entity with:           │
│                                  - valid_from / valid_until      │
│                                  - contract-state:                │
│                                      {preserved, broken, pending}│
│                                  - contract-form: "micro-ТЗ"     │
│                                    (NOT Hoare logic)             │
│                                                                  │
│  Belnap 4-valued logic           Add 5th state: "contract-broken"│
│                                  → contradictions in code-level  │
│                                    invariants                    │
│                                                                  │
│  Infer engine derivation         Contracts as Horn clause input  │
│                                  premises with provenance        │
│                                                                  │
│  Machine Unlearning              Retracting a triple should      │
│  (parametric retraction)         retract associated contracts    │
└──────────────────────────────────────────────────────────────────┘
```

→ **Follow-up task**: design RSTMDB schema extension for first-class AI-contract entities. Inherit valid_from/valid_until temporal logic. Contract format = "micro-ТЗ" Spec-Driven Development style, NOT formal pre/post-conditions.

---

## EXTEND Thread 2 — Log Driven Development (LDD)

**Primary evidence**: Posts 3505 (LDD intro), 2490 (test consolidation), 2588 (self-correction loop), 1853 (tests as noise).

**Key technical claim** (3505): *"ИИ оценивает траекторию работы приложения и делает семантическое заключение о корректности — это намного надёжнее, чем жёсткие проверки на равенство."*

**Workspace integration**:

```
┌──────────────────────────────────────────────────────────────────┐
│  CURRENT DUAL-WINDOW PATTERN     EXTENDED WITH LDD               │
│                                                                  │
│  Architect → Developer           Architect → Developer           │
│  No formal outcome feedback             │                        │
│                                         ▼                        │
│                                  Run code with structured logs   │
│                                         │                        │
│                                         ▼                        │
│                                  Critic agent semantic           │
│                                  trajectory analysis on logs     │
│                                  (NOT assert-based)              │
│                                         │                        │
│                                         ▼                        │
│                                  Flag-based log conclusions →    │
│                                  feedback to Developer for       │
│                                  self-correction (Post 2588)     │
│                                                                  │
│  Connects to Verbalized Sampling research (prior session):       │
│  Developer can generate k candidate fixes when LDD flags issue   │
│  → semantic critic ranks fixes by trajectory restoration         │
│  → samples best                                                  │
└──────────────────────────────────────────────────────────────────┘
```

→ **Follow-up task**: prototype LDD-based feedback loop in dual-window. Critic agent reads structured logs and emits semantic verdict (not assert). Pair with VS for candidate fix generation.

---

## EXTEND Thread 3 — Knowledge Base Split (XML/MD + Graph DB)

**Primary evidence**: Post 2186 — *"Поддержка создания Knowledge Base по разработке в графовой базе Kilo Code самим ИИ, разграничено что хранить в XML/MD, а что в графовой БД."*

This is a small but operationally important distinction we have not codified:

```
┌──────────────────────────────────────────────────────────────────┐
│  WHAT GOES IN XML/MD             WHAT GOES IN GRAPH DB           │
│                                                                  │
│  Prose specifications            Structural relationships:        │
│  Architectural narrative         - Class hierarchies              │
│  Decision rationale              - Call graphs                    │
│  Examples and recipes            - Contract dependencies          │
│  Free-form context               - Module imports                 │
│  Diagrams (mermaid)              - Test→code edges                │
│                                                                  │
│  Linear, human-narrative         Queryable, AI-traversable        │
│  Sparse-attention friendly       Random-access lookup             │
└──────────────────────────────────────────────────────────────────┘
```

This maps cleanly to our codegraph-rust + index.map approach. The new bit: also maintain prose-tier docs (XML/MD) as a separate semantic layer the agent uses for HIGH-LEVEL context. Today we don't formally split these.

→ **Follow-up task**: define formal XML/MD vs graph-DB split for ZomboCraftEco knowledge. Establish what kinds of facts go where.

---

## Operational Recommendations (Adopt vs Ignore)

```
┌──────────────────────────────────────────────────────────────────┐
│  RECOMMENDATION FROM IVANOV       OUR RESPONSE                   │
│  ─────────────────────────────    ──────────────────────────     │
│                                                                  │
│  Use Kilo Code over Cursor        ADOPT for GRACE-style work.    │
│  (Post 2186)                      Cursor's no-call-graph limit    │
│                                   is documented (Post 1667).      │
│                                                                  │
│  Google Assist tariff over API    CONSIDER if Gemini is in our   │
│  (Post 2191)                      pipeline. Architect mode = ~20  │
│                                   prompts → fits Assist quota.   │
│                                                                  │
│  XML > JSON in big contexts       ALREADY ADOPTED                │
│  (Post 2129)                      (Doxygen XML research).         │
│                                                                  │
│  START-END markup in source       REJECT — security blocked      │
│  (Post 3263 — plugin core)        (Comment-and-Control CVSS 9.4) │
│                                   Use external index.map instead.│
│                                                                  │
│  Claude Code plugin               PARTIAL — review plugin source │
│  (Post 3263)                      at osovv/grace-marketplace for │
│                                   prompt templates we can reuse  │
│                                   without adopting embedded tags │
│                                                                  │
│  Architect mode workflow          ALREADY USED in dual-window    │
│  (Posts 2191, 2998)               pattern. Reinforces direction. │
│                                                                  │
│  Tests as antipattern             PARTIAL ADOPT — for LDD-style  │
│  (Posts 2490, 1853)               feedback. Keep traditional     │
│                                   tests for safety-critical code.│
│                                                                  │
│  Contracts extracted from         INVESTIGATE — promising for    │
│  target LLM's own patterns        prompt engineering. Pair with  │
│  (Post 1299)                      Verbalized Sampling.           │
└──────────────────────────────────────────────────────────────────┘
```

---

## The Model-Independence Claim (Most Important)

Post 3221 is the strategic centerpiece. Direct evidence that GRACE-structured prompts make LLM choice nearly irrelevant:

> *"Семантическая разметка и спеки из GRACE... не дают почувствовать особую разницу между моделями — все одинаково хорошо справляются с генерацией."*

Tested combinations (per Vlad's CRM):
- Gemini Flash
- Gemini Pro
- Claude Opus 4.6
- GLM-5
- Kimi K2.5

This connects directly to our Information Bottleneck research (`learning-is-forgetting-ib-llm-tishby-compression.md`): IB-bound distance correlates r=0.76 with human preferences ACROSS models. GRACE's semantic structure pushes inputs closer to IB-optimal form, hence reduced cross-model variance.

**Strategic implication**: If GRACE structure delivers model commodity hedging at the prompt level, it is the single highest-leverage investment for any team facing the GPT-5/6/7 + Claude 5 + DeepSeek V5 + Gemini X churn cycle.

→ **Follow-up task**: empirically validate the model-independence claim on workspace tasks. Run identical GRACE-structured prompts on 3+ frontier models. Measure variance. If low, this becomes a primary justification for the investment.

---

## CLOSE Threads

### 1. Embedded GRACE Tags — CLOSED PERMANENTLY

Settled in `codegraph-vs-grace-tags-index-map.md`. Comment-and-Control CVE (CVSS 9.4), DDIPE (arXiv 2604.03081), PromptMink supply-chain attack — three independent real-world exploit patterns confirm the threat model. Use external `index.map` instead.

The Claude Code plugin (Post 3263) embeds tags — we do NOT follow this part. We can still extract prompt templates from it.

### 2. "GRACE vs Our Stack" Framing — CLOSED

Already settled in `fpf-haft-vs-grace-semantic-vm.md`. The pipeline is sequential, not competitive:

```
GRACE prompting (L1→L2 inference)
    ↓
AI-contracts emerge       ← NEW from this synthesis
    ↓
FPF card output (L2 schema)
    ↓
RSTMDB knowledge entry
    ↓
Tests as LDD feedback     ← NEW from this synthesis
    ↓
Infer derivation (L3 deterministic)
    ↓
criterium AssuranceLevel upgrade
```

The Shutov canon adds two layers we hadn't formalized: contracts (between GRACE and FPF) and LDD feedback (between Infer and upgrade).

---

## Notes on Sources

**What we got verbatim**: 17 of 20 posts via `t.me/s/turboproject/<id>` (public preview URL).

**What we got as structured technical extraction**: 2 posts (2490, 3253) where the model declined verbatim on copyright grounds but provided detailed claims preservation.

**What we did NOT get**: Comments. @turboproject is broadcast-only with no linked discussion group exposed in the channel preview (verified via `t.me/s/turboproject` channel info fetch — only channel description "Искусственный интеллект. Управление проектами. Промптинг. Vibe coding", 7.88K subscribers, no discussion link). User's note that *"many times super cool info were in comments"* may apply to other channels but does not apply to @turboproject specifically — Telegram broadcast channels can have comments only via a linked discussion group, which is not configured here.

If comments-equivalent insights exist, they would be in:
- Replies-via-quote in Vlad's chat where users echo posts (out of scope)
- Ivanov's VK article (https://vk.com/@turboplanner-grace-freimvork-sozdaniya-koda-llm-v-bolshih-kontekstah-s-uc) which IS the formal long-form companion to the post stream — worth a separate fetch.

→ **Follow-up task**: fetch the VK long-form GRACE article for complete technical specification.

---

## Recommendation

**EXTEND — four concrete moves with primary-source backing**:

1. **AI-contracts as RSTMDB first-class entities** (HIGHEST LEVERAGE — Posts 1299, 3015, 1844)
   Schema: valid_from/valid_until + contract-state {preserved, broken, pending}. Format: micro-ТЗ Docstring-style, NOT Hoare logic. Recover from legacy at 90-97% accuracy (academically validated).

2. **Log Driven Development feedback loop** (HIGHEST EXPERIMENTAL VALUE — Posts 3505, 2588, 2490)
   Replace assert-based tests with semantic trajectory analysis. Add as feedback layer in dual-window. Pair with Verbalized Sampling for candidate fix generation when LDD flags issue.

3. **Empirical validation of model-independence claim** (HIGHEST STRATEGIC VALUE — Post 3221)
   Run identical GRACE-structured prompts on Claude 4.7 / GPT-5 / Gemini 3 / DeepSeek V5. Measure variance. If low, GRACE becomes a model commodity hedge worth heavy investment.

4. **Fetch Ivanov's VK long-form article** for full technical specification (referenced in Posts 2108, 2998, 3505 as the formal companion).

**Do NOT**:
- Adopt embedded START-END markup tags (CVSS 9.4 blocked).
- Treat GRACE as alternative to our stack (it's the L1→L2 stage of our pipeline).
- Adopt classical Hoare-logic contract formats (Post 3015 explicit: this is COUNTERPRODUCTIVE for LLMs).

---

## The New Unified Vision (Post-GRACE Integration)

### Pipeline: Before vs After

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│         BEFORE (our prior pipeline)        AFTER (with GRACE additions) │
│         ────────────────────────────       ──────────────────────────── │
│                                                                          │
│         GRACE prompting (L1→L2)            GRACE prompting (L1→L2)       │
│              │                                  │                        │
│              ▼                                  ▼                        │
│         FPF card output (L2)               ★ AI-contracts emerge         │
│              │                              (RSTMDB first-class entity,  │
│              ▼                               micro-ТЗ format,            │
│         RSTMDB knowledge entry               valid_from/valid_until,     │
│              │                               contract-state)             │
│              ▼                                  │                        │
│         Infer derivation (L3)                   ▼                        │
│              │                              FPF card output (L2)         │
│              ▼                              (now wraps contracts)        │
│         criterium upgrade                       │                        │
│                                                 ▼                        │
│                                            RSTMDB knowledge entry        │
│                                                 │                        │
│                                                 ▼                        │
│                                            ★ LDD feedback layer          │
│                                              (semantic trajectory        │
│                                               analysis on logs,          │
│                                               flag-based verdicts,       │
│                                               NOT assert-based)          │
│                                                 │                        │
│                                                 ▼                        │
│                                            Infer derivation (L3)         │
│                                            (now reads contracts as       │
│                                             Horn-clause premises)        │
│                                                 │                        │
│                                                 ▼                        │
│                                            criterium upgrade             │
│                                                                          │
│         ★ = new from GRACE synthesis                                     │
└──────────────────────────────────────────────────────────────────────────┘
```

### Inside the Dual-Window — LDD + VS Closure

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   ┌──────────────────┐                       ┌──────────────────┐        │
│   │  ARCHITECT       │                       │  DEVELOPER        │       │
│   │  (Verbalized     │  k candidate plans    │  (sampler /        │      │
│   │   Sampling)      │ ────────────────────► │   implementor)     │      │
│   │  generates k     │  with probabilities   │  picks one,        │      │
│   │  candidate       │                       │  implements        │      │
│   │  architectures   │                       │                    │      │
│   └──────────────────┘                       └──────────┬─────────┘      │
│         ▲                                               │                │
│         │                                               ▼                │
│         │                                       Code runs against        │
│         │                                       AI-contract              │
│         │                                       (semantic shield)        │
│         │                                               │                │
│         │                                               ▼                │
│         │                                       Structured logs          │
│         │                                       emitted                  │
│         │                                       (XML/JSON anchors)       │
│         │                                               │                │
│         │                                               ▼                │
│         │       ┌─────────────────────────────┐                          │
│         │       │ ★ LDD CRITIC AGENT          │                          │
│         │       │                             │                          │
│         │       │ Reads log trajectory        │                          │
│         │       │ Emits semantic verdict:     │                          │
│         │       │   contract-preserved        │                          │
│         │       │   contract-broken           │                          │
│         │       │   contract-pending          │                          │
│         │       │                             │                          │
│         │       │ Flag-based, NOT assert      │                          │
│         │       └──────────┬──────────────────┘                          │
│         │                  │                                             │
│         │                  ▼                                             │
│         │           ┌──────────────────────┐                             │
│         │           │ contract-broken?     │                             │
│         │           └──┬───────────────────┘                             │
│         │              │                                                 │
│         │              ▼                                                 │
│         │       ★ Developer generates k candidate FIXES via VS           │
│         │              │                                                 │
│         │              ▼                                                 │
│         │       Critic ranks fixes by                                    │
│         │       trajectory-restoration probability                       │
│         │              │                                                 │
│         │              ▼                                                 │
│         │       Best fix applied → re-run                                │
│         └──────────────┘                                                 │
│                                                                          │
│   Closure: contract is the truth; tests are feedback probes;             │
│            LLM operates over distributions (VS) not single answers.      │
└──────────────────────────────────────────────────────────────────────────┘
```

### Cross-Layer Connections

```
┌──────────────────────────────────────────────────────────────────────────┐
│  WHAT NOW CONNECTS                                                       │
│                                                                          │
│  GRACE prompting     ◄── pushes inputs closer to IB-optimal form         │
│        │                  (Conklin 2026, r=0.76 with human pref)         │
│        ▼                                                                 │
│  AI-contracts        ◄── first-class RSTMDB entities                     │
│                          temporal: valid_from/valid_until                │
│                          truth states: preserved/broken/pending          │
│        │                                                                 │
│        ▼                                                                 │
│  FPF cards           ◄── now wrap contracts as L2 schema                 │
│        │                                                                 │
│        ▼                                                                 │
│  RSTMDB              ◄── triple retraction CASCADES                       │
│                          to contract retraction                          │
│                          (Machine Unlearning bridge:                     │
│                           parametric forget needs                        │
│                           contract retract to be safe)                   │
│        │                                                                 │
│        ▼                                                                 │
│  LDD feedback        ◄── Verbalized Sampling generates                   │
│        │                 k candidate fixes when                          │
│        │                 contract violation detected                     │
│        ▼                                                                 │
│  Infer derivation    ◄── contracts as Horn-clause premises               │
│        │                 (not just code asserts)                         │
│        ▼                                                                 │
│  criterium upgrade   ◄── AssuranceLevel raised when                      │
│                          contract-state stable over time                 │
└──────────────────────────────────────────────────────────────────────────┘
```

### The One-Sentence Vision

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  Code runs against its contract;                                         │
│  the contract lives in RSTMDB with temporal lifecycle;                   │
│  logs feed a semantic critic, not an assert engine;                      │
│  fixes come from a distribution, not from a single guess;                │
│  the whole pipeline is model-agnostic because the structure              │
│  is in the prompts, not in the weights.                                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Follow-up Tasks

**Epic** (parent — tracks the unified vision):
- **docs-duwm** (epic): GRACE-extended unified reasoning pipeline — contracts as RSTMDB entities + LDD feedback + model-agnostic structure

**Individual tasks** (children of epic):
- docs-5q59: Design RSTMDB schema extension for first-class AI-contract entities (valid_from/until + contract-state, micro-ТЗ format NOT Hoare logic)
- docs-p8ay: Prototype Log Driven Development feedback loop in dual-window pattern (semantic trajectory analysis + VS-based candidate fixes)
- docs-3il0: Validate model-independence claim empirically — run identical GRACE prompts across 4+ frontier models, measure output variance
- docs-5klv: Fetch and synthesize Ivanov's VK long-form GRACE article (formal companion to post stream)
- docs-r0jc: Review github.com/osovv/grace-marketplace plugin for reusable prompt templates (without adopting embedded tags)
- docs-8g2r: Define formal XML/MD vs graph-DB knowledge split for ZomboCraftEco (per Post 2186)

---

## Sources

- @turboproject Telegram channel, Vladimir Ivanov, posts curated by Кирилл Шутов
- Public preview URL pattern: https://t.me/s/turboproject/<post_id>
- All 20 verbatim/extraction quotes above sourced directly from public channel previews
- Channel description: "Искусственный интеллект. Управление проектами. Промптинг. Vibe coding" — 7.88K subscribers, no linked discussion group
- VK long-form article (cited by Ivanov in posts 2108, 2998, 3505): https://vk.com/@turboplanner-grace-freimvork-sozdaniya-koda-llm-v-bolshih-kontekstah-s-uc
- Claude Code plugin (Post 3263): https://github.com/osovv/grace-marketplace
- JML/CodeT5+ contract recovery paper (Post 1844): https://dl.acm.org/doi/10.1145/3689484.3690738
- OpenAI GPT-4.1 prompting guide (Post 2129): https://cookbook.openai.com/examples/gpt4-1_prompting_guide#delimiters
- Workspace prior research: codegraph-vs-grace-tags-index-map.md, fpf-haft-vs-grace-semantic-vm.md, grace-2-doxygen-grep-semantic-slicing.md, semantic-vm-grace-deepseek-dsa.md, grace-to-fpf-bridge-spike.md, learning-is-forgetting-ib-llm-tishby-compression.md, superposition-collapse-prompting-brainstorm-llm.md
