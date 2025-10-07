// ===== Olive Mapper - Main Application =====

// State Management
let trees = [];
let map = null;
let markerCluster = null;
let userMarker = null;
let currentPosition = null;
let editingTreeId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadTrees();
    setupEventListeners();
    initializeMap();
    updateStatistics();
    checkInstallPrompt();
    loadTheme();
    
    // Request location permission
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentPosition = position;
                updateGPSStatus('GPS ενεργό ✓', 'success');
                centerMapOnUser();
            },
            (error) => {
                updateGPSStatus('GPS μη διαθέσιμο', 'error');
            }
        );
    } else {
        updateGPSStatus('GPS δεν υποστηρίζεται', 'error');
    }
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Capture tree
    document.getElementById('captureBtn').addEventListener('click', captureTree);
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Export buttons
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
    document.getElementById('exportGeoJSON').addEventListener('click', exportToGeoJSON);
    
    // Import
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', handleImport);
    
    // Clear all
    document.getElementById('clearAllBtn').addEventListener('click', clearAllTrees);
    
    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    
    // Map center button
    document.getElementById('centerMapBtn').addEventListener('click', centerMapOnUser);
    
    // Modal controls
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('cancelEdit').addEventListener('click', closeModal);
    document.getElementById('saveEdit').addEventListener('click', saveEdit);
    
    // Install prompt
    document.getElementById('dismissInstall').addEventListener('click', () => {
        document.getElementById('installPrompt').style.display = 'none';
        localStorage.setItem('installPromptDismissed', 'true');
    });
    
    // Close modal on outside click
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target.id === 'editModal') {
            closeModal();
        }
    });
}

