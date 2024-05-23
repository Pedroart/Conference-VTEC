
(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this.addEventListener('readystatechange', function() {
        if (this.readyState === 4 && method === 'POST' && url === 'https://api.utec.edu.pe/conference-api/v1/conference/list/meeting/student') {
          try {
            const responseText = JSON.parse(this.responseText);
            console.log('POST request to:', url);
            console.log('Response data:', responseText);
            
            // Generar y descargar el archivo CSV
            downloadCSV(responseText.content);
          } catch (e) {
            console.error('Error parsing response JSON:', e);
          }
        }
      });
      open.call(this, method, url, ...rest);
    };
  })(XMLHttpRequest.prototype.open);
   
  function downloadCSV(content) {
    // Crear la cadena CSV
    const csvContent = "data:text/csv;," 
      + "Nombre del Curso;Fecha;Profesor;Enlace de Reproduccion;.\n" 
      + content.map(item => `${item.conference.nameCourse};${item.startTime};${item.conference.nameTeacher.trim()};${item.playUrl || ''};.`).join('\n');
  
    // Crear el enlace de descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'consulta.csv');
    link.textContent = 'Descarga'; // Agrega el texto "Descarga" al enlace
    link.classList.add('btn', 'btn-primary'); // Agrega la clase 'btn' y 'btn-primary' al enlace
  
    // Obtener el elemento específico en el DOM
    const targetElement = document.querySelector("#app > div.content-wrapper > div > div > div.raised.card > div.home-icons.card-body > div:nth-child(3) > div > div > div.col-2.col-md-2.col-lg-6");
  
    // Verificar si ya existe un enlace y reemplazarlo si es necesario
    const existingLink = targetElement.querySelector('.btn.btn-primary');
    if (existingLink) {
      targetElement.replaceChild(link, existingLink);
    } else {
      targetElement.appendChild(link);
    }
}


  