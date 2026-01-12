PASTA DE ASSETS
===============

Esta pasta contém os assets do jogo Forager.

IMAGENS (assets/images/):
-------------------------
Os sprites visuais são gerados programaticamente usando Canvas API no código JavaScript.
Não são necessários arquivos de imagem externos, pois os recursos, personagem e elementos
do mundo são desenhados diretamente no canvas usando formas geométricas e cores.

Se desejar usar imagens reais, você pode:
1. Adicionar arquivos .png na pasta images/
2. Modificar o código para carregar e usar essas imagens
3. Exemplo: player.png, apple.png, grass.png, stone.png, tree.png, background.png

SONS (assets/sounds/):
----------------------
Os sons são atualmente simulados no código (logs no console).
Para implementação completa com sons reais:

1. Adicione arquivos .mp3 na pasta sounds/:
   - collect.mp3 (som ao coletar recursos)
   - craft.mp3 (som ao craftar itens)

2. Modifique ui.js para usar Web Audio API:
   ```javascript
   const audio = new Audio('assets/sounds/collect.mp3');
   audio.play();
   ```

3. Você pode encontrar sons gratuitos em:
   - freesound.org
   - opengameart.org
   - pixabay.com/sound-effects/
