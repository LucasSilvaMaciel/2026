document.addEventListener('DOMContentLoaded', () => {
    const engine = new AntigravityEngine('game-canvas');
    const track = new Track();
    const playerHorse = new Horse(0, 500);

    engine.addEntity(track);
    engine.addEntity(playerHorse);

    // Input state
    const input = { left: false, right: false, up: false, turbo: false };

    window.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowLeft') input.left = true;
        if (e.code === 'ArrowRight') input.right = true;
        if (e.code === 'ArrowUp') input.up = true;
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') input.turbo = true;
    });

    window.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowLeft') input.left = false;
        if (e.code === 'ArrowRight') input.right = false;
        if (e.code === 'ArrowUp') input.up = false;
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') input.turbo = false;
    });

    // Custom update for main loop to pass input and update camera
    const originalUpdate = engine.update.bind(engine);
    engine.update = (dt) => {
        // Recharge stamina if inside a zone
        let recharging = false;
        track.rechargeZones.forEach(zone => {
            const dist = Math.sqrt((playerHorse.x - zone.x) ** 2 + (playerHorse.y - zone.y) ** 2);
            if (dist < zone.radius) {
                recharging = true;
            }
        });

        if (recharging && !input.turbo) {
            playerHorse.stamina += 40 * dt;
            if (playerHorse.stamina > playerHorse.maxStamina) playerHorse.stamina = playerHorse.maxStamina;
        }

        playerHorse.update(dt, input);
        track.update(dt);

        // Update camera to follow horse
        engine.camera.x += (playerHorse.x - engine.camera.x) * 5 * dt;
        engine.camera.y += (playerHorse.y - engine.camera.y) * 5 * dt;

        // Dynamic Zoom based on speed
        let targetZoom = 1.0 - (playerHorse.speed / playerHorse.maxSpeed) * 0.3;
        engine.camera.zoom += (targetZoom - engine.camera.zoom) * 2 * dt;

        // Update HUD
        document.getElementById('speed-display').innerText = Math.floor(playerHorse.speed);
        document.getElementById('energy-bar').style.width = `${(playerHorse.stamina / playerHorse.maxStamina) * 100}%`;
    };

    // UI Events
    document.getElementById('btn-start').addEventListener('click', () => {
        document.getElementById('start-menu').style.display = 'none';
        engine.start();
    });
});
