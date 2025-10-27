# BWeb - Task Manager
Webová aplikace pro správu úkolů vytvořená v rámci bakalářské práce

## Popis projektu
BWeb je moderní task manager (správce úkolů) s real-time synchronizací dat pomocí Firebase. Aplikace umožňuje uživatelům vytvářet, upravovat a mazat úkoly s různými prioritami a deadliny.

## Hlavní funkce
- ✅ **Registrace a přihlášení** - Autentizace pomocí Firebase Auth
- ✅ **Správa úkolů** - Vytváření, úprava, mazání a označování úkolů jako dokončených
- ✅ **Kategorie úkolů** - Filtrování podle času (Dnes, Týden, Měsíc, Vše)
- ✅ **Priority** - 4 úrovně priority (Nízká, Střední, Vysoká, Urgentní)
- ✅ **Real-time synchronizace** - Okamžitá synchronizace dat přes Firebase Realtime Database
- ✅ **Responzivní design** - Funkční na PC i mobilních zařízeních

## Použité technologie
- **HTML5** - Struktura stránky
- **CSS3** - Styling (Flexbox, Grid, CSS proměnné, animace)
- **JavaScript (ES6+)** - Aplikační logika (async/await, moduly, třídy)
- **Firebase** - Backend služby (Authentication, Realtime Database)
- **Font Awesome** - Ikony

## Struktura projektu
```
BWeb/
├── index.html          # Hlavní HTML soubor
├── styles.css          # Všechny CSS styly
├── script.js           # Hlavní aplikační logika (TaskManager třída)
├── components/         # React komponenty (experimentální)
│   ├── Dashboard.js    # Dashboard komponenta
│   └── Loginform.js    # Login formulář komponenta
└── firebase/           # Firebase konfigurace a helpery
    ├── firebase.js     # Inicializace Firebase
    ├── auth.js         # Autentizační funkce
    └── database.js     # Databázové operace
```

## Jak spustit aplikaci
1. Otevřete `index.html` v moderním prohlížeči (Chrome, Firefox, Edge)
2. Registrujte se pomocí emailu a hesla
3. Po přihlášení můžete začít přidávat úkoly

## Firebase konfigurace
Aplikace používá tyto Firebase služby:
- **Firebase Authentication** - Pro správu uživatelů
- **Firebase Realtime Database** - Pro ukládání úkolů (region: Europe West)

## Autor
Tomáš - Bakalářská práce 2024

## Poznámky
- Všechny soubory obsahují podrobné komentáře v češtině pro lepší pochopení kódu
- Projekt slouží jako praktická ukázka moderních webových technologií
- Kód je připraven pro další rozšíření (např. sdílení úkolů, notifikace)