// ===== GPS & Tree Capture =====
function captureTree() {
    const btn = document.getElementById('captureBtn');
    
    if (!('geolocation' in navigator)) {
        showToast('Το GPS δεν υποστηρίζεται από τη συσκευή σας', 'error');
        return;
    }
    
    btn.classList.add('loading');
    btn.disabled = true;
    updateGPSStatus('Λήψη τοποθεσίας...', '');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const tree = {
                id: generateId(),
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: new Date().toISOString(),
                notes: '',
                variety: ''
            };
            
            trees.push(tree);
            saveTrees();
            updateStatistics();
            renderTreeList();
            addMarkerToMap(tree);
            
            btn.classList.remove('loading');
            btn.disabled = false;
            updateGPSStatus(`Δέντρο καταγράφηκε! (±${Math.round(position.coords.accuracy)}m)`, 'success');
            showToast('🫒 Δέντρο καταγράφηκε επιτυχώς!', 'success');
            
            // Auto-switch to list tab to show the new tree
            switchTab('list');
        },
        (error) => {
            btn.classList.remove('loading');
            btn.disabled = false;
            
            let errorMsg = 'Σφάλμα GPS';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg = 'Παρακαλώ ενεργοποιήστε τα δικαιώματα τοποθεσίας';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg = 'Η τοποθεσία δεν είναι διαθέσιμη';
                    break;
                case error.TIMEOUT:
                    errorMsg = 'Λήξη χρονικού ορίου GPS';
                    break;
            }
            
            updateGPSStatus(errorMsg, 'error');
            showToast(errorMsg, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function updateGPSStatus(message, className) {
    const status = document.getElementById('gpsStatus');
    status.textContent = message;
    status.className = 'gps-status ' + className;
}

// ===== Local Storage =====
function saveTrees() {
    localStorage.setItem('oliveTrees', JSON.stringify(trees));
}

function loadTrees() {
    const stored = localStorage.getItem('oliveTrees');
    if (stored) {
        trees = JSON.parse(stored);
        renderTreeList();
        renderMarkersOnMap();
    }
}

// ===== Tree List Rendering =====
function renderTreeList() {
    const listContainer = document.getElementById('treeList');
    
    if (trees.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🫒</div>
                <p>Δεν υπάρχουν καταγεγραμμένα δέντρα</p>
                <p class="empty-subtitle">Πατήστε "Καταγραφή Δέντρου" για να ξεκινήσετε</p>
            </div>
        `;
        return;
    }
    
    // Sort trees by date (newest first)
    const sortedTrees = [...trees].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    listContainer.innerHTML = sortedTrees.map(tree => `
        <div class="tree-item" data-id="${tree.id}">
            <div class="tree-header">
                <div class="tree-info">
                    <h3>🫒 Δέντρο #${trees.indexOf(tree) + 1}</h3>
                    <div class="tree-date">${formatDate(tree.timestamp)}</div>
                </div>
                <div class="tree-actions">
                    <button class="btn-icon-small" onclick="editTree('${tree.id}')" title="Επεξεργασία">
                        ✏️
                    </button>
                    <button class="btn-icon-small" onclick="locateTree('${tree.id}')" title="Εμφάνιση στον χάρτη">
                        📍
                    </button>
                    <button class="btn-icon-small" onclick="deleteTree('${tree.id}')" title="Διαγραφή">
                        🗑️
                    </button>
                </div>
            </div>
            <div class="tree-details">
                <div class="tree-detail">
                    <strong>Γεωγρ. Πλάτος:</strong> ${tree.latitude.toFixed(6)}
                </div>
                <div class="tree-detail">
                    <strong>Γεωγρ. Μήκος:</strong> ${tree.longitude.toFixed(6)}
                </div>
                <div class="tree-detail">
                    <strong>Ακρίβεια:</strong> ±${Math.round(tree.accuracy)}m
                </div>
                ${tree.variety ? `
                    <div class="tree-detail">
                        <strong>Ποικιλία:</strong> ${tree.variety}
                    </div>
                ` : ''}
            </div>
            ${tree.notes ? `
                <div class="tree-notes">
                    <strong>Σημειώσεις:</strong> ${tree.notes}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// ===== Tree Operations =====
window.editTree = function(id) {
    const tree = trees.find(t => t.id === id);
    if (!tree) return;
    
    editingTreeId = id;
    document.getElementById('editNotes').value = tree.notes || '';
    document.getElementById('editVariety').value = tree.variety || '';
    document.getElementById('editModal').classList.add('active');
}

window.deleteTree = function(id) {
    if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το δέντρο;')) {
        trees = trees.filter(t => t.id !== id);
        saveTrees();
        updateStatistics();
        renderTreeList();
        renderMarkersOnMap();
        showToast('Το δέντρο διαγράφηκε', 'success');
    }
}

window.locateTree = function(id) {
    const tree = trees.find(t => t.id === id);
    if (!tree) return;
    
    switchTab('map');
    map.setView([tree.latitude, tree.longitude], 18);
    
    // Flash the marker
    setTimeout(() => {
        showToast('Το δέντρο εμφανίζεται στον χάρτη', 'success');
    }, 300);
}

function clearAllTrees() {
    if (trees.length === 0) {
        showToast('Δεν υπάρχουν δέντρα για διαγραφή', 'error');
        return;
    }
    
    if (confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε όλα τα ${trees.length} δέντρα; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.`)) {
        trees = [];
        saveTrees();
        updateStatistics();
        renderTreeList();
        renderMarkersOnMap();
        showToast('Όλα τα δέντρα διαγράφηκαν', 'success');
    }
}

function saveEdit() {
    const tree = trees.find(t => t.id === editingTreeId);
    if (!tree) return;
    
    tree.notes = document.getElementById('editNotes').value.trim();
    tree.variety = document.getElementById('editVariety').value.trim();
    
    saveTrees();
    renderTreeList();
    renderMarkersOnMap();
    closeModal();
    showToast('Οι αλλαγές αποθηκεύτηκαν', 'success');
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    editingTreeId = null;
}

// ===== Map Integration =====
function initializeMap() {
    // Initialize map centered on Greece
    map = L.map('map').setView([38.0, 23.0], 6);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Initialize marker cluster group
    markerCluster = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            return L.divIcon({
                html: `<div style="background: #2d5016; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${count}</div>`,
                className: 'custom-cluster',
                iconSize: L.point(40, 40)
            });
        }
    });
    
    map.addLayer(markerCluster);
    
    // Render existing markers
    renderMarkersOnMap();
}

function renderMarkersOnMap() {
    if (!markerCluster) return;
    
    markerCluster.clearLayers();
    
    trees.forEach((tree, index) => {
        addMarkerToMap(tree, index);
    });
}

