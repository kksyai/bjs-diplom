'use strict';


// Выход из личного кабинета
const logoutBtn = new LogoutButton();
logoutBtn.action = () => ApiConnector.logout(logoutClick => {
    logoutClick ? location.reload() : new Error('Ошибка выхода');
}); 

// Получение информации о пользователе
ApiConnector.current(callback => 
    callback ? ProfileWidget.showProfile(callback['data']) : 
    new Error('Ошибка отображения данных пользователя'));

// Получение текущих курсов валюты
const tableBody = new RatesBoard();

function checkCurrentCurrency() {
    ApiConnector.getStocks(callback => {
        tableBody.clearTable();
        tableBody.fillTable(callback['data']);
    })
}
checkCurrentCurrency();
setInterval(checkCurrentCurrency, 60000);

// Пополнение баланса
const addMoneyForm = new MoneyManager();
addMoneyForm.addMoneyCallback = (data) => ApiConnector.addMoney(data, callback => {
    if (callback.success) {
        ProfileWidget.showProfile(callback['data']);
        addMoneyForm.setMessage(callback.success, "Счет пополнен");
    } else {
         addMoneyForm.setMessage(callback.success, callback['data']);
    }
});

// Конвертация
addMoneyForm.conversionMoneyCallback = (data) => ApiConnector.convertMoney(data, callback => {
    if (callback.success) {
        ProfileWidget.showProfile(callback['data']);
        addMoneyForm.setMessage(callback.success, "Конвертация выполнена успешно");
    } else {
        addMoneyForm.setMessage(callback.success, callback['error']);
    }
});

// Перевод
//updateUsersList(data) — обновляет выпадающий список пользователей

addMoneyForm.sendMoneyCallback = (data) => ApiConnector.transferMoney(data, callback => {
    if (callback.success) {
        ProfileWidget.showProfile(callback['data']);
        addMoneyForm.setMessage(callback.success, "Перевод выполнен успешно");
    } else {
        addMoneyForm.setMessage(callback.success, callback['error']);
    }
});

// Работа с избранным
const favoritesTableBody = new FavoritesWidget();
ApiConnector.getFavorites(callback => {
    if (callback.success) {
        favoritesTableBody.clearTable();
        favoritesTableBody.fillTable(callback['data']);
        addMoneyForm.updateUsersList(callback['data']);
        addMoneyForm.setMessage(callback.success, "Пользователь добавлен в избранное");
    } else {
        addMoneyForm.setMessage(callback.success, callback['error']);
    }
});

// Добавление пользователя в избранное
favoritesTableBody.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, callback => {
        if(callback.success){
            favoritesTableBody.clearTable();
            favoritesTableBody.fillTable(callback['data']);
        } else {
            favoritesTableBody.setMessage(callback.success, callback['error']);
        }
    })
}

// Удаление пользователя из избранного
favoritesTableBody.removeUserCallback = (data) =>{ 
    ApiConnector.removeUserFromFavorites(data, callback => {
        if(callback.success){
        favoritesTableBody.clearTable();
        favoritesTableBody.fillTable(callback['data']);
        } else {
            favoritesTableBody.setMessage(callback.success, callback['error']);
        }
    })
}
