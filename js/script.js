const  restApiUrl =  "http://localhost:8080/api";

export default restApiUrl;

// Функция для получения профиля пользователя
function fetchUserProfile() {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
  
    if (!token) {
      showOutOfProfileMenu(); // Если токена нет, показать меню для незарегистрированного пользователя
      return;
    }
    axios
      .get(`${restApiUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }, // Добавляем заголовок авторизации
      })
      .then((response) => {
        handleProfileSuccess(response.data); // Обработка успешного ответа
      })
      .catch((error) => {
        handleProfileError(error); // Обработка ошибок
      });
  }

  // Функция обработки успешного ответа
function handleProfileSuccess(userData) {
    console.log('Профиль пользователя загружен:', userData);
    showInProfileMenu(userData); // Отобразить профиль пользователя в меню
    localStorage.setItem('user', JSON.stringify(userData)); // Сохранить данные пользователя
  }

  // Функция для отображения меню профиля
function showInProfileMenu(data) {
    showHeader();
    showFooter();
    console.log(data)
    const profileMenu = document.querySelector(".profileMenu");
    profileMenu.innerHTML = `
          <a href="/pages/cart/cart.html">
              <i class="bi bi-cart3 fs-2 mx-3"></i>
          </a>
          <a href="/pages/profile/profile.html">
              <i class="bi bi-person-circle fs-2"></i>
          </a>
          <span class="username">
              ${data.username}
          </span>
          <span class="logoutBtn btn btn-danger">
              Log out
          </span>
      `;
    const logoutBtn = document.querySelector(".logoutBtn");
    logoutBtn.addEventListener("click", logoutUser)
  }
  
  // Функция обработки ошибок
function handleProfileError(error) {
    if (error.response) {
      const { status, data } = error.response;
  
      if (status === 401) {
        console.warn('Неавторизован: Токен истек или недействителен');
        alert('Сессия истекла. Пожалуйста, войдите снова.');
        localStorage.removeItem('token'); // Удалить недействительный токен
        showOutOfProfileMenu(); // Показать меню для незарегистрированного пользователя
      } else {
        console.error(`Ошибка сервера (${status}):`, data);
        alert('Произошла ошибка на сервере. Пожалуйста, попробуйте позже.');
      }
    } else {
      console.error('Сетевая ошибка:', error.message);
      alert('Проблема с сетью. Проверьте ваше подключение к интернету.');
    }
  }
  
  function logoutUser() {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    if (token) {
      axios
        .post('http://localhost:8080/api/auth/logout', null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          console.log('Logout successful!');
          localStorage.removeItem('token'); // Удаляем токен
          window.location.href = '/index.html'; // Перенаправляем на страницу входа
        })
        .catch(error => {
          console.error('Ошибка при выходе:', error.response ? error.response.data : error.message);
        });
    } else {
      console.log('No token found, user might already be logged out');
    }
  }

  // Функция для отображения меню для незарегистрированных пользователей
function showOutOfProfileMenu() {
    showHeader();
    showFooter();
    const profileMenu = document.querySelector(".profileMenu");
    profileMenu.innerHTML = `
          <a class="nav-link" href="/pages/login/login.html">
              Log in
          </a>
      `;
  }

  function showHeader(){
    const header = document.createElement("header");  // Создаем элемент <header>
    header.innerHTML = `
    <header>
        <div class="bg-black text-light">
            <p class="text-center p-3">
                Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! <a href="/pages/shop/shop.html">Shop
                    now</a>
            </p>
        </div>
        <nav class="navbar navbar-expand-lg  ">
            <div class="container">
                <a class="navbar-brand" href="/index.html">
                    E-commerce
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/index.html">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page"
                                href="/pages/contact/contact.html">Contact</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/pages/about/about.html">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page"
                                href="/pages/registration/registration.html">Sign up</a>
                        </li>
                        <li class="nav-item">
                            <a href="/pages/shop/shop.html" class="btn btn-danger text-light">Shop</a>
                        </li>



                    </ul>
                    <form class="d-flex align-items-center" role="search">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                        <i class="bi bi-search fs-3"></i>

                    </form>

                    <!-- <div class="profileMenu mx-3 d-flex align-items-center gap-2">
                        <a href="/pages/cart/cart.html">
                            <i class="bi bi-cart3 fs-3 mx-3"></i>
                        </a>
                        <a href="/pages/profile/profile.html">
                            <i class="bi bi-person-circle fs-2"></i>
                        </a>
                        <span class="username">Tural
                        </span>
                        <button class="logoutBtn btn btn-danger">
                            Log out
                        </button>
                    </div> -->
                    <div class="profileMenu mx-3 d-flex align-items-center gap-2">
                        <a class="nav-link bg-danger text-light p-2 rounded" href="/pages/login/login.html">
                            Log in
                        </a>
                    </div>


                </div>
            </div>
        </nav>

    </header>
    `
    document.body.insertBefore(header, document.body.firstChild);  // Вставляем <header> в начало <body>
  }

  function showFooter() {
    const footer = document.createElement("footer");  // Создаем элемент <footer>
    footer.innerHTML = `
      <footer class="bg-black p-5 text-light mt-5">
          <div class="row">
              <div class="col">
                  <h4 class="mb-3">
                      Exclusive
                  </h4>
                  <p>
                      Subscribe
                  </p>
                  <p>
                      Get 10% off your first order
                  </p>
                  <input class=" p-2 bg-transparent border border-light " type="text" placeholder=" Enter your email">
              </div>
              <div class="col">
                  <h4 class="mb-3">
                      Support
                  </h4>
                  <p>
                      111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
                  </p>
                  <p>
                      exclusive@gmail.com
                  </p>
                  <p>
                      +88015-88888-9999
                  </p>
              </div>
              <div class="col">
                  <h4 class="mb-3">
                      Account </h4>
                  <p>
                      My Account
                  </p>
                  <p>
                      Login / Register
                  </p>
                  <p>
                      Cart
                  </p>
                  <p>
                      Shop
                  </p>
              </div>
              <div class="col">
                  <h4 class="mb-3">
                      Quick Link </h4>
                  <p>
                      Privacy Policy
                  </p>
                  <p>
                      Terms Of Use
                  </p>
                  <p>
                      FAQ
                  </p>
                  <p>
                      Contact
                  </p>
              </div>
              <div class="col">
                  <h4 class="mb-3">
                      Download App
                  </h4>
                  <p>
                      <small class="text-secondary">
                          Save $3 with App New User Only
                      </small>
                  </p>
                  <div>
                      <img src="/images/footer/qr.png" alt="">
                  </div>
              </div>
  
  
          </div>
          <div class="mt-5">
              <p class="text-secondary text-center">
                  Copyright Rimel 2022. All right reserved
              </p>
          </div>
      </footer>
      `;  // Устанавливаем содержимое для <footer>
    document.body.appendChild(footer);  // Добавляем <footer> в конец <body>
  }
  
  
  console.log("script.js")
  fetchUserProfile();
  
