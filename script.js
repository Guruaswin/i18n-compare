// Global state
let file1Data = null;
let file2Data = null;

// DOM elements
const file1Input = document.getElementById('file1');
const file2Input = document.getElementById('file2');
const compareBtn = document.getElementById('compareBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsSection = document.getElementById('results');
const missingViewBtn = document.getElementById('missingViewBtn');
const commonViewBtn = document.getElementById('commonViewBtn');
const missingKeysView = document.getElementById('missingKeysView');
const commonKeysView = document.getElementById('commonKeysView');

// Event listeners
file1Input.addEventListener('change', (e) => handleFileSelect(e, 1));
file2Input.addEventListener('change', (e) => handleFileSelect(e, 2));
compareBtn.addEventListener('click', compareFiles);
clearBtn.addEventListener('click', clearAll);
missingViewBtn.addEventListener('click', () => toggleView('missing'));
commonViewBtn.addEventListener('click', () => toggleView('common'));

/**
 * Parse a .properties file content into a key-value object
 * @param {string} content - The file content
 * @returns {Object} - Object with keys and their values
 */
function parsePropertiesFile(content) {
    const properties = {};
    const lines = content.split('\n');

    for (let line of lines) {
        // Trim whitespace
        line = line.trim();

        // Skip empty lines and comments
        if (!line || line.startsWith('#') || line.startsWith('!')) {
            continue;
        }

        // Find the first = or : separator
        const separatorIndex = Math.min(
            line.indexOf('=') === -1 ? Infinity : line.indexOf('='),
            line.indexOf(':') === -1 ? Infinity : line.indexOf(':')
        );

        if (separatorIndex === Infinity) {
            continue; // No separator found
        }

        const key = line.substring(0, separatorIndex).trim();
        const value = line.substring(separatorIndex + 1).trim();

        if (key) {
            properties[key] = value;
        }
    }

    return properties;
}

/**
 * Extract locale from filename
 * @param {string} filename - The file name
 * @returns {string} - Extracted locale or filename
 */
function extractLocale(filename) {
    // Remove .properties extension
    const nameWithoutExt = filename.replace(/\.properties$/, '');
    
    // Common patterns: messages_en_US.properties, messages_en.properties, en_US.properties
    const patterns = [
        /_([a-z]{2}_[A-Z]{2})$/,  // _en_US
        /_([a-z]{2})$/,            // _en
        /^([a-z]{2}_[A-Z]{2})$/,   // en_US
        /^([a-z]{2})$/             // en
    ];
    
    for (const pattern of patterns) {
        const match = nameWithoutExt.match(pattern);
        if (match) {
            return match[1];
        }
    }
    
    // If no pattern matches, return the filename without extension
    return nameWithoutExt;
}

/**
 * Handle file selection
 * @param {Event} event - The change event
 * @param {number} fileNumber - 1 or 2
 */
function handleFileSelect(event, fileNumber) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }

    // Update file name display
    const fileNameDisplay = document.getElementById(`file${fileNumber}-name`);
    fileNameDisplay.textContent = file.name;

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        const properties = parsePropertiesFile(content);
        const locale = extractLocale(file.name);
        
        if (fileNumber === 1) {
            file1Data = {
                name: file.name,
                properties: properties,
                locale: locale
            };
        } else {
            file2Data = {
                name: file.name,
                properties: properties,
                locale: locale
            };
        }

        // Enable compare button if both files are loaded
        if (file1Data && file2Data) {
            compareBtn.disabled = false;
        }
    };

    reader.readAsText(file);
}

/**
 * Compare the two loaded files
 */
function compareFiles() {
    if (!file1Data || !file2Data) {
        alert('Please select both files before comparing.');
        return;
    }

    const keys1 = Object.keys(file1Data.properties);
    const keys2 = Object.keys(file2Data.properties);

    // Find missing keys
    const missingInFile1 = keys2.filter(key => !keys1.includes(key));
    const missingInFile2 = keys1.filter(key => !keys2.includes(key));
    const commonKeys = keys1.filter(key => keys2.includes(key));

    // Display results
    displayResults({
        totalKeys1: keys1.length,
        totalKeys2: keys2.length,
        commonKeys: commonKeys,
        missingInFile1: missingInFile1,
        missingInFile2: missingInFile2,
        locale1: file1Data.locale,
        locale2: file2Data.locale,
        file1Properties: file1Data.properties,
        file2Properties: file2Data.properties
    });
}

