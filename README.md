# 🫒 Olive Mapper - Χαρτογράφηση Ελαιοδέντρων

> **Ελληνικά** | [English](#english-version)

## Περιγραφή

Το **Olive Mapper** είναι μια Progressive Web App (PWA) για την ακριβή χαρτογράφηση ελαιοδέντρων με χρήση GPS. Σχεδιασμένη για επαγγελματίες ελαιοκαλλιεργητές και γεωπόνους, προσφέρει πλήρη λειτουργικότητα offline και απλή χρήση.

## ✨ Χαρακτηριστικά

### Βασικές Λειτουργίες
- 📍 **Καταγραφή Δέντρων με GPS**: Απλή καταγραφή με ένα κλικ
- 🗺️ **Διαδραστικός Χάρτης**: Οπτικοποίηση με Leaflet.js και OpenStreetMap
- 💾 **Εξαγωγή/Εισαγωγή**: Υποστήριξη CSV και GeoJSON
- 📊 **Στατιστικά**: Αυτόματος υπολογισμός έκτασης και πυκνότητας
- 📝 **Σημειώσεις**: Προσθήκη ποικιλίας και παρατηρήσεων
- 🌓 **Dark Mode**: Για χρήση σε διαφορετικές συνθήκες φωτισμού

### PWA Χαρακτηριστικά
- ⚡ **Offline Mode**: Πλήρης λειτουργικότητα χωρίς σύνδεση
- 📱 **Installable**: Εγκατάσταση στην αρχική οθόνη
- 🔄 **Service Worker**: Έξυπνη προσωρινή αποθήκευση
- 💪 **Responsive**: Βελτιστοποιημένο για όλες τις συσκευές

## 🚀 Εγκατάσταση στο GitHub Pages

### Βήμα 1: Fork ή Clone

```bash
# Clone του repository
git clone https://github.com/[USERNAME]/ovile.git
cd ovile
```

### Βήμα 2: Push στο GitHub

```bash
# Δημιουργία repository στο GitHub
# Στη συνέχεια:
git add .
git commit -m "Initial commit - Olive Mapper"
git branch -M main
git remote add origin https://github.com/[USERNAME]/[REPO-NAME].git
git push -u origin main
```

### Βήμα 3: Ενεργοποίηση GitHub Pages

1. Πηγαίνετε στο repository σας στο GitHub
2. Κλικ στο **Settings** (Ρυθμίσεις)
3. Scroll down στο **Pages** (Σελίδες)
4. Στο **Source**, επιλέξτε `main` branch και `/ (root)`
5. Κλικ **Save** (Αποθήκευση)
6. Η σελίδα σας θα είναι διαθέσιμη στο: `https://[USERNAME].github.io/[REPO-NAME]/`

### Βήμα 4: Ρύθμιση για Custom Domain (Προαιρετικό)

Αν έχετε δικό σας domain:

1. Προσθέστε ένα αρχείο `CNAME` με το domain σας
2. Ρυθμίστε το DNS του domain σας να δείχνει στο GitHub Pages

## 📱 Χρήση

### Desktop/Laptop

1. Επισκεφτείτε την εφαρμογή στο browser
2. Επιτρέψτε πρόσβαση στην τοποθεσία
3. Κλικ "Καταγραφή Δέντρου" για αποθήκευση

### Mobile (Συνιστάται)

1. Επισκεφτείτε την εφαρμογή από το κινητό
2. Κλικ στο μενού του browser (⋮ ή ⋯)
3. Επιλέξτε "Add to Home Screen" / "Προσθήκη στην αρχική οθόνη"
4. Χρησιμοποιήστε το όπως εφαρμογή!

### Καταγραφή Δέντρων

1. **Καταγραφή**: Πατήστε το μεγάλο πράσινο κουμπί
2. **Προβολή**: Δείτε όλα τα δέντρα στη λίστα
3. **Επεξεργασία**: Προσθέστε ποικιλία και σημειώσεις
4. **Χάρτης**: Δείτε την κατανομή των δέντρων
5. **Εξαγωγή**: Αποθηκεύστε τα δεδομένα σας

## 📊 Εξαγωγή Δεδομένων

### CSV Format
```csv
ID,Γεωγρ. Πλάτος,Γεωγρ. Μήκος,Ακρίβεια (m),Ημερομηνία,Ποικιλία,Σημειώσεις
1,38.123456,23.456789,5,2024-10-07T10:30:00.000Z,Κορωνέικη,Καλή κατάσταση
```

### GeoJSON Format
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": 1,
        "timestamp": "2024-10-07T10:30:00.000Z",
        "variety": "Κορωνέικη",
        "notes": "Καλή κατάσταση"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [23.456789, 38.123456]
      }
    }
  ]
}
```

## 🛠️ Τεχνολογίες

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Maps**: Leaflet.js + OpenStreetMap
- **Clustering**: Leaflet.markercluster
- **PWA**: Service Worker API, Web App Manifest
- **Storage**: LocalStorage API
- **GPS**: Geolocation API
- **Hosting**: GitHub Pages (static)

## 📂 Δομή Αρχείων

```
ovile/
├── index.html          # Κύρια σελίδα εφαρμογής
├── styles.css          # Στυλ και θέματα (light/dark)
├── app.js              # Λογική εφαρμογής
├── manifest.json       # PWA configuration
├── service-worker.js   # Offline functionality
└── README.md          # Τεκμηρίωση
```

## 🔒 Απορρήτο & Ασφάλεια

- ✅ **100% Local**: Όλα τα δεδομένα αποθηκεύονται τοπικά
- ✅ **No Backend**: Δεν υπάρχει server - πλήρης έλεγχος
- ✅ **No Tracking**: Καμία παρακολούθηση ή analytics
- ✅ **Offline First**: Λειτουργεί χωρίς internet
- ⚠️ **Backup**: Κάντε εξαγωγή τακτικά για backup

## 🐛 Αντιμετώπιση Προβλημάτων

### GPS δεν λειτουργεί
- Βεβαιωθείτε ότι το HTTPS είναι ενεργό (απαραίτητο για Geolocation)
- Ελέγξτε τις ρυθμίσεις αδειών του browser
- Για iOS: Settings → Safari → Location Services

### Η εφαρμογή δεν λειτουργεί offline
- Επισκεφτείτε την εφαρμογή μία φορά με internet
- Ελέγξτε αν το Service Worker εγκαταστάθηκε (Developer Tools)
- Κάντε hard refresh (Ctrl+Shift+R ή Cmd+Shift+R)

### Τα δεδομένα χάθηκαν
- Μην διαγράφετε το browser cache/data
- Κάντε τακτικά εξαγωγή CSV/GeoJSON
- Χρησιμοποιήστε λειτουργία εισαγωγής για επαναφορά

## 📈 Μελλοντικές Βελτιώσεις

- [ ] Cloud sync με Firebase/Supabase
- [ ] Φωτογραφίες δέντρων
- [ ] Offline maps caching
- [ ] Polygon drawing για περιοχές
- [ ] Export σε KML (Google Earth)
- [ ] Multi-language support
- [ ] Share locations

## 📄 Άδεια Χρήσης

MIT License - Ελεύθερο για προσωπική και εμπορική χρήση.

## 👨‍💻 Συνεισφορά

Contributions are welcome! Please feel free to submit a Pull Request.

---

## English Version

# 🫒 Olive Mapper - GPS Olive Tree Mapping

A Progressive Web App for accurate GPS mapping of olive trees, designed for professional olive farmers and agronomists.

## Features

- 📍 **GPS Tree Capture**: One-click recording with high accuracy
- 🗺️ **Interactive Map**: Visualization with Leaflet.js and OpenStreetMap
- 💾 **Import/Export**: CSV and GeoJSON support
- 📊 **Statistics**: Automatic area and density calculation
- 📝 **Notes**: Add variety and observations
- 🌓 **Dark Mode**: For different lighting conditions
- ⚡ **Offline Mode**: Full functionality without internet
- 📱 **Installable**: Add to home screen

## Quick Start (GitHub Pages)

1. **Fork/Clone this repository**
   ```bash
   git clone https://github.com/[USERNAME]/ovile.git
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: `main` branch, `/ (root)` folder
   - Save and wait a few minutes
   - Visit: `https://[USERNAME].github.io/[REPO-NAME]/`

4. **Start Using**
   - Allow location permissions
   - Click "Capture Tree" button
   - View on map and export data

## Technology Stack

- Pure HTML5, CSS3, JavaScript (no frameworks)
- Leaflet.js for maps
- Service Worker for offline functionality
- LocalStorage for data persistence
- GitHub Pages for hosting

## Privacy

- 100% local storage
- No backend or tracking
- Full data control
- Offline-first architecture

## License

MIT License - Free for personal and commercial use.

## Support

For issues or questions, please open an issue on GitHub.

---

**Made with 🫒 for olive farmers everywhere**

