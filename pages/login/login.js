import restApiUrl from "/js/script.js"

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {

            // Получаем значения из полей формы
            const username = document.querySelector(".username").value;
            const password = document.querySelector(".password").value;



            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                event.stopPropagation()

                const userData = {
                    username,    // Добавляем имя пользователя
                    password,    // Добавляем пароль
                };

                // Отправляем POST-запрос на сервер для авторизации
                axios.post(restApiUrl + "/auth/login", userData)
                    .then((response) => {
                        // Если сервер вернул ответ с данными (например, токен)
                        if (response.data) {
                            alert("Successful login: "); // Выводим сообщение об успешном входе
                            localStorage.setItem("token", response.data); // Сохраняем токен в localStorage
                        } else {
                            alert("Successful login"); // Выводим общее сообщение об успешном входе
                        }
                        // Перенаправляем пользователя на главную страницу
                        window.location.href = "/index.html";
                    })
                    .catch((error) => {
                        // Обрабатываем ошибки, возвращённые сервером
                        if (error.response && error.response.data) {
                            alert("Login error: " + (error.response.data.message || error.response.data)); // Ошибка с подробным сообщением
                        } else if (error.request) {
                            alert("Request error: No response from the server."); // Ошибка запроса, сервер не ответил
                        } else {
                            alert("Unknown error: " + error.message); // Любая другая ошибка
                        }
                    });

            }

            form.classList.add('was-validated')
        }, false)
    })
})()