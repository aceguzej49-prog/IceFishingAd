---
description: Как создать playable-рекламу для Moloco, которая проходит модерацию
---

# Moloco Playable Ad — Workflow (Automated)

## Требования платформы Moloco

Playable-объявление для Moloco должно быть **единым HTML-файлом** (single-file), соответствующим правилам:

1. **Один HTML-файл** — без внешних ссылок и файлов.
2. **Все ресурсы в base64** — изображения и аудио внутри HTML.
3. **Moloco CTA-кнопка** — обязательная кнопка «Install», вызывающая `FbPlayableAd.onCTAClick()`.
4. **`FbPlayableAd.onCTAClick()`** — должен вызываться при клике на любую кнопку установки.

---

## Автоматическая сборка (Рекомендуемый способ)

В проекте настроен скрипт `build.js`, который делает всю грязную работу за вас.

### Как запустить:
// turbo
1. Перейдите в папку проекта: `cd IceFishingAd`
2. Запустите сборку: `node build.js`

### Что делает скрипт:
- **Инлайнит конфиг:** Вставляет содержимое `config.js` прямо в HTML.
- **Вшивает ассеты:** Находит все ссылки вида `assets/...` и заменяет их на `data:image/...;base64,...`.
- **Добавляет Moloco CTA:** Автоматически вставляет блок стилей и скрипт кнопки «Install».
- **Привязывает события:** Автоматически добавляет вызов `FbPlayableAd.onCTAClick()` к вашим кнопкам (например, `#popup-btn` и `#cta-button`).

**Результат:** Готовый файл появится в `IceFishingAd/build/index.html`.

---

## Ручная настройка (Если не используете build.js)

Если вы создаете новый проект без `build.js`, вставьте этот блок в `<head>`:

```html
<!-- MOLOCO CTA BLOCK -->
<style>
#moloco-cta-wrap{position:fixed;left:0;right:0;bottom:calc(env(safe-area-inset-bottom,0px) + 16px);display:flex;justify-content:center;z-index:2147483647;pointer-events:none}
#moloco-cta-button{pointer-events:auto;border:0;border-radius:999px;padding:14px 22px;min-width:160px;font:700 18px/1.1 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;background:#ffffff;color:#000000;box-shadow:0 8px 24px rgba(0,0,0,.35);cursor:pointer;-webkit-tap-highlight-color:transparent}
#moloco-cta-button:active{transform:scale(.98)}
</style>
<script>
(function() {
    function molocoCTAClick() {
        if (typeof FbPlayableAd !== 'undefined' && FbPlayableAd && typeof FbPlayableAd.onCTAClick === 'function') {
            FbPlayableAd.onCTAClick();
        }
    }
    window.molocoCTAClick = molocoCTAClick;
    document.addEventListener('DOMContentLoaded', function() {
        var wrap = document.createElement('div');
        wrap.id = 'moloco-cta-wrap';
        var btn = document.createElement('button');
        btn.id = 'moloco-cta-button';
        btn.textContent = 'Install';
        btn.addEventListener('click', function(ev) {
            ev.preventDefault();
            molocoCTAClick();
        });
        wrap.appendChild(btn);
        document.body.appendChild(wrap);
    });
})();
</script>
```

---

## Чеклист перед загрузкой

- [ ] Файл из папки `build/index.html` однородный (все ассеты внутри).
- [ ] При клике на кнопку «Install» (и кнопки в игре) вызывается API Moloco.
- [ ] Размер файла < 5 МБ.
- [ ] Нет внешних зависимостей (проверьте отсутствие `src="assets/..."` в коде).

---

## Частые ошибки
- **Asset not found:** Папка `assets/` должна лежать рядом с `build.js`.
- **Z-index:** Moloco CTA имеет максимальный z-index. Не перекрывайте его другими элементами.

