interface Commodity {
    id?: string;
    itemNumber: number;
    itemNames: string;
    itemPrices: number;
    imageUrl: string;
}

let cart: Commodity[] = [];

async function fetchItem(): Promise<Commodity[]> {
    const response = await fetch('http://localhost:3000/commodities');
    if (!response.ok) {
        throw new Error('Error fetching commodities');
    }
    return await response.json();
}

function displayItem(items: Commodity[]): void {
    const itemsContainer = document.querySelector('#product-list') as HTMLDivElement;
    itemsContainer.innerHTML = ''; 
    items.forEach(item => {
        const itemCont = document.createElement('div');
        itemCont.className = 'itemCont';
        itemCont.innerHTML = `
            <p>Item Number: ${item.itemNumber}</p>
            <p>Item Name: ${item.itemNames}</p>
            <p>Item Price: ${item.itemPrices}</p>
            <img src="${item.imageUrl}" alt="${item.itemNames}" />
            <button class="addToCartBtn" data-id="${item.id}">Add to Cart</button>
        `;
        itemsContainer.appendChild(itemCont);
    });

    document.querySelectorAll('.addToCartBtn').forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.target as HTMLButtonElement;
            const id = target.dataset.id!;
            const description = document.querySelector('.description') as HTMLDivElement;
            
            const item = items.find(i => i.id === id);
            if (item && !cart.find(c => c.id === id)) {
                cart.push(item);
                const success= document.createElement('div');
                success.className ='success';
                success.innerHTML = 'Item added to cart';
                description.appendChild(success);
                setTimeout(() =>{
                    description.removeChild(success);
                }, 3000);
                console.log('Item added to cart:', item);
            }
        });
    });
}

async function searchItem(name: string): Promise<Commodity[]> {
    const response = await fetch('http://localhost:3000/commodities');
    if (!response.ok) {
        throw new Error('Error fetching commodities');
    }
    const commodities = await response.json();
    return commodities.filter((commodity: Commodity) =>
        commodity.itemNames.toLowerCase().includes(name.toLowerCase())
    );
}

function createsearchForm() {
    const description = document.querySelector('.description');
    const forms = document.querySelectorAll('.searchForm');
    forms.forEach((form) => {
        description?.removeChild(form);
})
    const searchForm = document.createElement('div');
    searchForm.className = 'searchForm';
    
    searchForm.innerHTML = `
        <input type="text" id="searchText" placeholder="Search Commodity Name">
        <button id="searchSubmit">Search</button>
    `;
    document.querySelector('.description')!.appendChild(searchForm);

    document.querySelector('#searchSubmit')!.addEventListener('click', async () => {
        const searchText = (document.querySelector('#searchText') as HTMLInputElement).value;
        if (searchText) {
            try {
                const items = await searchItem(searchText);
                displayItem(items);
            } catch (error) {
                console.error('Error searching commodities:', error);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const searchButton = document.querySelector('#search') as HTMLButtonElement;
    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        createsearchForm();
    });

    const cartButton = document.querySelector('#cart') as HTMLButtonElement;
    cartButton.addEventListener('click', () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'cart.html';
    });

    try {
        const items = await fetchItem();
        displayItem(items);
    } catch (error) {
        console.error('Error fetching commodities:', error);
    }

    const homeButton = document.querySelector('#home') as HTMLButtonElement;
    homeButton.addEventListener('click', () =>{
        window.location.href = 'landing.html';
    })
});
