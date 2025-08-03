# Google Sheets Setup Instructions

## Инструкция по настройке Google Sheets для получения заявок

### 1. Создание Google Sheets

1. Перейдите на [Google Sheets](https://sheets.google.com)
2. Создайте новую таблицу
3. В первой строке добавьте заголовки:
   - A1: `Timestamp`
   - B1: `Full Name`
   - C1: `Email`
   - D1: `Country`
   - E1: `Phone`
   - F1: `Package`
   - G1: `Price`
   - H1: `User Agent`
   - I1: `Referrer`

### 2. Настройка Google Apps Script

1. В вашей таблице перейдите в меню **Расширения → Apps Script**
2. Удалите весь код и вставьте этот:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Добавляем timestamp
    const timestamp = new Date();
    
    // Добавляем данные в таблицу
    sheet.appendRow([
      timestamp,
      data.fullName,
      data.email,
      data.country,
      data.phone,
      data.package,
      data.price,
      data.userAgent,
      data.referrer
    ]);
    
    // Возвращаем успешный ответ
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'timestamp': timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'error': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Сохраните файл (Ctrl+S или Cmd+S)
4. Нажмите **Развернуть → Новое развертывание**
5. Выберите тип: **Веб-приложение**
6. Настройки:
   - Описание: `Form Handler`
   - Выполнить как: `Я`
   - У кого есть доступ: `Все`
7. Нажмите **Развернуть**
8. Скопируйте URL веб-приложения

### 3. Обновление URL в коде

1. Откройте файл `script.js`
2. Найдите строку с `GOOGLE_SHEETS_URL`
3. Замените URL на ваш скопированный URL:

```javascript
const GOOGLE_SHEETS_URL = 'ВАШ_СКОПИРОВАННЫЙ_URL_ЗДЕСЬ';
```

### 4. Тестирование

1. Откройте ваш сайт
2. Нажмите на любую кнопку "Get Started"
3. Заполните форму тестовыми данными
4. Отправьте форму
5. Проверьте Google Sheets - данные должны появиться

### 5. Дополнительные настройки (опционально)

#### Автоматические уведомления на email:

В Google Apps Script добавьте после `sheet.appendRow`:

```javascript
// Отправка email уведомления
MailApp.sendEmail({
  to: 'your-email@gmail.com',
  subject: 'New Order: ' + data.fullName,
  body: `
    New order received!
    
    Name: ${data.fullName}
    Email: ${data.email}
    Country: ${data.country}
    Phone: ${data.phone}
    Package: ${data.package}
    Price: ${data.price}
    
    Time: ${timestamp}
  `
});
```

#### Форматирование таблицы:

1. Выделите первую строку
2. Формат → Жирный текст
3. Формат → Выравнивание → По центру
4. Добавьте фильтры: Данные → Создать фильтр

### Troubleshooting

**Проблема**: Данные не появляются в таблице
- Проверьте, что URL правильно скопирован
- Убедитесь, что развертывание активно
- Проверьте консоль браузера на ошибки

**Проблема**: Ошибка CORS
- Это нормально при использовании `mode: 'no-cors'`
- Данные все равно отправляются

### Безопасность

- URL вашего веб-приложения является публичным
- Не храните чувствительные данные в таблице
- Регулярно делайте резервные копии
- Ограничьте доступ к таблице только для себя

## Готово! 🎉

Теперь все заявки с вашего лендинга будут автоматически сохраняться в Google Sheets!