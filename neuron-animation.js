// neuron-animation.js - Creates a subtle, tech-focused neuron/circuit animation running continuously on load.

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Canvas and Context
    const canvas = document.getElementById('neuronCanvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('logo-container');
    
    if (!canvas || !container) {
        // Essential check for elements
        console.error("Missing canvas or logo container for animation.");
        return;
    }

    // 2. Configuration
    let nodes = [];
    // CRITICAL UPDATE: Increased node count to make the animation denser and more obvious instantly.
    const NUM_NODES = 40; // Increased from 30 to 40
    // CRITICAL UPDATE: Increased max connection distance for wider, more visible connections.
    const MAX_DISTANCE = 150; // Increased from 120 to 150
    const NODE_RADIUS = 1.5;
    const ANIMATION_SPEED = 0.5;

    // 3. Resize and Node Creation
    function resizeCanvas() {
        // Set canvas size to match the container for perfect alignment
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        createNodes();
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); 

    function createNodes() {
        nodes = [];
        for (let i = 0; i < NUM_NODES; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                // Random velocity for subtle movement
                vx: (Math.random() - 0.5) * ANIMATION_SPEED, 
                vy: (Math.random() - 0.5) * ANIMATION_SPEED, 
            });
        }
    }

    // 4. Update and Drawing Logic
    function updateNodes() {
        nodes.forEach(node => {
            // Move node
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges (Reverse velocity)
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame

        nodes.forEach(nodeA => {
            // Draw Node (small circle - Lime Green)
            ctx.fillStyle = '#a3e635'; 
            ctx.beginPath();
            ctx.arc(nodeA.x, nodeA.y, NODE_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            // Check distance to other nodes to draw lines
            nodes.forEach(nodeB => {
                const distance = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);

                if (distance < MAX_DISTANCE) {
                    // Calculate opacity: closer nodes are brighter
                    const opacity = 1 - (distance / MAX_DISTANCE); 
                    
                    // Draw Line (the 'neuron connection' - Vibrant Blue)
                    ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`; 
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(nodeA.x, nodeA.y);
                    ctx.lineTo(nodeB.x, nodeB.y);
                    ctx.stroke();
                }
            });
        });
    }

    // 5. Animation Control
    let animationFrameId;

    function animate() {
        updateNodes();
        draw();
        animationFrameId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        // Only start if it's not already running
        if (!animationFrameId) {
            animate();
        }
    }
    
    // *** KEY CHANGE: Start the animation immediately on load, independent of the cursor. ***
    startAnimation(); 

    // Note: All mouse listeners were removed as the effect must run continuously.
});
