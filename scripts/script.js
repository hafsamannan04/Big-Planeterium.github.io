// Javascript for main index page
// I used this so the code runs only after the page is fully loaded
// this way I avoid errors from elements not being ready yet

window.addEventListener("DOMContentLoaded", () => {
    // Getting key elements from the DOM
    const video = document.getElementById("introVideo");
    const overlay = document.getElementById("introOverlay");
    const nav = document.getElementById("nav");
    const backBtn = document.getElementById('backBtn'); // Defined once here

    // 1. STATE MANAGEMENT
    // This checks if user is coming back from a portal page
    // If true → we skip intro and send them directly to portals
    const isReturning = localStorage.getItem('returnToPortal') === 'true';

    // This function handles what happens after the intro finishes or is skipped
    // I made it separate so I don’t repeat the same code in multiple places
    function enterSite() {
        if (overlay) {
            // Smooth fade-out of intro screen
            overlay.style.opacity = 0;
            setTimeout(() => {
                overlay.style.display = "none";

                // Nav becomes visible after intro (better UX flow)
                nav.classList.add("show");
                if (isReturning) {
                    go('doors');
                    localStorage.removeItem('returnToPortal');
                } else {
                    go('home');
                }
            }, 1000);
        }
    }

    // 2. INTRO TRIGGER
    // to check if the video exists before trying to play it
    // so the code doesn’t break if something is missing

    if (video) {
        if (isReturning) {
            // to skip the intro for returning user to improve accessibility 
            enterSite();
        } else {
            // I try to autoplay the video, but also handle cases where browsers block it
            video.play().catch(() => console.log("Autoplay blocked"));
            video.onended = enterSite;
        }
    }

    // I added this so users can skip the intro anytime they want
    // This is important for accessibility.
    window.skipIntro = () => {
        if (video) video.pause();
        enterSite();
    };
    // I added this so users can replay the intro if they want to
    // It gives them more control over the experience
    window.playIntro = () => {
        overlay.style.display = "flex";
        overlay.style.opacity = 1;
        video.muted = false;
        video.currentTime = 0;
        video.play();
    };
    // used here to store a simple value when the user goes to a portal page
    // to improve navigation when they come back
    window.prepReturn = () => {
        localStorage.setItem('returnToPortal', 'true');
    };

    // 3.This is my main navigation function
    //  used it to switch between sections without reloading the page
    window.go = function (id) {
        // Hide all screens and sections
        document.querySelectorAll('.screen, .section').forEach(s => {
            s.classList.add('hidden');
        });

        const target = document.getElementById(id);
        if (target) {
            target.classList.remove('hidden');
            // to reset scroll position so every section starts from the top
            target.scrollTop = 0;
        }

        // --- TERMINATE JOURNEY BUTTON LOGIC ---
        if (backBtn) {
            // Only show button if we aren't on the landing/home pages
            if (id === 'home' || id === 'home2' || id === 'introOverlay') {
                backBtn.classList.add('hidden');
            } else {
                backBtn.classList.remove('hidden');
                // Ensure clicking it always takes you to the first home screen
                backBtn.onclick = () => go('home');
            }
        }
    };

    // 4. STARFIELD
    const canvas = document.getElementById("space");
    const ctx = canvas.getContext("2d");
    let stars = [];
    // to resize the canvas so it always fits the screen properly
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars = [];
        for (let i = 0; i < 300; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                s: Math.random() * 2
            });
        }
    }
    // Simple animation loop for moving stars
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        stars.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.s / 2, 0, Math.PI * 2);
            ctx.fill();
            s.y += s.s * 0.3;
            // to reset stars when they go off screen
            // so the animation keeps running endlessly
            if (s.y > canvas.height) s.y = 0;
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();

    // 5. STORY REVEAL 
    // used IntersectionObserver instead of scroll events
    // because it is smoother and better for performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // added the active class only when the element is visible
                // so animations run at the right time
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    // Applied to all story blocks so they animate when they come into view while scrolling
    document.querySelectorAll('.story-block').forEach(block => observer.observe(block));

}); 