/**
 * Display comparison results
 * @param {Object} results - The comparison results
 */
function displayResults(results) {
    // Update statistics
    document.getElementById('totalKeys1').textContent = results.totalKeys1;
    document.getElementById('totalKeys2').textContent = results.totalKeys2;
    document.getElementById('commonKeys').textContent = results.commonKeys.length;
    document.getElementById('commonKeysCount').textContent = results.commonKeys.length;

    // Update locale displays
    document.getElementById('locale1Display').textContent = results.locale1;
    document.getElementById('locale2Display').textContent = results.locale2;

    // Update missing counts
    document.getElementById('missingCount1').textContent = results.missingInFile1.length;
    document.getElementById('missingCount2').textContent = results.missingInFile2.length;

    // Display missing keys in file 1
    const missingInFile1Container = document.getElementById('missingInFile1');
    missingInFile1Container.innerHTML = '';
    
    if (results.missingInFile1.length === 0) {
        missingInFile1Container.innerHTML = '<div class="no-missing">No missing keys!</div>';
    } else {
        results.missingInFile1.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.className = 'key-item';
            keyElement.textContent = key;
            missingInFile1Container.appendChild(keyElement);
        });
    }

    // Display missing keys in file 2
    const missingInFile2Container = document.getElementById('missingInFile2');
    missingInFile2Container.innerHTML = '';
    
    if (results.missingInFile2.length === 0) {
        missingInFile2Container.innerHTML = '<div class="no-missing">No missing keys!</div>';
    } else {
        results.missingInFile2.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.className = 'key-item';
            keyElement.textContent = key;
            missingInFile2Container.appendChild(keyElement);
        });
    }

    // Display common keys
    const commonKeysContainer = document.getElementById('commonKeysList');
    commonKeysContainer.innerHTML = '';
    
    if (results.commonKeys.length === 0) {
        commonKeysContainer.innerHTML = '<div class="no-common">No common keys found!</div>';
    } else {
        results.commonKeys.forEach(key => {
            const commonKeyItem = document.createElement('div');
            commonKeyItem.className = 'common-key-item';
            
            const keyName = document.createElement('div');
            keyName.className = 'common-key-name';
            keyName.textContent = key;
            
            const valuesContainer = document.createElement('div');
            valuesContainer.className = 'common-key-values';
            
            const value1 = document.createElement('div');
            value1.className = 'key-value';
            value1.innerHTML = `<span class="value-label">File 1:</span> ${results.file1Properties[key]}`;
            
            const value2 = document.createElement('div');
            value2.className = 'key-value';
            value2.innerHTML = `<span class="value-label">File 2:</span> ${results.file2Properties[key]}`;
            
            valuesContainer.appendChild(value1);
            valuesContainer.appendChild(value2);
            
            commonKeyItem.appendChild(keyName);
            commonKeyItem.appendChild(valuesContainer);
            commonKeysContainer.appendChild(commonKeyItem);
        });
    }

    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Toggle between missing keys and common keys view
 * @param {string} view - 'missing' or 'common'
 */
function toggleView(view) {
    if (view === 'missing') {
        // Toggle missing keys view
        if (missingKeysView.style.display === 'grid') {
            missingKeysView.style.display = 'none';
            missingViewBtn.classList.remove('active');
        } else {
            missingKeysView.style.display = 'grid';
            commonKeysView.style.display = 'none';
            missingViewBtn.classList.add('active');
            commonViewBtn.classList.remove('active');
        }
    } else {
        // Toggle common keys view
        if (commonKeysView.style.display === 'block') {
            commonKeysView.style.display = 'none';
            commonViewBtn.classList.remove('active');
        } else {
            commonKeysView.style.display = 'block';
            missingKeysView.style.display = 'none';
            commonViewBtn.classList.add('active');
            missingViewBtn.classList.remove('active');
        }
    }
}

/**
 * Clear all data and reset the form
 */
function clearAll() {
    // Reset file inputs
    file1Input.value = '';
    file2Input.value = '';

    // Reset file name displays
    document.getElementById('file1-name').textContent = '';
    document.getElementById('file2-name').textContent = '';

    // Reset data
    file1Data = null;
    file2Data = null;

    // Disable compare button
    compareBtn.disabled = true;

    // Hide results
    resultsSection.style.display = 'none';

    // Reset views
    missingKeysView.style.display = 'none';
    commonKeysView.style.display = 'none';
    missingViewBtn.classList.remove('active');
    commonViewBtn.classList.remove('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
