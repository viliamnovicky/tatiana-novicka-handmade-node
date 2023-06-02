import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (name, password) => {
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/admin/login",
            data: {
                name,
                password
            }
        })
        console.log(res.data.status)
        if (res.data.status === 'success') {
            showAlert('success', 'Prihlásenie prebehlo úspešne');
            window.setTimeout(() => {
                location.reload()
            }, 500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const logout = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/api/v1/admin/logout',
      });
      if (res.data.status === 'success') {
        showAlert('success', 'Odhlásenie prebehlo úspešne');
        window.setTimeout(() => {
          location.assign('/');
        }, 500);
      }
    } catch (err) {
      showAlert('error', 'Nepodarilo sa odhlásiť');
    }
  };