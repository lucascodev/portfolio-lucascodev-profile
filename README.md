# dev-portfolio

Portfólio de desenvolvedor que é o próprio setup de trabalho em 3D (React 19 + Vite 8 + Three.js via React Three Fiber). Não há páginas por fora: o conteúdo vive dentro do monitor.

1. Ao abrir, cada item do setup é "desenhado" em linhas de blueprint e depois ganha cor. As telas são animadas, o teclado digita sozinho, as fans do PC giram e os fios caem com física (corda com gravidade e colisão com os objetos). Passar o mouse num item mostra o nome dele.
2. O monitor principal mostra uma tela de login Linux bloqueada (que acende ao passar o mouse) e o botão "Entrar no sistema" pulsa acima dele. Clicar no monitor, no botão ou apertar **Enter** leva a câmera até a tela.
3. Lá dentro há um desktop Linux com uma notificação de boas-vindas, janelas arrastáveis, dock e os apps **Terminal**, **Sobre** (editor), **Projetos** (gerenciador de arquivos), **Stack** (pacotes) e **Contato** (correio).
4. **Esc**, o botão de desligar ou o comando `exit` no terminal voltam para o setup.

O terminal aceita `help`, `whoami`, `sobre`, `projetos`, `stack`, `contato`, `neofetch`, `ls`, `cat <arquivo>`, `open <app>`, `date`, `echo`, `clear` e `exit`.

## Rodando

```bash
cp .env.example .env
pnpm install
pnpm dev           # http://localhost:5173
pnpm test          # testes das regras (Vitest)
pnpm lint          # oxlint
pnpm build         # typecheck + build de produção
```

## Branches e publicação

- `develop` recebe o trabalho do dia a dia; cada push e cada pull request passam por lint, testes e build no CI.
- `main` é o que está no ar: todo push nela publica o site no GitHub Pages.

O endereço público entra no build pela variável `VITE_SITE_URL` (link canônico, prévia social, `robots.txt` e `sitemap.xml`). O `.env` fica só na sua máquina (copie do `.env.example`); o workflow de deploy informa o endereço real.

## Como desenhar o seu setup

Tudo o que aparece na cena vem de `src/content/desk-setup.content.ts`. Não é preciso mexer nos componentes:

| Campo                                   | O que controla                                                                                                                                                                                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `desk`                                  | largura, profundidade e altura da mesa (em metros) e cores                                                                                                                                                                                                               |
| `monitors`                              | tamanho em polegadas, proporção (`16:9`, `16:10`, `21:9`, `32:9`), `landscape` ou `portrait`, qual é o principal e o que aparece na tela                                                                                                                                 |
| `monitors[].mount`                      | `stand` (pé de mesa) ou `arm` (preso no suporte articulado, sem pé)                                                                                                                                                                                                      |
| `monitors[].curvatureRadiusMillimeters` | curvatura da tela (ex.: `1900` para 1900R); omita para tela plana                                                                                                                                                                                                        |
| `monitors[].screen`                     | `login-screen` (tela de login Linux com relógio, avatar e dica para entrar), `mac-lock-screen` (bloqueio estilo macOS, usado no MacBook), `code-editor`, `terminal`, `dashboard` ou `split` (duas telas lado a lado)                                                     |
| `monitorArm`                            | suporte articulado: posição da coluna (`clampX`) e cor; liga os monitores `arm` e a bandeja do notebook                                                                                                                                                                  |
| `laptop`                                | notebook ao lado dos monitores: tamanho, lado (`left`/`right`), `desk` ou `arm-tray` (na bandeja do suporte) e o que aparece na tela                                                                                                                                     |
| `monitors[].hasWebcam`                  | webcam em cima do monitor                                                                                                                                                                                                                                                |
| `monitors[].distanceFromDeskBackMeters` | quão para frente fica o monitor principal (útil quando há algo atrás dele)                                                                                                                                                                                               |
| `keyboard`                              | layout (`60`, `65`, `75`, `tkl`), cores das teclas, cor do RGB (opcional) e posição                                                                                                                                                                                      |
| `mouse`                                 | posição, cor e `lightColor` (RGB, opcional)                                                                                                                                                                                                                              |
| `deskMat`                               | tamanho, cor e `pattern` (ex.: `{ kind: 'cracks', color: '#3ddc5a' }`)                                                                                                                                                                                                   |
| `pcTower`                               | gabinete aquário: `desk-back-left`, `desk-back-right`, `desk-left`, `desk-right`, `floor-left` ou `floor-right`, `position` opcional para ajuste fino na mesa, e as cores das fans                                                                                       |
| `accessories`                           | `drawing-tablet`, `microphone`, `power-strip`, `tumbler`, `phone-stand`, `photo-frame`, `mug`, `lamp`, `plant`, `headphones`, `speaker`, cada um com posição e `rotationDegrees` opcional                                                                                |
| `accessories[microphone].mount`         | `{ kind: 'desk-stand' }` ou `{ kind: 'boom-arm', clamp, heightMeters }` (braço preso na borda da mesa)                                                                                                                                                                   |
| `accessories[phone-stand].phone`        | celular no suporte, com cor e tela (`lock-screen` mostra o relógio de verdade)                                                                                                                                                                                           |
| `cables`                                | fios entre aparelhos (`keyboard`, `mouse`, `microphone`, `webcam`, `monitor`, `laptop`, `drawing-tablet`, `phone`, `pc-tower`, `power-strip`) ou caindo atrás da mesa (`desk-back`); cada ponta sai reta pelo plugue na direção da porta e o resto é simulado com física |
| `room`                                  | cores da parede e do chão e cor da fita de LED                                                                                                                                                                                                                           |

As posições são em metros a partir do centro da mesa: `x` positivo vai para a direita e `z` positivo vem para a frente. Os monitores se posicionam sozinhos: o principal fica no centro e os outros se encaixam nas laterais, angulados para dentro.

Os textos do desktop (nome, sobre, stack, projetos e contato) ficam em `src/content/portfolio.content.ts`.

## Estrutura

```
src/
  app/           bootstrap (main, App, estilos globais)
  content/       dados editáveis do setup e do portfólio, injetados em App
  modules/
    setup/       cena 3D
      domain/        tipos e regras puras (telas, monitores, teclado, roteamento e física dos fios)
      presentation/  componentes R3F, câmera, hooks (texturas, revelação em blueprint) e pintores de canvas
    portfolio/   experiência do portfólio
      domain/        gerenciador de janelas (reducer) e interpretador do terminal
      presentation/  página, intro do setup e o desktop Linux com seus apps
  shared/        componentes, hooks e utilitários genéricos
```

A cena 3D é carregada com `lazy`, então o texto da intro aparece antes do Three.js terminar de baixar. O render 3D pausa enquanto o desktop está aberto, e as animações de câmera e de revelação respeitam `prefers-reduced-motion`. Se a cena falhar, uma mensagem ocupa o lugar dela e o botão "Ligar o computador" continua levando ao desktop.
