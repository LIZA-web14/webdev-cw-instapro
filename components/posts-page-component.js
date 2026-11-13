import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { likePost, dislikePost } from "../api.js";    

export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  // 1. Формируем список постов через .map()
  // Метод берет КАЖДЫЙ post и превращает его в ОДИН тег <li>
  const postsHtml = posts
  .map((post) => {
    return `
                  <li class="post">
          <!-- Шапка поста с ID автора -->
          <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.user.name}</p>
          </div>

          <!-- Фотография поста -->
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>

          <!-- Лайки -->
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
              <img src="./assets/images/${post.isLiked ? "like-active.svg" : "like-not-active.svg"}">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${post.likes.length}</strong>
            </p>
          </div>
          <!-- Текст поста -->
          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description}
          </p>

          <!-- Дата создания -->
          <p class="post-date">
            ${post.createdAt}
          </p>
        </li>
      `;
  }) 
  .join(""); // Склеиваем массив в одну общую строку

  // 2. Оборачиваем посты в контейнеры, включая блок для шапки
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;


  // Отрисовываем шапку сайта
  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  // Обработчик клика на автора поста для перехода на его страницу
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  // Обработчик кликов на кнопки лайков
  // Ищем все кнопки лайков на странице и перебираем их циклом
  for (let likeButton of document.querySelectorAll(".like-button")){
    likeButton.addEventListener("click",(event) =>{
      event.stopPropagation(); // Не даёт клику случайно нажать на родительские элементы
      // 1. Проверяем: вошёл ли пользователь на сайт?
      if(!user){
        alert("Ставить лайки могут только авторезированные пользователи!");
        return; // Если не вошел — прерываем работу
      }
      // 2. Узнаем ID поста из атрибута data-post-id кнопки
      const id = likeButton.dataset.postId; //likeButton.dataset.postId 

      // 3. Находим этот пост в нашем общем массиве posts
      const currentPost = posts.find((post) => post.id === id);

      // Подготавливаем токен авторизации
      const token = `Bearer ${user.token}`;

      // Переключатель: снять или поставить
      if (currentPost.isLiked) {

        // Если ДА — вызываем снятия лайка:
        dislikePost({ token, id })
          .then((data) => {
            currentPost.isLiked = false;
            currentPost.likes = data.post.likes;
            renderPostsPageComponent({ appEl });
          })
          .catch((error) => {
            alert("Не удалось убрать лайк");
          });

      } else {

        // Если НЕТ — вызываем постановки лайка:
        likePost({ token, id })
          .then((data) => {
            currentPost.isLiked = true;
            currentPost.likes = data.post.likes;
            renderPostsPageComponent({ appEl });
          })
          .catch((error) => {
            alert("Не удалось поставить лайк");
          });

      }
    });
  }
}