"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let isUpdating = false;
let currentCommodityId = null;
function fetchCommodity() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:3000/commodities');
        if (!response.ok) {
            throw new Error('Error fetching commodities');
        }
        const data = yield response.json();
        console.log('FETCHED ITEMS', data);
        return data;
    });
}
function saveCommodity(commodity) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:3000/commodities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commodity)
        });
        if (!response.ok) {
            throw new Error('Error saving commodity');
        }
    });
}
function deleteCommodity(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:3000/commodities/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error deleting commodity');
        }
        console.log(`Commodity with id: ${id} deleted successfully`);
    });
}
function updateCommodity(id, updatedCommodity) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:3000/commodities/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCommodity)
        });
        if (!response.ok) {
            throw new Error('Error updating commodity');
        }
        console.log(updatedCommodity);
    });
}
function createOrUpdateCommodity(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const itemNo = document.querySelector('#no');
        const itemName = document.querySelector('#text');
        const itemPrice = document.querySelector('#price');
        const imageUrl = document.querySelector('#imageUrl');
        const form = document.querySelector('.form');
        if (!itemNo.value || !itemName.value || !itemPrice.value || !imageUrl.value) {
            console.log("Fill all fields");
            const error = document.createElement('p');
            error.className = 'error';
            error.textContent = 'Please fill in all fields';
            form.appendChild(error);
            setTimeout(() => {
                form.removeChild(error);
            }, 3000);
            return;
        }
        const newCommodity = {
            itemNumber: parseInt(itemNo.value, 10),
            itemNames: itemName.value,
            itemPrices: parseFloat(itemPrice.value),
            imageUrl: imageUrl.value
        };
        try {
            if (isUpdating && currentCommodityId !== null) {
                yield updateCommodity(currentCommodityId, newCommodity);
                isUpdating = false;
                currentCommodityId = null;
                document.querySelector('#create').textContent = 'Create Item';
            }
            else {
                yield saveCommodity(newCommodity);
            }
            const items = yield fetchCommodity();
            displayCommodity(items);
        }
        catch (error) {
            console.error('Error saving commodity:', error);
        }
        itemNo.value = '';
        itemName.value = '';
        itemPrice.value = '';
        imageUrl.value = '';
    });
}
function displayCommodity(items) {
    const itemsContainer = document.querySelector('.items');
    itemsContainer.innerHTML = '';
    items.forEach(item => {
        const itemCont = document.createElement('div');
        itemCont.className = 'itemCont';
        itemCont.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.itemNames}" />
            <p>Item Number: ${item.itemNumber}</p>
            <p>Item Name: ${item.itemNames}</p>
            <p>Item Price: ${item.itemPrices}</p>
            <button class="updateBtn" data-id="${item.id}">Update</button>
            <button class="deleteBtn" data-id="${item.id}">Delete</button>
        `;
        itemsContainer.appendChild(itemCont);
    });
    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', (event) => __awaiter(this, void 0, void 0, function* () {
            const target = event.target;
            const id = target.dataset.id;
            try {
                yield deleteCommodity(id);
                const items = yield fetchCommodity();
                displayCommodity(items);
            }
            catch (error) {
                console.error('Error deleting commodity:', error);
            }
        }));
    });
    document.querySelectorAll('.updateBtn').forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.target;
            const id = target.dataset.id;
            const item = items.find(i => i.id === id);
            if (item) {
                const itemNo = document.querySelector('#no');
                const itemName = document.querySelector('#text');
                const itemPrice = document.querySelector('#price');
                const imageUrl = document.querySelector('#imageUrl');
                itemNo.value = item.itemNumber.toString();
                itemName.value = item.itemNames;
                itemPrice.value = item.itemPrices.toString();
                imageUrl.value = item.imageUrl;
                document.querySelector('#create').textContent = 'Update Item';
                isUpdating = true;
                currentCommodityId = id;
            }
        });
    });
}
function searchCommodity(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:3000/commodities');
        if (!response.ok) {
            throw new Error('Error fetching commodities');
        }
        const commodities = yield response.json();
        return commodities.filter((commodity) => commodity.itemNames.toLowerCase().includes(name.toLowerCase()));
    });
}
function createSearchForm() {
    const searchForm = document.createElement('div');
    searchForm.className = 'searchForm';
    while (searchForm.firstChild) {
        searchForm.removeChild(searchForm.firstChild);
    }
    searchForm.innerHTML = `
        <input type="text" id="searchText" placeholder="Search Commodity Name">
        <button id="searchSubmit">Search</button>
    `;
    document.querySelector('.top').appendChild(searchForm);
    document.querySelector('#searchSubmit').addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        const searchText = document.querySelector('#searchText').value;
        if (searchText) {
            try {
                const items = yield searchCommodity(searchText);
                displayCommodity(items);
            }
            catch (error) {
                console.error('Error searching commodities:', error);
            }
        }
    }));
}
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const createItemButton = document.querySelector('#create');
    createItemButton.addEventListener('click', createOrUpdateCommodity);
    const viewAllButton = document.querySelector('#viewAll');
    viewAllButton.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        try {
            const items = yield fetchCommodity();
            displayCommodity(items);
        }
        catch (error) {
            console.error('Error fetching commodities:', error);
        }
    }));
    const searchButton = document.querySelector('#search');
    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        createSearchForm();
    });
}));
