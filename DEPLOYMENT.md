# 🚀 Οδηγίες Ανάπτυξης / Deployment Guide

## Γρήγορη Ανάπτυξη στο GitHub Pages

### 1. Δημιουργία Repository

1. Συνδεθείτε στο [GitHub](https://github.com)
2. Κάντε κλικ στο **"New repository"**
3. Όνομα repository: `olive-mapper` (ή ό,τι προτιμάτε)
4. Επιλέξτε **Public**
5. Κάντε κλικ **"Create repository"**

### 2. Upload Αρχείων

**Τρόπος A: Μέσω GitHub Web Interface**
1. Στο νέο repository, κάντε κλικ **"uploading an existing file"**
2. Drag & drop όλα τα αρχεία από τον φάκελο `/Users/kostas/ovile/`
3. Commit τις αλλαγές

**Τρόπος B: Μέσω Git Command Line**
```bash
cd /Users/kostas/ovile/

# Αρχικοποίηση Git (αν δεν έχει γίνει ήδη)
git init

# Προσθήκη όλων των αρχείων
git add .

# Πρώτο commit
git commit -m "🫒 Initial commit - Olive Mapper PWA"

# Σύνδεση με το GitHub repository
git remote add origin https://github.com/[ΤΟ-USERNAME-ΣΑΣ]/olive-mapper.git

# Push στο GitHub
git branch -M main
git push -u origin main
```

### 3. Ενεργοποίηση GitHub Pages

1. Πηγαίνετε στο repository σας στο GitHub
2. Κάντε κλικ στο **Settings** (στην επάνω δεξιά)
3. Στο αριστερό μενού, κάντε κλικ **Pages**
4. Στο **"Source"** επιλέξτε:
   - Branch: `main`
   - Folder: `/ (root)`
5. Κάντε κλικ **Save**
6. Περιμένετε 1-2 λεπτά

### 4. Πρόσβαση στην Εφαρμογή

Η εφαρμογή σας θα είναι διαθέσιμη στο:
```
https://[ΤΟ-USERNAME-ΣΑΣ].github.io/olive-mapper/
```

Για παράδειγμα: `https://kostas.github.io/olive-mapper/`

---

## 📱 Εγκατάσταση στο Κινητό

### iPhone/iPad (Safari)
1. Ανοίξτε το link της εφαρμογής στο Safari
2. Πατήστε το κουμπί **Share** (μοιράστε) 
3. Scroll down και επιλέξτε **"Add to Home Screen"**
4. Πατήστε **"Add"**
5. Το εικονίδιο 🫒 θα εμφανιστεί στην αρχική οθόνη

### Android (Chrome)
1. Ανοίξτε το link της εφαρμογής στο Chrome
2. Πατήστε το μενού (⋮) στην επάνω δεξιά
3. Επιλέξτε **"Add to Home screen"** / **"Προσθήκη στην αρχική οθόνη"**
4. Πατήστε **"Add"**
5. Το εικονίδιο 🫒 θα εμφανιστεί στην αρχική οθόνη

---

## 🧪 Δοκιμή σε Τοπικό Περιβάλλον

### Χρήση Python HTTP Server

```bash
cd /Users/kostas/ovile/

# Python 3
python3 -m http.server 8000

# Ανοίξτε το browser στο:
# http://localhost:8000
```

### Χρήση PHP Built-in Server

```bash
cd /Users/kostas/ovile/

php -S localhost:8000

# Ανοίξτε το browser στο:
# http://localhost:8000
```

### Χρήση npx (Node.js)

```bash
cd /Users/kostas/ovile/

npx serve

# Ακολουθήστε το URL που εμφανίζεται
```

**⚠️ Σημαντικό για GPS:**
- Η Geolocation API λειτουργεί **μόνο σε HTTPS** (εκτός από localhost)
- Στο GitHub Pages θα έχετε αυτόματα HTTPS ✓
- Για τοπική δοκιμή, το `localhost` λειτουργεί κανονικά

---

## ✅ Checklist Πριν την Ανάπτυξη

- [ ] Όλα τα αρχεία είναι στο repository
- [ ] Το `manifest.json` έχει σωστές πληροφορίες
- [ ] Το `service-worker.js` είναι στο root
- [ ] GitHub Pages είναι ενεργοποιημένο
- [ ] Το HTTPS λειτουργεί (αυτόματο στο GitHub Pages)
- [ ] Δοκιμή σε κινητό (GPS, offline mode)

---

## 🔧 Ενημερώσεις

Για να ενημερώσετε την εφαρμογή:

```bash
cd /Users/kostas/ovile/

# Κάντε τις αλλαγές σας στα αρχεία

git add .
git commit -m "Περιγραφή αλλαγών"
git push

# Περιμένετε 1-2 λεπτά για το deploy
```

---

## 🌐 Custom Domain (Προαιρετικό)

Αν θέλετε δικό σας domain (π.χ. `olivemapper.gr`):

1. Αγοράστε ένα domain
2. Στις DNS ρυθμίσεις, προσθέστε:
   ```
   Type: CNAME
   Name: www
   Value: [USERNAME].github.io
   ```
3. Στο GitHub repository, Settings → Pages
4. Στο "Custom domain" προσθέστε το domain σας
5. Κάντε enable το "Enforce HTTPS"

---

## 📞 Υποστήριξη

Για προβλήματα ή ερωτήσεις:
- Ανοίξτε ένα [GitHub Issue](../../issues)
- Ελέγξτε το [README.md](README.md) για troubleshooting

---

**Καλή χαρτογράφηση! 🫒**

