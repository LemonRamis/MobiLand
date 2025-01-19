<?php
// Токен бота (получен от BotFather)
$token = "8039076471:AAFOM3FnPA4P6NYxHqK73TSiTbTzQqJCSnU";  // Замените на ваш токен
// chat_id — это уникальный идентификатор вашего чата (получите его через getUpdates, как описано ранее)
$chat_id = "671742643";  // Замените на ваш chat_id

// Получаем данные из формы
$name = $_POST['name'];      // Имя пользователя
$message = $_POST['message'];  // Сообщение пользователя

// Формируем текст сообщения
$text = "Новое сообщение с сайта:\n\nИмя: $name\nСообщение: $message";

// URL для отправки сообщения через Telegram API
$url = "https://api.telegram.org/bot$token/sendMessage?chat_id=$chat_id&text=" . urlencode($text);

// Отправляем запрос через file_get_contents
file_get_contents($url);
?>
