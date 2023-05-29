import axios from "axios"
import { showAlert } from './alerts';

export const createNewItem = async (data) => {
    try {
        const res = await axios({
            method: "POST",
            url: "api/v1/items",
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