function addMarkerToMap(tree, index) {
    if (!markerCluster) return;
    
    const treeNumber = index !== undefined ? index + 1 : trees.indexOf(tree) + 1;
    
    // Create custom green marker icon
    const customIcon = L.divIcon({
        html: '<div style="background: #2d5016; border: 3px solid white; border-radius: 50%; width: 30px; height: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    const marker = L.marker([tree.latitude, tree.longitude], { icon: customIcon });
    
    const popupContent = `
        <div class="marker-popup">
            <h3>🫒 Δέντρο #${treeNumber}</h3>
            <p><strong>Ημερομηνία:</strong> ${formatDate(tree.timestamp)}</p>
            <p><strong>Συντεταγμένες:</strong><br>${tree.latitude.toFixed(6)}, ${tree.longitude.toFixed(6)}</p>
            <p><strong>Ακρίβεια:</strong> ±${Math.round(tree.accuracy)}m</p>
            ${tree.variety ? `<p><strong>Ποικιλία:</strong> ${tree.variety}</p>` : ''}
            ${tree.notes ? `<p><strong>Σημειώσεις:</strong> ${tree.notes}</p>` : ''}
        </div>
    `;
    
    marker.bindPopup(popupContent);
    markerCluster.addLayer(marker);
}

function centerMapOnUser() {
    if (!map) return;
    
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                map.setView([lat, lng], 15);
                
                // Add or update user marker
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                
                const userIcon = L.divIcon({
                    html: '<div style="background: #2196F3; border: 3px solid white; border-radius: 50%; width: 15px; height: 15px; box-shadow: 0 0 0 8px rgba(33, 150, 243, 0.3);"></div>',
                    className: 'user-marker',
                    iconSize: [15, 15],
                    iconAnchor: [7.5, 7.5]
                });
                
                userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
                userMarker.bindPopup('Η τοποθεσία σας').openPopup();
                
                showToast('Ο χάρτης κεντραρίστηκε στην τοποθεσία σας', 'success');
            },
            (error) => {
                showToast('Δεν ήταν δυνατή η λήψη της τοποθεσίας σας', 'error');
            }
        );
    }
}

// ===== Statistics =====
function updateStatistics() {
    document.getElementById('totalTrees').textContent = trees.length;
    
    if (trees.length < 3) {
        document.getElementById('areaSize').textContent = '—';
        document.getElementById('density').textContent = '—';
        return;
    }
    
    // Calculate area using convex hull approximation
    const lats = trees.map(t => t.latitude);
    const lngs = trees.map(t => t.longitude);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Calculate approximate area in square meters
    const latDistance = haversineDistance(minLat, minLng, maxLat, minLng);
    const lngDistance = haversineDistance(minLat, minLng, minLat, maxLng);
    const area = Math.round(latDistance * lngDistance);
    
    document.getElementById('areaSize').textContent = formatArea(area);
    
    // Calculate density (trees per hectare)
    if (area > 0) {
        const hectares = area / 10000;
        const density = Math.round(trees.length / hectares);
        document.getElementById('density').textContent = density;
    } else {
        document.getElementById('density').textContent = '—';
    }
}

// ===== Export Functions =====
function exportToCSV() {
    if (trees.length === 0) {
        showToast('Δεν υπάρχουν δεδομένα για εξαγωγή', 'error');
        return;
    }
    
    const headers = ['ID', 'Γεωγρ. Πλάτος', 'Γεωγρ. Μήκος', 'Ακρίβεια (m)', 'Ημερομηνία', 'Ποικιλία', 'Σημειώσεις'];
    const rows = trees.map((tree, index) => [
        index + 1,
        tree.latitude,
        tree.longitude,
        Math.round(tree.accuracy),
        tree.timestamp,
        tree.variety || '',
        tree.notes || ''
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(field => `"${field}"`).join(',') + '\n';
    });
    
    downloadFile(csv, `olive-trees-${getDateString()}.csv`, 'text/csv');
    showToast('Το αρχείο CSV εξήχθη επιτυχώς', 'success');
}

function exportToGeoJSON() {
    if (trees.length === 0) {
        showToast('Δεν υπάρχουν δεδομένα για εξαγωγή', 'error');
        return;
    }
    
    const geojson = {
        type: 'FeatureCollection',
        features: trees.map((tree, index) => ({
            type: 'Feature',
            properties: {
                id: index + 1,
                timestamp: tree.timestamp,
                accuracy: Math.round(tree.accuracy),
                variety: tree.variety || '',
                notes: tree.notes || ''
            },
            geometry: {
                type: 'Point',
                coordinates: [tree.longitude, tree.latitude]
            }
        }))
    };
    
    const json = JSON.stringify(geojson, null, 2);
    downloadFile(json, `olive-trees-${getDateString()}.geojson`, 'application/geo+json');
    showToast('Το αρχείο GeoJSON εξήχθη επιτυχώς', 'success');
}

