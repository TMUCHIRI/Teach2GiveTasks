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
        const form = document.querySelector('.form');
        if (!itemNo.value || !itemName.value || !itemPrice.value) {
            console.log("Fill all fields");
            const error = document.createElement('p');
            error.className = 'error';
            error.textContent = 'Please fill in all fields';
            form.appendChild(error);
            return;
        }
        const newCommodity = {
            itemNumber: parseInt(itemNo.value, 10),
            itemNames: itemName.value,
            itemPrices: parseFloat(itemPrice.value)
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
    });
}
function displayCommodity(items) {
    const itemsContainer = document.querySelector('.items');
    itemsContainer.innerHTML = ''; // Clear existing items
    items.forEach(item => {
        const itemCont = document.createElement('div');
        itemCont.className = 'itemCont';
        itemCont.innerHTML = `
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
                itemNo.value = item.itemNumber.toString();
                itemName.value = item.itemNames;
                itemPrice.value = item.itemPrices.toString();
                document.querySelector('#create').textContent = 'Update Item';
                isUpdating = true;
                currentCommodityId = id;
            }
        });
    });
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
}));
