interface Commodities {
    id?: string;
    itemNumber: number;
    itemNames: string;
    itemPrices: number;
    imageUrl: string; 
}

let isUpdating = false;
let currentCommodityId: string | null = null;

async function fetchCommodity(): Promise<Commodities[]> {
    const response = await fetch('http://localhost:3000/commodities');
    if (!response.ok) {
        throw new Error('Error fetching commodities');
    }
    const data = await response.json();
    console.log('FETCHED ITEMS', data);
    return data;
}

async function saveCommodity(commodity: Commodities): Promise<void> {
    const response = await fetch('http://localhost:3000/commodities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commodity)
    });
    if (!response.ok) {
        throw new Error('Error saving commodity');
    }
}

async function deleteCommodity(id: string): Promise<void> {
    const response = await fetch(`http://localhost:3000/commodities/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error deleting commodity');
    }
    console.log(`Commodity with id: ${id} deleted successfully`);
}

async function updateCommodity(id: string, updatedCommodity: Commodities): Promise<void> {
    const response = await fetch(`http://localhost:3000/commodities/${id}`, {
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
}

async function createOrUpdateCommodity(event: Event): Promise<void> {
    event.preventDefault();

    const itemNo = document.querySelector('#no') as HTMLInputElement;
    const itemName = document.querySelector('#text') as HTMLInputElement;
    const itemPrice = document.querySelector('#price') as HTMLInputElement;
    const imageUrl = document.querySelector('#imageUrl') as HTMLInputElement; 
    const form = document.querySelector('.form') as HTMLFormElement

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

    const newCommodity: Commodities = {
        itemNumber: parseInt(itemNo.value, 10),
        itemNames: itemName.value,
        itemPrices: parseFloat(itemPrice.value),
        imageUrl: imageUrl.value 
    }

    try {
        const items = await fetchCommodity();

        if (isUpdating && currentCommodityId !== null) {
            await updateCommodity(currentCommodityId, newCommodity);
            isUpdating = false;
            currentCommodityId = null;
            document.querySelector('#create')!.textContent = 'Create Item';
        } else {
            const existingCommodity = items.find(item => item.itemNumber === newCommodity.itemNumber);
            if (existingCommodity) {
                console.log('Item number already used');
                const error = document.createElement('p');
                error.className = 'error';
                error.textContent = 'Item number already used';
                form.appendChild(error);
                setTimeout(() => {
                    form.removeChild(error);
                }, 3000);
                return;
            }
            await saveCommodity(newCommodity);
        }

        const updatedItems = await fetchCommodity();
        displayCommodity(updatedItems);
    } catch (error) {
        console.error('Error saving commodity:', error);
    }

    itemNo.value = '';
    itemName.value = '';
    itemPrice.value = '';
    imageUrl.value = ''; 
}

function displayCommodity(items: Commodities[]): void {
    const itemsContainer = document.querySelector('.items') as HTMLDivElement;
    itemsContainer.innerHTML = ''; 
    items.forEach(item => {
        const itemCont = document.createElement('div');
        itemCont.className = 'itemCont';
        itemCont.innerHTML = `
            <p>Item Number: ${item.itemNumber}</p>
            <p>Item Name: ${item.itemNames}</p>
            <p>Item Price: ${item.itemPrices}</p>
            <img src="${item.imageUrl}" alt="${item.itemNames}" /> <!-- Display image -->
            <button class="updateBtn" data-id="${item.id}">Update</button>
            <button class="deleteBtn" data-id="${item.id}">Delete</button>
        `;
        itemsContainer.appendChild(itemCont);
    });

    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const target = event.target as HTMLButtonElement;
            const id = target.dataset.id!;
            try {
                await deleteCommodity(id);
                const items = await fetchCommodity();
                displayCommodity(items);
            } catch (error) {
                console.error('Error deleting commodity:', error);
            }
        });
    });

    document.querySelectorAll('.updateBtn').forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.target as HTMLButtonElement;
            const id = target.dataset.id!;
            const item = items.find(i => i.id === id);
            if (item) {
                const itemNo = document.querySelector('#no') as HTMLInputElement;
                const itemName = document.querySelector('#text') as HTMLInputElement;
                const itemPrice = document.querySelector('#price') as HTMLInputElement;
                const imageUrl = document.querySelector('#imageUrl') as HTMLInputElement; 

                itemNo.value = item.itemNumber.toString();
                itemName.value = item.itemNames;
                itemPrice.value = item.itemPrices.toString();
                imageUrl.value = item.imageUrl; 

                document.querySelector('#create')!.textContent = 'Update Item';
                isUpdating = true;
                currentCommodityId = id;
            }
        });
    });
}

async function searchCommodity(name: string): Promise<Commodities[]> {
    const response = await fetch('http://localhost:3000/commodities');
    if (!response.ok) {
        throw new Error('Error fetching commodities');
    }
    const commodities = await response.json();
    return commodities.filter((commodity: Commodities) =>
        commodity.itemNames.toLowerCase().includes(name.toLowerCase())
    );
}

function createSearchForm() {
    const searchForm = document.createElement('div');
    searchForm.className = 'searchForm';
    while(searchForm.firstChild) {
        searchForm.removeChild(searchForm.firstChild);
    }
    searchForm.innerHTML = `
        <input type="text" id="searchText" placeholder="Search Commodity Name">
        <button id="searchSubmit">Search</button>
    `;
    document.querySelector('.top')!.appendChild(searchForm);

    document.querySelector('#searchSubmit')!.addEventListener('click', async () => {
        const searchText = (document.querySelector('#searchText') as HTMLInputElement).value;
        if (searchText) {
            try {
                const items = await searchCommodity(searchText);
                displayCommodity(items);
            } catch (error) {
                console.error('Error searching commodities:', error);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const createItemButton = document.querySelector('#create') as HTMLButtonElement;
    createItemButton.addEventListener('click', createOrUpdateCommodity);

    const viewAllButton = document.querySelector('#viewAll') as HTMLButtonElement;
    viewAllButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const items = await fetchCommodity();
            displayCommodity(items);
        } catch (error) {
            console.error('Error fetching commodities:', error);
        }
    });

    const searchButton = document.querySelector('#search') as HTMLButtonElement;
    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        createSearchForm();
    });
});
