# KanbanFlow — Tableau de Gestion par Flux Interactif

Application front-end de type Kanban (inspirée de Trello/Linear) permettant la gestion de tâches via une interface fluide. Ce projet met en avant la manipulation avancée du DOM, la gestion d'état locale et l'utilisation de l'API native HTML5 Drag-and-Drop, sans dépendance à une librairie tierce complexe.

## Démo en ligne
[Tester l'application en direct](https://kanban-flow-snowy.vercel.app/)

## Architecture et Choix Techniques
- **Drag-and-Drop Natif :** Utilisation des événements HTML5 (`dragstart`, `dragover`, `drop`) pour des performances optimales et une compréhension bas niveau des interactions navigateur.
- **JavaScript ES6+ :** Gestion de l'état (immuabilité des tableaux de tâches), filtrage dynamique en temps réel, et sécurisation des entrées (prévention XSS).
- **Persistance des données :** Sauvegarde continue via l'API `localStorage` pour éviter la perte d'informations au rechargement.
- **Exportation de données :** Génération à la volée d'un fichier JSON encapsulant l'état du tableau, téléchargeable côté client.
- **Interface Clean SaaS :** CSS natif structuré avec des variables (Custom Properties), Flexbox et Grid pour un rendu moderne, clair et ergonomique.

## Installation locale

1. Cloner le dépôt :
```bash
git clone [https://github.com/RedaCode404/kanban-flow.git](https://github.com/RedaCode404/kanban-flow.git)
cd kanban-flow