document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Seleção de Elementos ---
    const initialMessageEl = document.getElementById('initial-message');
    const dostoievskiImageEl = document.getElementById('dostoievski-image');
    const scrollPromptEl = document.querySelector('.scroll-down-prompt');
    const musicSections = document.querySelectorAll('.music-section');
    const playPauseBtns = document.querySelectorAll('.play-pause-btn');
    const audioElements = document.querySelectorAll('audio');
    
    // Elementos do convite
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const buttonContainer = document.querySelector('.button-container');
    
    // Modais
    const apologyModal = document.getElementById('apology-modal');
    const yesModal = document.getElementById('yes-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');

    // --- 2. Função de Digitação ---
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
    
    // --- 3. Sequência de Animação Inicial ---
    const startIntroAnimation = async () => {
        const introText = "É curioso como certos acontecimentos fazem florescer pensamentos que escapam a qualquer controle. Imaginamos conduzir a vida, mas na verdade somos conduzidos; e, sem aviso ou palavra alguma, há pessoas que despertam em nós um fascínio que por vezes não conseguimos ou podemos ignorar, como Dostoiévski já nos alertava...";
        initialMessageEl.textContent = introText;
        await typewriter(initialMessageEl, 60);
        dostoievskiImageEl.classList.add('visible');
        scrollPromptEl.classList.add('visible');
    };

    // --- 4. Lógica de Áudio ---
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

    // --- 5. Lógica de Scroll e Animações ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const quoteEl = entry.target.querySelector('.typewriter');
            
            if (entry.isIntersecting) {
                if (quoteEl && !quoteEl.hasAttribute('data-typed')) {
                    quoteEl.setAttribute('data-typed', 'true');
                    typewriter(quoteEl);
                }
            } else {
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
    }, { threshold: 0.6 });

    musicSections.forEach(section => observer.observe(section));

    // --- 6. Lógica para o Convite Interativo ---
    let noClickCount = 0;

    const moveNoButton = () => {
        const containerRect = buttonContainer.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();
        
        const maxX = containerRect.width - btnRect.width;
        const maxY = containerRect.height - btnRect.height;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
    };

    const initiateFleeMode = () => {
        noBtn.classList.add('fleeing');
        moveNoButton();
        noBtn.addEventListener('mouseover', moveNoButton);
        noBtn.addEventListener('focus', moveNoButton);
    };

    noBtn.addEventListener('mouseover', initiateFleeMode, { once: true });

    noBtn.addEventListener('click', () => {
        noClickCount++;
        noBtn.textContent = 'Hoje Sim, faró :P';
        
        if (noClickCount >= 3) {
            apologyModal.classList.add('visible');
        }
        moveNoButton();
    });

    yesBtn.addEventListener('click', () => {
        yesModal.classList.add('visible');
    });

    const closeModal = () => {
        apologyModal.classList.remove('visible');
        yesModal.classList.remove('visible');
        noClickCount = 0;
        
        setTimeout(() => {
            noBtn.textContent = 'Hoje não, fará';
        }, 300);
    };
    
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));
    apologyModal.addEventListener('click', (event) => { if (event.target === apologyModal) closeModal(); });
    yesModal.addEventListener('click', (event) => { if (event.target === yesModal) closeModal(); });


    // --- 7. Inicia a Aplicação ---
    startIntroAnimation();
});