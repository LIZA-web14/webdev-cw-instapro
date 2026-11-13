import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  // Переменная для хранения ссылки на загруженное фото
  let imageUrl = "";

  const render = () => {
    // @TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
  <h3 class="form-title">Добавить пост</h3>
  <div class="form-inputs">
    <!-- Пустое место, куда встроится кнопка загрузки фото -->
    <div class="upload-image-container"></div>

    <!-- Поле для ввода описания -->
    <label>
      Опишите фотографию:
      <textarea class="input textarea" id="description-input" rows="4"></textarea>
    </label>

    <button class="button" id="add-button">Добавить</button>
  </div>
</div>
      
    </div>
  `;

    appEl.innerHTML = appHtml;

    // 1. Отрисовываем шапку сайта
renderHeaderComponent({
  element: document.querySelector(".header-container"),
});
// 2. Отрисовываем компонент загрузки картинки
const uploadImageContainer = appEl.querySelector(".upload-image-container");



if (uploadImageContainer) {
  renderUploadImageComponent({
    element: uploadImageContainer,
    onImageUrlChange(newImageUrl) {
      imageUrl = newImageUrl;
    },
  });
}

document.getElementById("add-button").addEventListener("click", () => {
  const descriptionInput = document.getElementById("description-input");

  if (!imageUrl) {
    alert("Пожалуйста, выберите фотографию");
    return;
  }

  if (!descriptionInput.value.trim()) {
    alert("Пожалуйста, добавьте описание к фотографии");
    return;
  };

  // Защита от опасных HTML-тегов (XSS-уязвимость)
      const safeDescription = descriptionInput.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
        
        // Отправляем данные
      onAddPostClick({
        description: safeDescription,
        imageUrl: imageUrl,
});
    });
  };



    
  render();
}
