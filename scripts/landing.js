/* =========================
   // Javascript for landing pages

========================= */
window.addEventListener("DOMContentLoaded", () => {

    /* =========================
       Starfied canvas animation - to create an animated moving star
       background using the HTML canvas.
    ========================= */
    const canvas = document.getElementById("space");
    const ctx = canvas.getContext("2d");
    let stars = []; // Array used to store all star objects

    // Resizes the canvas to fit the screen
    // and generates new stars when needed
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars = [];         // Clears old stars before generating new ones

        for (let i = 0; i < 300; i++) {    // Creates 300 random stars
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                s: Math.random() * 1.5       // Random size/brightness

            });
        }
    }
    //used for updating canvas size whenever the browser resizes

    window.addEventListener("resize", resize);
    resize();    // Runs resize immediately when the page loads

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);        // Clears the previous animation frame
        ctx.fillStyle = "white";
        stars.forEach(s => {
            ctx.globalAlpha = s.s;        // Controls star transparency
            if (s.s > 1) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.s / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(s.x, s.y, 1, 1);
            }
            s.y += s.s * 0.5;
            if (s.y > canvas.height) {
                s.y = 0;
                s.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(draw);    //used for continuously looping the animation

    }
    draw();

    /* =========================
       Scroll reveal
    ========================= */
    const blocks = document.querySelectorAll('.story-block');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    blocks.forEach(block => observer.observe(block));     // Applies observer to every story block


    /* =========================
       Modal bg click - allows the modal popup to close on user click
    ========================= */
    const modalEl = document.getElementById("modal");
    if (modalEl) {
        modalEl.addEventListener("click", (e) => {
            // Closes modal only if the background is clicked
            if (e.target.id === "modal") closeModal();
        });
    }
});

/* =========================
   Modal functions
========================= */

function openPlanet(n, d, i) { // Opens the modal and inserts planet data

    const modal = document.getElementById("modal");
    if (!modal) return;

    modal.style.display = "flex";     // Makes the modal visible
    document.getElementById("mtitle").innerText = n;
    document.getElementById("mdesc").innerHTML = d;
    document.getElementById("mimg").src = i;
}

function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.style.display = "none";
}

/* =========================

   Navigation control -
   Handles returning back to the main
   portal/home page.
========================= */
function returnToPortals() {
    // Stores a value in localStorage so the
    // main page knows the user returned
    localStorage.setItem('returnToPortal', 'true');

    // Redirects the user back to index.html
    window.location.href = '../index.html';
}