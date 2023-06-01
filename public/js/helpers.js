

export const closeModal = () => {
    const modal = document.querySelector(".modal")
    const modalDynamic = document.querySelector(".modal__dynamic")
    const modalStatic = document.querySelector(".modal__static")

    modal.classList.add("hidden")
    modalDynamic.innerHTML=""
    modalDynamic.classList.remove("modal__small")
    modalStatic.classList.remove("modal__small")
    modalDynamic.classList.remove("modal__medium")
    modalStatic.classList.remove("modal__medium")
    modalDynamic.classList.remove("modal__large")
    modalStatic.classList.remove("modal__large")
    
}

export const showModal = () => {
    document.querySelector(".modal").classList.remove("hidden")
}