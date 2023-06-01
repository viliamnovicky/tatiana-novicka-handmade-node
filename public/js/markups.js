const modalDynamic = document.querySelector(".modal__dynamic")
const modalStatic = document.querySelector(".modal__static")

export const createModalLoginMarkup = () => {
    modalDynamic.classList.add("modal__small")
    modalStatic.classList.add("modal__small")
    modalDynamic.insertAdjacentHTML("beforeend", `
    <h3 class="title__header">Prihlásenie</h3>
    <img class = "img img__contact-blob" src="/img/contact-blob.png"></img>
    <form class = "form form__login">
        <label for="name">meno</label>
        <input id="name" type="text" name="name">
        <label for="password">heslo</label>
        <input id="password" type="password" name="password">
        <button class="btn btn__primary">prihlásiť</button>
    </form>
    `)
}