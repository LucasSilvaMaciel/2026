class Track {
    constructor() {
        this.trackWidth = 200;
        this.path = [
            { x: -500, y: -500 },
            { x: 500, y: -500 },
            { x: 800, y: 0 },
            { x: 500, y: 500 },
            { x: -500, y: 500 },
            { x: -800, y: 0 }
        ];

        this.checkpoints = []; // for lap counting later
        this.rechargeZones = [
            { x: 0, y: -500, radius: 100 },
            { x: 0, y: 500, radius: 100 }
        ];

        this.glowPulse = 0;
    }

    update(dt) {
        this.glowPulse += dt * 5;
    }

    render(ctx) {
        let pulseIntensity = Math.sin(this.glowPulse) * 0.5 + 0.5;

        // Draw recharge zones
        ctx.fillStyle = `rgba(255, 0, 255, ${0.2 + pulseIntensity * 0.2})`;
        this.rechargeZones.forEach(zone => {
            ctx.beginPath();
            ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#f0f';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw track outline (cyberpunk style neon path)
        ctx.beginPath();
        this.path.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();

        ctx.strokeStyle = `rgba(0, 255, 255, ${0.5 + pulseIntensity * 0.5})`;
        ctx.lineWidth = this.trackWidth;
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Draw center neon line
        ctx.beginPath();
        this.path.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.setLineDash([20, 30]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.shadowBlur = 0; // reset
    }
}
