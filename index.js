console.log(API_URL);

async function fetchData() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }
  
  function renderDynamicContent() {
    const dynamicContentDiv = document.getElementById('dynamic-content');
    dynamicContentDiv.innerHTML = '<p>Loading job listings...</p>';
  
    fetchData().then(data => {
      if (data.length === 0) {
        dynamicContentDiv.innerHTML = '<p>No job listings available.</p>';
        return;
      }
  
      dynamicContentDiv.innerHTML = '';
  
      const table = document.createElement('table');
      table.classList.add('leads_table');

      const headerRow = table.createTHead().insertRow();
      headerRow.innerHTML = `
        <th>Company</th>
        <th>Position</th>
        <th>Location</th>
        <th>Website</th>
      `;

      const tbody = table.createTBody();
      data.forEach(job => {
        const row = tbody.insertRow();
        row.innerHTML = `
          <td>${job.company}</td>
          <td>${job.position}</td>
          <td>${job.location}</td>
          <td><a href="${job.website}" target="_blank">${job.website}</a></td>
        `;
      });
  
      dynamicContentDiv.appendChild(table);
  
    }).catch(error => {
      console.error('Error rendering dynamic content:', error);
      dynamicContentDiv.innerHTML = '<p>Error loading job listings. Please try again later.</p>';
    });
  }

