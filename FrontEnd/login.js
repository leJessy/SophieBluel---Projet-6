
document.querySelector('#submit').addEventListener('click', async (event) => {
    event.preventDefault();
  
    // Sélection de la balise email et password par l'id
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
  
    // url de l'API
    const api = 'http://localhost:5678/api/users/login';
  
    // Séléction de la requête envoyé à l'API
    const requestBody = JSON.stringify({ email, password });
  
    try {
      // Envoi de la requête à l'API
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
  
      // Sélection de la réponse de l'API
      const responseBody = await response.json();
  
      // Si l'API retourne un status ok alors le login a fonctionné
      if (response.ok) {
        // Sélection du token
        const token = responseBody.token;
  
        // Storage du token dans la session
        sessionStorage.setItem('token', token);
  
        // Redirection vers la page principal
        window.location.href = './index.html';
      } else {
        // Si il y a une erreur alors afficher ce message
        alert('Mauvais E-mail ou mot de passe.');
      }
    } catch (error) {
      // Si il y a une erreur lors de l'envoi de la requête (API offline)
      alert('Une erreur est apparu, réessayez plus tard.');
    }
  });
  
  