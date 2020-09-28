'use strict';


// Выход из личного кабинета
const logoutBtn = new LogoutButton();
logoutBtn.action = () => ApiConnector.logout(logoutClick => {
    if(logoutClick){
        location.reload();
    }
}); 

// Получение информации о пользователе
ApiConnector.current(response => {
    if(response) {
        ProfileWidget.showProfile(response.data);
    }
});

// Получение текущих курсов валюты
const tableBody = new RatesBoard();

function checkCurrentCurrency() {
    ApiConnector.getStocks(response => {
        tableBody.clearTable();
        tableBody.fillTable(response.data);
    })
}
checkCurrentCurrency();
setInterval(checkCurrentCurrency, 60000);

// Пополнение баланса
const addMoneyForm = new MoneyManager();
addMoneyForm.addMoneyCallback = (data) => ApiConnector.addMoney(data, response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        addMoneyForm.setMessage(response.success, "Счет пополнен");
    } else {
         addMoneyForm.setMessage(response.success, response.error);
    }
});

// Конвертация
addMoneyForm.conversionMoneyCallback = (data) => ApiConnector.convertMoney(data, response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        addMoneyForm.setMessage(response.success, "Конвертация выполнена успешно");
    } else {
        addMoneyForm.setMessage(response.success, response.error);
    }
});

// Перевод
//updateUsersList(data) — обновляет выпадающий список пользователей

addMoneyForm.sendMoneyCallback = (data) => ApiConnector.transferMoney(data, response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        addMoneyForm.setMessage(response.success, "Перевод выполнен успешно");
    } else {
        addMoneyForm.setMessage(response.success, response.error);
    }
});

// Работа с избранным
const favoritesTableBody = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    if (response.success) {
        favoritesTableBody.clearTable();
        favoritesTableBody.fillTable(response.data);
        addMoneyForm.updateUsersList(response.data);
        addMoneyForm.setMessage(response.success, "Пользователь добавлен в избранное");
    } else {
        addMoneyForm.setMessage(response.success, response.error);
    }
});

// Добавление пользователя в избранное
favoritesTableBody.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        if(response.success){
            favoritesTableBody.clearTable();
            favoritesTableBody.fillTable(response.data);
        } else {
            favoritesTableBody.setMessage(response.success, response.error);
        }
    })
}

// Удаление пользователя из избранного
favoritesTableBody.removeUserCallback = (data) =>{ 
    ApiConnector.removeUserFromFavorites(data, callback => {
        if(callback.success){
        favoritesTableBody.clearTable();
        favoritesTableBody.fillTable(callback.data);
        } else {
            favoritesTableBody.setMessage(callback.success, callback.error);
        }
    })
}
