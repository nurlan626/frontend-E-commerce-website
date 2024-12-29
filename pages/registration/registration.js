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
            const name = document.querySelector(".name").value;
            const surname = document.querySelector(".surname").value;
            const email = document.querySelector(".email").value;
            const username = document.querySelector(".username").value;
            const password = document.querySelector(".password").value;



            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                event.stopPropagation()

                // Создаем объект нового пользователя
                const newUser = {
                    name,        // Добавляем имя
                    surname,     // Добавляем фамилию
                    username,    // Добавляем имя пользователя
                    password,    // Добавляем пароль
                    email,       // Добавляем email
                };

                axios.post(restApiUrl + "/auth/register", newUser)
                    .then((response) => {
                        // Предполагается, что сервер возвращает объект с полем message
                        console.log(response.data);
                        if (response.data.message) {
                            alert("Успешная регистрация: " + response.data.message);
                        } else {
                            alert("Регистрация прошла успешно!");
                        }
                        // Перенаправление на страницу входа
                        window.location.href = "/pages/logIn/login.html";
                    })
                    .catch((error) => {
                        console.error(error);

                        // Обработка ошибки в случае неправильных данных
                        if (error.response) {
                            // Если ошибка от сервера, то берем текст из response.data
                            alert("Ошибка при регистрации: " + error.response.data);
                        } else if (error.request) {
                            // Ошибка, если запрос не был отправлен
                            alert("Ошибка запроса: Нет ответа от сервера.");
                        } else {
                            // Другая ошибка (например, ошибка в настройках axios)
                            alert("Неизвестная ошибка: " + error.message);
                        }
                    });

            }

            form.classList.add('was-validated')
        }, false)
    })
})()