import restApiUrl from '../../js/script.js';

const productsContainer = document.querySelector(".products");
let allProducts = []; // Переменная для хранения всех продуктов

function getAllProducts() {
    axios.get(`${restApiUrl}/products/all`)
        .then((response) => {
            console.log(response.data); // данные продуктов
            allProducts = response.data; // Сохраняем все продукты
            showProducts(allProducts); // Показываем все продукты
            showCategories(allProducts); // Показываем категории
            addRateFilters(allProducts);
        })
        .catch((error) => {
            console.log(error.message); // обработка ошибок
        });
}

function showProducts(products) {
    // Очищаем контейнер перед добавлением новых данных
    productsContainer.innerHTML = "";

    // Перебираем массив продуктов и добавляем их в DOM
    products.forEach(product => {
        // Создаем новый элемент для каждого продукта
        const productDiv = document.createElement("div");
        productDiv.classList.add("col");

        // Наполняем его данными продукта
        productDiv.innerHTML = `
            <div class="card h-100 border-0">
                <div class="bg-light-grey p-3 " >
                    <img src='${product.imageUrl}' class="card-img-top productImage" alt="..."  data-product='${JSON.stringify(product)}'>
                </div>
                <div class="card-body">
                    <h6 class="card-title">${product.brand} ${product.model}</h6>
                    <p class="card-text">
                    <div class="text-danger">
                         ${product.price}$
                    </div>
                    <div>
                       ${showRate(product.rate)} <!-- передаем рейтинг продукта -->
                       <span class="text-secondary">(${product.reviewsCount || Math.round(Math.random() * 100)})</span> <!-- Количество отзывов -->
                    </div>
                    <div>
                        <!-- Добавляем атрибут data-product для передачи данных продукта -->
                        <button class="btn btn-dark w-100 my-2 add-to-cart" data-product='${JSON.stringify(product)}'>add to cart</button>
                    </div>
                    </p>
                </div>
            </div>
        `;

        // Добавляем элемент в контейнер
        productsContainer.appendChild(productDiv);
    });

    console.log('Products displayed');

    // Добавляем обработчик событий для кнопок "Add to cart"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const product = JSON.parse(this.getAttribute('data-product'));
            addToCart(product);
        });
    });

    document.querySelectorAll('.productImage').forEach(image => {
        image.addEventListener('click', function () {
            const product = JSON.parse(this.getAttribute('data-product'));
            localStorage.setItem("product", JSON.stringify(product))
            window.location.href = '/pages/product/product.html'; // Перенаправляем на страницу входа

        });
    });

}

function showRate(rate) {
    let stars = '';
    for (let i = 1; i <= rate; i++) {
        stars += '<i class="bi bi-star-fill text-warning"></i>';
    }
    return stars;
}

function addToCart(product) {
    // Получаем токен авторизации из localStorage (если он там есть)
    const token = localStorage.getItem('token');
    console.log("Token:", token);

    // Если токен есть, отправляем запрос на сервер
    if (token) {
        axios.post(`${restApiUrl}/cart/${product.id}?quantity=1`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Отправляем токен в заголовках
            }
        })
            .then(response => {
                alert("Product added to cart");
                console.log("Product added to cart:", response.data);
            })
            .catch(error => {
                console.error("Ошибка при добавлении товара в корзину:", error.message);
            });
    } else {
        console.error("Ошибка: Токен авторизации не найден.");
    }
}


function showCategories(products) {
    const categories = document.querySelector(".categories");
    categories.innerHTML = "";
    let categoriesList = products.map((product) => {
        return product.category;
    });
    
    const uniqueCategories = new Set(categoriesList);

    // Отображаем категории
    uniqueCategories.forEach((category) => {
        const div = document.createElement("div");
        div.innerText = category;
        div.classList.add("my-1");
        categories.append(div);

        // Обработчик клика по категории
        div.addEventListener("click", () => {
            const filteredProducts = products.filter((product) => {
                return product.category === category;
            });
            showProducts(filteredProducts);
        });
    });
}

function addRateFilters(allProducts){
    const rateList = document.querySelectorAll(".rate");
    rateList.forEach(rate => {
        rate.addEventListener("click", () => {
    
            const filteredProducts = allProducts.filter((product) => {
                return product.rate == rate.dataset.rate;
            });
            showProducts(filteredProducts);
        });
    
    });
    
}

document.querySelector(".sortSelect").addEventListener("change", function (event) {
    const order = event.target.value === "1" ? 'asc' : 'desc'; // Выбор сортировки
    const sortedProducts = sortProductsByPrice(allProducts, order);
    showProducts(sortedProducts);
});

function sortProductsByPrice(products, order = 'asc') {
    return products.sort((a, b) => {
        if (order === 'asc') {
            return a.price - b.price; // Сортировка по возрастанию
        } else if (order === 'desc') {
            return b.price - a.price; // Сортировка по убыванию
        } else {
            console.error('Invalid order parameter');
            return 0;
        }
    });
}


document.querySelector(".allProductsBtn").addEventListener("click", () => {
    getAllProducts();
})

document.querySelector(".searchInput").addEventListener("input", (e) => {
    let searchWord = e.target.value.toLowerCase(); // Преобразуем введенный текст в нижний регистр для нечувствительности к регистру
    let filteredProducts;

    // Фильтрация продуктов
    filteredProducts = allProducts.filter((product) => {
        const brandAndModel = (product.brand + " " + product.model).toLowerCase(); // Преобразуем название бренда и модели в нижний регистр
        return brandAndModel.includes(searchWord); // Проверка на совпадение
    });

    // Если поле поиска пустое, показываем все продукты
    if (searchWord === "") {
        filteredProducts = allProducts;
    }

    showProducts(filteredProducts); // Отображаем отфильтрованные продукты
});


getAllProducts();