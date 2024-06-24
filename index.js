document.addEventListener('DOMContentLoaded', function () {
    let jobsData = [];
    const container = document.getElementById('jobListings');
    const jobRoleFilter = document.getElementById('jobRoleFilter');
    const technologyFilter = document.getElementById('technologyFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    const ctcRange = document.getElementById('ctcRange');
    const ctcValue = document.getElementById('ctcValue');
    const resetFiltersButton = document.getElementById('resetFilters');

    fetch('https://codejudge-question-artifacts-dev.s3.amazonaws.com/q-1710/data.json')
        .then(response => response.json())
        .then(data => {
            jobsData = data.data; 
            initializeFilters(data);
            renderJobListings(jobsData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function initializeFilters(data) {
        const jobRoles = ['All', ...new Set(data.data.map(job => job.role))];
        const technologies = ['All', ...data.technology];
        const experiences = ['All', ...data.experience];

        populateDropdown(jobRoleFilter, jobRoles);
        populateDropdown(technologyFilter, technologies);
        populateDropdown(experienceFilter, experiences);

        jobRoleFilter.addEventListener('change', applyFilters);
        technologyFilter.addEventListener('change', applyFilters);
        experienceFilter.addEventListener('change', applyFilters);
        ctcRange.addEventListener('input', applyFilters);
        resetFiltersButton.addEventListener('click', resetFilters);
    }

    function populateDropdown(selectElement, options) {
        selectElement.innerHTML = ''; 
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
    }

    function renderJobListings(jobs) {
        container.innerHTML = ''; 
        jobs.forEach(job => {

            const roleFilter = jobRoleFilter.value === 'All' || job.role === jobRoleFilter.value;
            const technologyFilterCondition = technologyFilter.value === 'All' || job.technology.includes(technologyFilter.value);
            const experienceFilterCondition = experienceFilter.value === 'All' || job.experience === experienceFilter.value;
            const ctcFilterCondition = job.ctc >= ctcRange.value;

            if (roleFilter && technologyFilterCondition && experienceFilterCondition && ctcFilterCondition) {
                const jobCard = createJobCard(job);
                container.appendChild(jobCard);
            }
        });

        if (container.innerHTML === '') {
            const noResults = document.createElement('p');
            noResults.textContent = 'No jobs found.';
            container.appendChild(noResults);
        }
    }

    function createJobCard(job) {
        const jobCard = document.createElement('div');
        jobCard.classList.add('jobCard');

        const logo = document.createElement('img');
        logo.src = job.logo;
        logo.alt = job.company + ' Logo';
        jobCard.appendChild(logo);

        const companyName = document.createElement('h2');
        companyName.textContent = job.company;
        jobCard.appendChild(companyName);

        const jobPosition = document.createElement('p');
        jobPosition.textContent = job.position;
        jobCard.appendChild(jobPosition);

        const technologies = document.createElement('p');
        technologies.classList.add('technologies');
        technologies.textContent = `Technologies: ${job.technology.join(', ')}`;
        jobCard.appendChild(technologies);

        const ctc = document.createElement('p');
        ctc.textContent = `CTC: ${job.ctc} LPA`;
        jobCard.appendChild(ctc);

        const details = document.createElement('div');
        details.classList.add('details');

        const experience = document.createElement('span');
        experience.textContent = `Experience: ${job.experience}`;
        details.appendChild(experience);

        const contract = document.createElement('span');
        contract.textContent = `Contract: ${job.contract}`;
        details.appendChild(contract);

        const location = document.createElement('span');
        location.textContent = `Location: ${job.location}`;
        details.appendChild(location);

        jobCard.appendChild(details);

        return jobCard;
    }

    function applyFilters() {
        ctcValue.textContent = `${ctcRange.value} LPA`;
        const filteredJobs = jobsData.filter(job => {
            const roleFilter = jobRoleFilter.value === 'All' || job.role === jobRoleFilter.value;
            const technologyFilterCondition = technologyFilter.value === 'All' || job.technology.includes(technologyFilter.value);
            const experienceFilterCondition = experienceFilter.value === 'All' || job.experience === experienceFilter.value;
            const ctcFilterCondition = job.ctc >= ctcRange.value;

            return roleFilter && technologyFilterCondition && experienceFilterCondition && ctcFilterCondition;
        });

        renderJobListings(filteredJobs);
    }

    function resetFilters() {
        jobRoleFilter.value = 'All';
        technologyFilter.value = 'All';
        experienceFilter.value = 'All';
        ctcRange.value = 0;
        ctcValue.textContent = '0 LPA';
        renderJobListings(jobsData);
    }
});
