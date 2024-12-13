document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners
    document.getElementById('search').addEventListener('keyup', filterSearch);
    document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
    document.getElementById('toggleDarkModeBtn').addEventListener('click', toggleDarkMode);
    document.getElementById('submitFeedbackBtn').addEventListener('click', submitFeedback);
    document.getElementById('savePresetBtn').addEventListener('click', savePreset);
    document.getElementById('loadPresetBtn').addEventListener('click', loadPreset);
    document.getElementById('exportSettingsBtn').addEventListener('click', exportSettings);
    document.getElementById('importSettingsBtn').addEventListener('click', importSettings);
    document.getElementById('resetToDefaultBtn').addEventListener('click', resetToDefault);
    document.getElementById('rateUsBtn').addEventListener('click', rateUs);

    loadPreferences();
    checkForUpdates();
});

function loadPreferences() {
    chrome.storage.sync.get(['filters', 'darkMode', 'presets'], (data) => {
        const filters = data.filters || {};
        Object.keys(filters).forEach(key => {
            document.getElementById(key).checked = filters[key];
        });
        if (data.darkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('filterSection').classList.add('dark-mode');
            document.getElementById('helpSection').classList.add('dark-mode');
        }
        if (data.presets) {
            localStorage.setItem('presets', JSON.stringify(data.presets));
        }
    });
}

function applyFilters() {
    const filters = {
        relationship: document.getElementById('relationship').checked,
        death: document.getElementById('death').checked,
        children: document.getElementById('children').checked,
        politics: document.getElementById('politics').checked,
        health: document.getElementById('health').checked,
        work: document.getElementById('work').checked,
        travel: document.getElementById('travel').checked,
        sports: document.getElementById('sports').checked,
        entertainment: document.getElementById('entertainment').checked,
        technology: document.getElementById('technology').checked,
        environment: document.getElementById('environment').checked,
        finance: document.getElementById('finance').checked,
        education: document.getElementById('education').checked,
        celebrity: document.getElementById('celebrity').checked,
        gaming: document.getElementById('gaming').checked,
        books: document.getElementById('books').checked,
        movies: document.getElementById('movies').checked,
        music: document.getElementById('music').checked
    };

    document.getElementById('loading').style.display = 'block';
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        chrome.storage.sync.set({ filters }, () => {
            showNotification();
            simulateRealTimeFiltering();
        });
    }, 1000);
}

function clearFilters() {
    const checkboxes = document.querySelectorAll('.filter-section input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    chrome.storage.sync.remove('filters', () => {
        alert("Filters cleared!");
    });
}

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    const filterSection = document.getElementById('filterSection');
    const helpSection = document.getElementById('helpSection');
    if (isDarkMode) {
        filterSection.classList.add('dark-mode');
        helpSection.classList.add('dark-mode');
    } else {
        filterSection.classList.remove('dark-mode');
        helpSection.classList.remove('dark-mode');
    }
    chrome.storage.sync.set({ darkMode: isDarkMode });
}

function submitFeedback() {
    const feedback = document.getElementById('feedback').value;
    if (!validateFeedback(feedback)) {
        alert("Please enter a valid feedback message.");
        return;
    }
    alert("Thank you for your feedback!");
    document.getElementById('feedback').value = '';
}

function validateFeedback(feedback) {
    return feedback.trim().length > 0 && feedback.length <= 500;
}

function checkForUpdates() {
    // Simulate an update check
    setTimeout(() => {
        alert("You are using the latest version of the Facebook Content Filter Addon.");
    }, 2000);
}

function filterSearch() {
    const input = document.getElementById('search').value.toLowerCase();
    const labels = document.querySelectorAll('.filter-section label');
    labels.forEach(label => {
        const text = label.textContent.toLowerCase();
        label.style.display = text.includes(input) ? 'block' : 'none';
    });
}

function savePreset() {
    const filters = {
        relationship: document.getElementById('relationship').checked,
        death: document.getElementById('death').checked,
        children: document.getElementById('children').checked,
        politics: document.getElementById('politics').checked,
        health: document.getElementById('health').checked,
        work: document.getElementById('work').checked,
        travel: document.getElementById('travel').checked,
        sports: document.getElementById('sports').checked,
        entertainment: document.getElementById('entertainment').checked,
        technology: document.getElementById('technology').checked,
        environment: document.getElementById('environment').checked,
        finance: document.getElementById('finance').checked,
        education: document.getElementById('education').checked,
        celebrity: document.getElementById('celebrity').checked,
        gaming: document.getElementById('gaming').checked,
        books: document.getElementById('books').checked,
        movies: document.getElementById('movies').checked,
        music: document.getElementById('music').checked
    };
    const presetName = prompt("Enter a name for your preset:");
    if (presetName) {
        let presets = JSON.parse(localStorage.getItem('presets')) || {};
        presets[presetName] = filters;
        localStorage.setItem('presets', JSON.stringify(presets));
        chrome.storage.sync.set({ presets });
        alert("Preset saved!");
    }
}

function loadPreset() {
    const presets = JSON.parse(localStorage.getItem('presets')) || {};
    const presetName = prompt("Enter the name of the preset to load:");
    if (presetName && presets[presetName]) {
        const filters = presets[presetName];
        Object.keys(filters).forEach(key => {
            document.getElementById(key).checked = filters[key];
        });
        chrome.storage.sync.set({ filters });
        alert("Preset loaded!");
    } else {
        alert("Preset not found.");
    }
}

function exportSettings() {
    chrome.storage.sync.get(['filters', 'darkMode', 'presets'], (data) => {
        const filters = JSON.stringify(data);
        const blob = new Blob([filters], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'facebook_filter_settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert("Settings exported!");
    });
}

function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const settings = JSON.parse(e.target.result);
                    chrome.storage.sync.set(settings, () => {
                        alert("Settings imported!");
                        location.reload();
                    });
                } catch (error) {
                    alert("Invalid file format.");
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function resetToDefault() {
    if (confirm("Are you sure you want to reset to default settings?")) {
        chrome.storage.sync.clear(() => {
            location.reload();
        });
    }
}

function showNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function simulateRealTimeFiltering() {
    // Simulate real-time filtering of posts on the Facebook page
    console.log("Simulating real-time filtering...");
}

function rateUs() {
    alert("Thank you for considering rating us! You can rate us on the Chrome Web Store.");
}