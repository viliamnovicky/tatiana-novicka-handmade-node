import emailjs from '@emailjs/browser'

export const sendEmail = (name, email, message) => {

    const serviceID = 'service_pvm8ug8';
    const templateID = 'template_5pujdro';
    const userID = '_u15uwA3W4NwttQaw';
  
    // Get the user's input from the form
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    // const message = document.getElementById('message').value;
  
    // Use the emailJS library to send the email
    emailjs.init(userID);
    const params = {
      name: name,
      email: email,
      message: message
    };

    emailjs.send(serviceID, templateID, params)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
      }, function(error) {
        console.log('FAILED...', error);
      });
  }