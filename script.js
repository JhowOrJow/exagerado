document.addEventListener('DOMContentLoaded', () => {
    // --- Seleção de Elementos ---
    const initialMessageEl = document.getElementById('initial-message');
    const dostoievskiImageEl = document.getElementById('dostoievski-image');
    const scrollPromptEl = document.querySelector('.scroll-down-prompt');
    const musicSections = document.querySelectorAll('.music-section');
    const playPauseBtns = document.querySelectorAll('.play-pause-btn');
    const audioElements = document.querySelectorAll('audio');

    // --- Função de Digitação ---
    const typewriter = (element, speed = 50) => {
        return new Promise(resolve => {
            const text = element.textContent;
            element.innerHTML = '';
            element.classList.add('typing');
            let i = 0;

            const type = () => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    element.classList.remove('typing');
                    resolve();
                }
            };
            type();
        });
    };

    // --- Sequência de Animação Inicial ---
    const startIntroAnimation = async () => {
        const introText = "É curioso como certos acontecimentos fazem florescer pensamentos que escapam a qualquer controle. Imaginamos conduzir a vida, mas na verdade somos conduzidos; e, sem aviso ou palavra alguma, há pessoas que despertam em nós um fascínio que por vezes não conseguimos ou podemos ignorar, como Dostoiévski já nos alertava.";
        initialMessageEl.textContent = introText; // Define o texto para a função pegar

        await typewriter(initialMessageEl, 60); // Inicia a digitação da primeira mensagem

        // Após a digitação, mostra a imagem e o prompt de rolagem
        dostoievskiImageEl.classList.add('visible');
        scrollPromptEl.classList.add('visible');
    };

    // --- Lógica de Áudio ---
    const pauseAllAudio = () => {
        audioElements.forEach(audio => audio.pause());
        playPauseBtns.forEach(btn => btn.classList.remove('playing'));
    };

    playPauseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const player = btn.closest('.audio-player');
            const audioId = player.dataset.audioId;
            const currentAudio = document.getElementById(audioId);
            const isPlaying = !currentAudio.paused;

            pauseAllAudio();
            if (!isPlaying) {
                currentAudio.play();
                btn.classList.add('playing');
            }
        });
    });

    audioElements.forEach(audio => {
        audio.addEventListener('ended', () => {
            const btn = document.querySelector(`.audio-player[data-audio-id="${audio.id}"] .play-pause-btn`);
            if (btn) btn.classList.remove('playing');
        });
    });

    // --- Lógica de Scroll (Pausar música e Iniciar animações de digitação) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const quoteEl = entry.target.querySelector('.typewriter');
            
            if (entry.isIntersecting) {
                // Se a seção está visível E a citação ainda não foi digitada
                if (quoteEl && !quoteEl.hasAttribute('data-typed')) {
                    quoteEl.setAttribute('data-typed', 'true'); // Marca como digitada
                    typewriter(quoteEl);
                }
            } else {
                // Se a seção NÃO está visível, pausa a música dela
                const audioPlayer = entry.target.querySelector('.audio-player');
                if (audioPlayer) {
                    const audioId = audioPlayer.dataset.audioId;
                    const audio = document.getElementById(audioId);
                    const button = audioPlayer.querySelector('.play-pause-btn');
                    audio.pause();
                    button.classList.remove('playing');
                }
            }
        });
    }, { threshold: 0.6 }); // Ação disparada quando 60% da seção está na tela

    // Observa cada seção de música
    musicSections.forEach(section => observer.observe(section));

    // Inicia a animação de abertura da página
    startIntroAnimation();
});