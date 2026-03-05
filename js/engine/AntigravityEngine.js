class AntigravityEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.lastTime = 0;
        this.deltaTime = 0;
        this.isRunning = false;

        this.entities = [];
        this.camera = { x: 0, y: 0, zoom: 1 };

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame((time) => this.loop(time));
        }
    }

    stop() {
        this.isRunning = false;
    }

    loop(time) {
        if (!this.isRunning) return;

        this.deltaTime = (time - this.lastTime) / 1000; // in seconds
        this.lastTime = time;

        this.update(this.deltaTime);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        // Optional global updates
        this.entities.forEach(e => {
            if (e.update) e.update(dt);
        });
    }

    render() {
        // Clear screen
        this.ctx.fillStyle = '#0d0d0d';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();

        // Translate for camera
        this.ctx.translate(
            this.canvas.width / 2 - this.camera.x * this.camera.zoom,
            this.canvas.height / 2 - this.camera.y * this.camera.zoom
        );
        this.ctx.scale(this.camera.zoom, this.camera.zoom);

        // Render entities (Z-index could be added later, for now track first, horses later)
        this.entities.forEach(e => {
            if (e.render) e.render(this.ctx);
        });

        this.ctx.restore();
    }
}
