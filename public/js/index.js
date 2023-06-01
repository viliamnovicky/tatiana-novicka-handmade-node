import { createNewItem } from "./createNewItem";
import { showAlert } from './alerts';
import { createNewCategory } from "./createNewCategory";
import { closeModal, showModal } from "./helpers";
import { createModalLoginMarkup } from "./markups";

// ACTIVE NAVBAR LINK
document.querySelectorAll(".navbar__link").forEach(link => window.location.href === link.href ? link.classList.add("active") : link.classList.remove("active"))

// CLOSE MODAL
document.querySelector(".btn__close").addEventListener("click", closeModal)

//LOGIN
if(document.querySelector(".btn__login")) {
    document.querySelector(".btn__login").addEventListener("click", (e) => {
        e.preventDefault()
        showModal()
        createModalLoginMarkup()
    })
}

// CREATE NEW PRODUCT
if (document.getElementById("btn-upload-item")) {

    const newItemForm = document.querySelector('.form__new-item');

    newItemForm.addEventListener("submit", function (e) {
        e.preventDefault()

        const form = new FormData()

        form.append("name", document.getElementById('name').value)
        form.append("price", document.getElementById('price').value)
        form.append("category", document.getElementById('category').value)
        form.append("availability", document.getElementById('availability').value)
        form.append("description", document.getElementById('description').value)
        form.append('coverImage', document.getElementById('coverImage').files[0]);

        const i = document.getElementById('productImages').files.length;
        for (let x = 0; x < i; x++) {
            form.append("productImages", document.getElementById('productImages').files[x]);
        }
        console.log(document.getElementById('name').value)
        createNewItem(form)
    })
}


// CREATE NEW CATEGORY
if(document.getElementById("btn-upload-category")) {

    const newCategoryForm = document.querySelector(".form__new-category")
    newCategoryForm.addEventListener("submit", function(e) {
        e.preventDefault()
        const form = new FormData()

        form.append('name', document.getElementById('name').value)
        form.append('coverImage', document.getElementById('coverImage').files[0])

        createNewCategory(form)
    })
}

