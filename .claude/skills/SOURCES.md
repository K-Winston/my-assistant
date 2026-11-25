# Skills de design et d'animation installés dans ce projet

Copiés le 25/11/2026 depuis les dépôts officiels de leurs auteurs. Ce sont des fichiers d'instructions
(texte), sans script exécutable. Claude Code les charge automatiquement dans ce dossier.

| Skills | Source (commit) | Licence |
|---|---|---|
| frontend-design | anthropics/claude-plugins-official (6985b2d) | Apache 2.0 |
| design-critique, design-system, design-handoff, accessibility-review, ux-copy, user-research, research-synthesis | anthropics/knowledge-work-plugins, plugin « design » (5e504ae) | Apache 2.0 |
| web-design-guidelines | vercel-labs/agent-skills (5a37a63) | voir le dépôt |
| gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins, gsap-utils, gsap-performance, gsap-react, gsap-frameworks | greensock/gsap-skills (aed9cfd) | MIT |
| motion-design | lottiefiles/motion-design-skill (d77a9fc) | MIT |
| emil-design-eng, animate, choreograph, improve-animations, review-animations, find-animation-opportunities, animation-performance, animation-vocabulary, remove-animations, gestures, apple-design, ask-emil, ask-sonner, break-ui, learn-taste, pick-ui-library, prototype | emilkowalski/skill (64eb3de) | MIT |
| design-motion-principles | kylezantos/design-motion-principles (4a9ca87) | MIT |
| impeccable (SKILL.md, reference/, scripts/) | pbakaus/impeccable (9e460a8) | Apache 2.0 |

Non installés (hors sujet pour un site web) : write-swift, mobile-native, animate-expo (Emil Kowalski, applications mobiles natives).

Impeccable : les scripts sont installés (à la demande de l'utilisateur). Au premier lancement, `scripts/impeccable` télécharge le moteur 0.1.30 depuis les releases GitHub du projet et vérifie son empreinte SHA-256 (`scripts/engine-checksums.txt`) ; le moteur (`scripts/bin/`) n'est pas versionné. Le crochet automatique de détection (`/impeccable hooks on`) n'est pas activé.

Mise à jour : recopier le dossier `skills/<nom>` depuis le dépôt source.
