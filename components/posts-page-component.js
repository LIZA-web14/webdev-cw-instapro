import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

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

  // Навешиваем клик для перехода на посты пользователя
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