// ===== Import Functions =====
function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            
            if (file.name.endsWith('.csv')) {
                importCSV(content);
            } else if (file.name.endsWith('.json') || file.name.endsWith('.geojson')) {
                importGeoJSON(content);
            } else {
                showToast('Μη υποστηριζόμενος τύπος αρχείου', 'error');
            }
        } catch (error) {
            showToast('Σφάλμα κατά την εισαγωγή αρχείου', 'error');
            console.error(error);
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
}

function importCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
        showToast('Το αρχείο CSV είναι κενό', 'error');
        return;
    }
    
    const importedTrees = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').trim());
        
        if (values.length >= 5) {
            const tree = {
                id: generateId(),
                latitude: parseFloat(values[1]),
                longitude: parseFloat(values[2]),
                accuracy: parseFloat(values[3]) || 10,
                timestamp: values[4] || new Date().toISOString(),
                variety: values[5] || '',
                notes: values[6] || ''
            };
            
            if (!isNaN(tree.latitude) && !isNaN(tree.longitude)) {
                importedTrees.push(tree);
            }
        }
    }
    
    if (importedTrees.length > 0) {
        trees.push(...importedTrees);
        saveTrees();
        updateStatistics();
        renderTreeList();
        renderMarkersOnMap();
        showToast(`Εισήχθησαν ${importedTrees.length} δέντρα από CSV`, 'success');
    } else {
        showToast('Δεν βρέθηκαν έγκυρα δεδομένα στο CSV', 'error');
    }
}

function importGeoJSON(content) {
    const geojson = JSON.parse(content);
    
    if (!geojson.features || !Array.isArray(geojson.features)) {
        showToast('Μη έγκυρο αρχείο GeoJSON', 'error');
        return;
    }
    
    const importedTrees = geojson.features.map(feature => {
        const coords = feature.geometry.coordinates;
        const props = feature.properties || {};
        
        return {
            id: generateId(),
            latitude: coords[1],
            longitude: coords[0],
            accuracy: props.accuracy || 10,
            timestamp: props.timestamp || new Date().toISOString(),
            variety: props.variety || '',
            notes: props.notes || ''
        };
    }).filter(tree => !isNaN(tree.latitude) && !isNaN(tree.longitude));
    
    if (importedTrees.length > 0) {
        trees.push(...importedTrees);
        saveTrees();
        updateStatistics();
        renderTreeList();
        renderMarkersOnMap();
        showToast(`Εισήχθησαν ${importedTrees.length} δέντρα από GeoJSON`, 'success');
    } else {
        showToast('Δεν βρέθηκαν έγκυρα δεδομένα στο GeoJSON', 'error');
    }
}

// ===== Tab Switching =====
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Refresh map when switching to map tab
    if (tabName === 'map' && map) {
        setTimeout(() => {
            map.invalidateSize();
            if (trees.length > 0) {
                const bounds = L.latLngBounds(trees.map(t => [t.latitude, t.longitude]));
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }, 100);
    }
}

// ===== Dark Mode =====
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.querySelector('.dark-mode-icon');
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const icon = document.querySelector('.dark-mode-icon');
    icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// ===== PWA Installation =====
let deferredPrompt;

function checkInstallPrompt() {
    const dismissed = localStorage.getItem('installPromptDismissed');
    
    if (!dismissed) {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            document.getElementById('installPrompt').style.display = 'block';
        });
        
        document.getElementById('installBtn').addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                showToast('Ευχαριστούμε για την εγκατάσταση!', 'success');
            }
            
            deferredPrompt = null;
            document.getElementById('installPrompt').style.display = 'none';
        });
    }
}

// ===== Toast Notifications =====
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Utility Functions =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('el-GR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getDateString() {
    return new Date().toISOString().split('T')[0];
}

function formatArea(sqMeters) {
    if (sqMeters < 10000) {
        return sqMeters.toLocaleString('el-GR');
    } else {
        const hectares = (sqMeters / 10000).toFixed(2);
        return `${hectares} εκτ.`;
    }
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

