import axios from "axios"
import { showAlert } from './alerts';

export const createNewProduct = async (data) => {
    try {
        const res = await axios({
            method: "POST",
            url: "api/v1/products",
            data
        })

        console.log(res.data.status)
        
        if (res.data.status === 'success')
            console.log(res.data.status, "yupiii")
            showAlert('success', 'Produkt úspešne pridaný do databázy', 5);
            window.setTimeout(() => {
                location.assign('/novy-produkt');
            }, 500);
    } catch (err) {
        showAlert('error', 'Niečo sa nepodarilo', 5);
    }
}

export const updateProduct = async (id, data) => {
    try {
        const res = await axios({
            method: "PATCH",
            url: `./../api/v1/products/${id}`,
            data
        })
        if (res.data.status === 'success')
            
            showAlert('success', 'Informácie o produkte úspešne zmenené', 5);
            window.setTimeout(() => {
                location.assign(`/produkty/${category}/${id}`);
            }, 500);
    } catch(err) {
        showAlert("error", "Niečo sa nepodarilo", 5)
    }
}