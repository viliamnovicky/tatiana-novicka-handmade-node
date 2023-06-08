import { createNewProduct, updateProduct} from "./handleProducts";
import { showAlert } from './alerts';
import { createNewCategory } from "./createNewCategory";
import { closeModal, showModal } from "./helpers";
import { createModalLoginMarkup } from "./markups";
import { login, logout } from "./auth";
import { displayMap } from "./mapbox";
import { sendEmail } from "./emailJS";

if (document.querySelector("#map"))
    displayMap()

const modal = document.querySelector(".modal__dynamic")

// ACTIVE NAVBAR LINK
document.querySelectorAll(".navbar__link").forEach(link => window.location.href === link.href ? link.classList.add("active") : link.classList.remove("active"))

// HAMBURGER MENU
const hamburgerButton = document.querySelector(".navbar__hamburger");
const navbarLinks = document.querySelectorAll(".navbar__link");

hamburgerButton.addEventListener("click", () => {
  const expanded = hamburgerButton.getAttribute("aria-expanded") === "true" || false;
  hamburgerButton.setAttribute("aria-expanded", !expanded);
  navbarLinks.forEach(link => link.classList.toggle("active"));
});

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

modal.addEventListener("click", function(e) {
    e.preventDefault()
    if(e.target.closest("#login-btn")) {
        const name = document.getElementById("name").value
        const password = document.getElementById("password").value
        login(name, password)
    }

})

//LOGOUT
if(document.querySelector(".btn__logout")) {
    document.querySelector(".btn__logout").addEventListener("click", (e) => {
        e.preventDefault()
        logout()
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
        createNewProduct(form)
    })
}

// UPDATE PRODUCT
if (document.getElementById("btn-update-product")) {
    const id = document.querySelector('.form__new-item').id
    const productForm = document.querySelector('.form__new-item');

    productForm.addEventListener("submit", function(e) {
        e.preventDefault()
        const form = new FormData()

        form.append("name", document.getElementById('name').value)
        form.append("price", document.getElementById('price').value)
        form.append("category", document.getElementById('category').value)
        form.append("availability", document.getElementById('availability').value)
        form.append("description", document.getElementById('description').innerHTML)
        
        if(document.getElementById('coverImage').files[0])
            form.append('coverImage', document.getElementById('coverImage').files[0]);
        
        const i = document.getElementById('productImages').files.length;
        for (let x = 0; x < i; x++) {
            form.append("productImages", document.getElementById('productImages').files[x]);
        }
        
        updateProduct(id, form)
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

// SEND EMAIL 
if(document.querySelector(".form__contact")) {
    const form = document.querySelector(".form__contact")
    form.addEventListener("submit", function(e) {
        e.preventDefault()

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        console.log(name, email, message)
        sendEmail(name, email, message)

    })
}


