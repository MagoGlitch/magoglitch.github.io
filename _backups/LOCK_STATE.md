# Checkpoint de Bloqueio — Estado Estável do Portfólio & Versões da Hero
**Data do Bloqueio:** 17 de Novembro de 2026  
**Status:** 🔒 BLOQUEADO & PROTEGIDO

---

## 1. Hero Versão 01 (Cadeira de Diretor + Fita 3D + Recorte de Vãos + Lenis):
- **Arquivo de Backup Imutável:** `_backups/hero_version_01/index.html` e `index.html.v1-locked`
- **Características da Versão 01:**
  - Imagem de Fundo: `BG HERO/bg-hero.webp` (estúdio branco com Marcos na cadeira de diretor).
  - Recorte de Precisão: `BG HERO/marcos-cutout.webp` com vãos internos vazados (abertura do encosto/apoio de braço e triângulos das pernas cruzadas em X).
  - Comportamento 3D:
    - Passagem por trás das pernas e vãos da cadeira na descida inferior (`z < -10.0`).
    - Passagem por cima do colo, braços e pernas de Marcos na volta central (`z > -10.0`).
  - Overlay Inicial:
    - Tipografia "PORTFÓLIO 2026".
    - Cards em glassmorphism "Designer & Criador" e "Habilidades".
    - macOS Dock com ícones de aplicativos de design.
  - Tipografia Cinética: "MARCOS" e "DESIGNER" com blend mode e transição de scroll.
  - Smooth Scroll global via **Lenis v1.1.18** com física inercial e amortecimento exponencial.

---

## 2. Hero Versão 02 (Retrato Cinematográfico Bokeh + Fita 3D Sanduíche Tridimensional):
- **Imagem de Fundo:** `BG HERO/bg-hero-v2.webp` (retrato em perfil preto e branco com iluminação rim light e bokeh cinematográfico).
- **Recorte de Alta Fidelidade:** `BG HERO/marcos-v2-cutout.webp` (segmentação neural precisa com preservação de mechas de cabelo, iluminação rim light no queixo/perfil e contorno do capuz).
- **Comportamento 3D da Fita:**
  - **Volta Central (com os cards Pulp Cast, Caribeña, Bethel 360°):** A fita 3D passa **POR CIMA (na frente)** do personagem (`op.z > -10.0`, `renderOrder = 3`), exibindo a arte dos cards com nitidez absoluta sobre o rosto/corpo.
  - **Movimentos de Entrada e Saída (fundo e topo/base):** A fita passa **POR TRÁS** do personagem (`op.z <= -10.0`, `renderOrder = 1`), preservando a oclusão anatômica da silhueta de Marcos.
  - **Galeria Estacionária 3x3 (`s >= end`):** Cards assumem `renderOrder = 3` e o personagem faz fade-out suave sincronizado com o fundo.
- **Resolução Original:** 2560 × 1440 (16:9).
- **Seletor Flutuante de Versões:** Botão `Hero V1` (Locked) / `Hero V2` (NOVO) no topo direito da tela (`z-index: 9999`) para alternância instantânea.

---

## 3. Seções Bloqueadas (Preservadas em Ambas as Versões):
1. **Seção de Carrosséis (Cover Flow 3D):**
   - 17 carrosséis completos com covers WebP e badge de slides.
   - Pinning programático em tela cheia sob o cabeçalho.
   - Controle guiado pelo scroll com rotação suave e reflexo espelhado.
   - Leitor Panorâmico contínuo sem emendas com trava de rolagem vertical.

2. **Seção de Estáticos (Cilindro 3D):**
   - 33 peças publicitárias e de social media.
   - Cilindro rotativo 3D com profundidade de camadas e ficha técnica no verso.
   - Scroll reverso suave retornando para a base de Carrosséis.

3. **Smooth Scroll Global:**
   - Lenis v1.1.18 ativo em todas as rolagens manuais e automáticas por clique.
