class Horse {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
        this.speed = 0;

        // Attributes
        this.maxSpeed = 800; // units per second
        this.acceleration = 600;
        this.handling = 3; // turn speed
        this.friction = 0.95; // base friction (lower means more slide/drift)
        this.turboFriction = 0.98;

        this.stamina = 100;
        this.maxStamina = 100;
        this.isTurbo = false;

        this.color = '#0ff';
        this.trail = [];
    }

    update(dt, input) {
        // Turning
        if (input.left) this.angle -= this.handling * dt;
        if (input.right) this.angle += this.handling * dt;

        // Accelerating
        this.isTurbo = input.turbo && this.stamina > 0;
        let currentAccel = input.up ? this.acceleration : 0;
        let currentMaxSpeed = this.isTurbo ? this.maxSpeed * 1.5 : this.maxSpeed;

        if (this.isTurbo) {
            currentAccel *= 2;
            this.stamina -= 20 * dt; // Consume stamina
            if (this.stamina < 0) this.stamina = 0;
        }

        // Apply acceleration in the direction of the angle
        if (currentAccel > 0) {
            this.vx += Math.cos(this.angle) * currentAccel * dt;
            this.vy += Math.sin(this.angle) * currentAccel * dt;
        }

        // Apply friction/drag to simulate drift and max speed
        let currentFriction = this.isTurbo ? this.turboFriction : this.friction;
        this.vx *= currentFriction;
        this.vy *= currentFriction;

        // Cap speed
        this.speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (this.speed > currentMaxSpeed) {
            let ratio = currentMaxSpeed / this.speed;
            this.vx *= ratio;
            this.vy *= ratio;
            this.speed = currentMaxSpeed;
        }

        // Position update
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Trail effect
        this.trail.unshift({ x: this.x, y: this.y, life: 1.0 });
        if (this.trail.length > 20) this.trail.pop();
        this.trail.forEach(t => t.life -= dt * 2);
        this.trail = this.trail.filter(t => t.life > 0);
    }

    render(ctx) {
        // Draw trail
        ctx.beginPath();
        for (let i = 0; i < this.trail.length; i++) {
            let t = this.trail[i];
            ctx.fillStyle = `rgba(0, 255, 255, ${t.life * 0.5})`;
            ctx.arc(t.x, t.y, 5 * t.life, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Draw Horse (Sci-fi bike/horse shape)
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.moveTo(20, 0); // Nose/head
        ctx.lineTo(-15, -10); // Back left
        ctx.lineTo(-10, 0); // Back center
        ctx.lineTo(-15, 10); // Back right
        ctx.closePath();
        ctx.fill();

        // Draw Antigravity thrusters
        ctx.fillStyle = this.isTurbo ? '#f0f' : '#0ff';
        ctx.beginPath();
        ctx.arc(-15, -10, 4, 0, Math.PI * 2);
        ctx.arc(-15, 10, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
