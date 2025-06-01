// Thiết lập Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Tạo hiệu ứng hậu kỳ - đảm bảo thứ tự đúng
let composer;

// Đợi tất cả thư viện được tải
window.onload = function() {
    try {
        // Tạo composer sau khi tất cả thư viện đã tải
        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));

        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,  // strength
            0.4,  // radius
            0.85   // threshold
        );
        composer.addPass(bloomPass);
        
        // Bắt đầu animation loop
        animate();
    } catch (e) {
        console.error("Lỗi khi khởi tạo hiệu ứng:", e);
        // Sử dụng renderer thông thường nếu có lỗi
        animate_fallback();
    }
};

// Ánh sáng
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(pointLight, ambientLight);

// Tạo các hình trái tim 3D
function createHeart(color, size, x, y, z) {
    const heartShape = new THREE.Shape();
    
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -3 * size, -3 * size, -3 * size, -3 * size, 0);
    heartShape.bezierCurveTo(-3 * size, 3 * size, 0, 3 * size, 0, 5 * size);
    heartShape.bezierCurveTo(0, 3 * size, 3 * size, 3 * size, 3 * size, 0);
    heartShape.bezierCurveTo(3 * size, -3 * size, 0, -3 * size, 0, 0);
    
    const geometry = new THREE.ExtrudeGeometry(heartShape, {
        depth: 0.5 * size,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.3 * size,
        bevelThickness: 0.3 * size
    });
    
    const material = new THREE.MeshStandardMaterial({ 
        color: color,
        metalness: 0.7,
        roughness: 0.3,
        emissive: color,
        emissiveIntensity: 0.2
    });
    
    const heart = new THREE.Mesh(geometry, material);
    heart.position.set(x, y, z);
    heart.rotateX(Math.PI);
    heart.userData = { 
        rotationSpeed: Math.random() * 0.01 + 0.005,
        floatSpeed: Math.random() * 0.005 + 0.002,
        floatFactor: Math.random() * Math.PI * 2
    };
    
    scene.add(heart);
    return heart;
}

// Tạo các ngôi sao lấp lánh
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.3 }),
        new THREE.MeshStandardMaterial({ color: 0xffc0cb, emissive: 0xffc0cb, emissiveIntensity: 0.3 }),
        new THREE.MeshStandardMaterial({ color: 0xff69b4, emissive: 0xff69b4, emissiveIntensity: 0.3 })
    ];
    const star = new THREE.Mesh(
        geometry, 
        materials[Math.floor(Math.random() * materials.length)]
    );
    
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    star.userData = { 
        pulse: Math.random() * 0.05 + 0.01,
        pulseFactor: 0,
        originalScale: Math.random() * 0.5 + 0.5,
        trail: Math.random() > 0.8 // 20% ngôi sao có vệt sáng
    };
    
    scene.add(star);
    return star;
}

// Tạo mây hạt
function createParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    
    const posArray = new Float32Array(particleCount * 3);
    const colorsArray = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Vị trí
        posArray[i] = (Math.random() - 0.5) * 100;
        posArray[i+1] = (Math.random() - 0.5) * 100;
        posArray[i+2] = (Math.random() - 0.5) * 100;
        
        // Màu sắc
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
            // Trắng
            colorsArray[i] = 1;
            colorsArray[i+1] = 1;
            colorsArray[i+2] = 1;
        } else if (colorChoice < 0.66) {
            // Hồng nhạt
            colorsArray[i] = 1;
            colorsArray[i+1] = 0.75;
            colorsArray[i+2] = 0.8;
        } else {
            // Hồng đậm
            colorsArray[i] = 1;
            colorsArray[i+1] = 0.41;
            colorsArray[i+2] = 0.71;
        }
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    return particles;
}

// Tạo vệt sáng
function createLightTrail() {
    try {
        const trailCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-20, Math.random() * 20 - 10, -10),
            new THREE.Vector3(-10, Math.random() * 20 - 10, 0),
            new THREE.Vector3(0, Math.random() * 20 - 10, 5),
            new THREE.Vector3(10, Math.random() * 20 - 10, 0),
            new THREE.Vector3(20, Math.random() * 20 - 10, -10)
        ]);
        
        const trailGeometry = new THREE.TubeGeometry(trailCurve, 100, 0.1, 8, false);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 0.5
            ),
            transparent: true,
            opacity: 0.6
        });
        
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.userData = {
            life: 1.0,
            decay: Math.random() * 0.005 + 0.002
        };
        
        scene.add(trail);
        return trail;
    } catch (e) {
        console.error("Lỗi khi tạo vệt sáng:", e);
        return null;
    }
}

// Mảng lưu vệt sáng
const lightTrails = [];
let trailTimer = 0;

// Tạo mặt phẳng có hình ảnh
function createPhotoPlane(imageUrl, width, height, x, y, z) {
    try {
        const loader = new THREE.TextureLoader();
        
        // Xử lý lỗi nếu không tải được hình ảnh
        const texture = loader.load(
            imageUrl, 
            undefined, 
            undefined, 
            function(err) {
                console.error('Lỗi khi tải hình ảnh:', err);
            }
        );
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
        });
        
        const geometry = new THREE.PlaneGeometry(width, height);
        const plane = new THREE.Mesh(geometry, material);
        
        plane.position.set(x, y, z);
        plane.userData = {
            floatSpeed: Math.random() * 0.004 + 0.002,
            rotationSpeed: Math.random() * 0.005 + 0.001,
            floatFactor: Math.random() * Math.PI * 2
        };
        
        scene.add(plane);
        return plane;
    } catch (e) {
        console.error("Lỗi khi tạo hình ảnh:", e);
        return null;
    }
}

// Tạo các đối tượng
const hearts = [];
const heartColors = [0xff69b4, 0xff1493, 0xffc0cb, 0xff77aa];
for (let i = 0; i < 8; i++) {
    const size = Math.random() * 0.6 + 0.4;
    const x = THREE.MathUtils.randFloatSpread(60);
    const y = THREE.MathUtils.randFloatSpread(40);
    const z = THREE.MathUtils.randFloatSpread(40) - 20;
    const color = heartColors[Math.floor(Math.random() * heartColors.length)];
    
    hearts.push(createHeart(color, size, x, y, z));
}

const stars = Array(200).fill().map(addStar);
const particles = createParticles();

// Thêm hình ảnh - thay thế URL với các hình ảnh thực tế của bạn
let photoPlanes = [];
try {
    photoPlanes = [
        createPhotoPlane('https://picsum.photos/300/400', 5, 7, -25, 10, -15),
        createPhotoPlane('https://picsum.photos/400/300', 7, 5, 25, -5, -10),
        createPhotoPlane('https://picsum.photos/300/300', 6, 6, 0, 15, -20)
    ].filter(plane => plane !== null); // Lọc ra các plane null
} catch (e) {
    console.error("Lỗi khi tạo hình ảnh:", e);
}

// Tạo hiệu ứng sparkle/glitter
function createSparkles() {
    try {
        const sparkleGeometry = new THREE.BufferGeometry();
        const sparkleCount = 300;
        
        const posArray = new Float32Array(sparkleCount * 3);
        
        for (let i = 0; i < sparkleCount * 3; i += 3) {
            posArray[i] = (Math.random() - 0.5) * 100;
            posArray[i+1] = (Math.random() - 0.5) * 100;
            posArray[i+2] = (Math.random() - 0.5) * 100;
        }
        
        sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const sparkleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.3,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
        scene.add(sparkles);
        
        return sparkles;
    } catch (e) {
        console.error("Lỗi khi tạo sparkles:", e);
        return null;
    }
}

const sparkles = createSparkles();

// Hàm di chuyển camera theo con trỏ chuột
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Hiệu ứng rung nhẹ camera
let time = 0;

// Hàm animation với Composer
function animate() {
    requestAnimationFrame(animate);
    
    time += 0.01;
    trailTimer += 0.01;
    
    // Thêm vệt sáng mới theo định kỳ
    if (trailTimer > 0.5) {
        try {
            const newTrail = createLightTrail();
            if (newTrail) lightTrails.push(newTrail);
        } catch (e) {
            console.error("Lỗi khi tạo vệt sáng:", e);
        }
        trailTimer = 0;
    }
    
    // Cập nhật vệt sáng
    for (let i = lightTrails.length - 1; i >= 0; i--) {
        const trail = lightTrails[i];
        trail.userData.life -= trail.userData.decay;
        trail.material.opacity = trail.userData.life * 0.6;
        
        if (trail.userData.life <= 0) {
            scene.remove(trail);
            lightTrails.splice(i, 1);
        }
    }
    
    // Di chuyển camera theo chuột một cách mềm mại
    targetX = mouseX * 5;
    targetY = mouseY * 5;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Hiệu ứng nhẹ nhàng cho camera
    camera.position.x += Math.sin(time) * 0.05;
    camera.position.y += Math.cos(time) * 0.05;
    
    // Xoay và di chuyển các trái tim
    hearts.forEach(heart => {
        heart.rotation.x += heart.userData.rotationSpeed;
        heart.rotation.y += heart.userData.rotationSpeed * 0.8;
        heart.rotation.z += heart.userData.rotationSpeed * 0.5;
        
        // Thêm hiệu ứng nổi
        heart.position.y += Math.sin(time + heart.userData.floatFactor) * heart.userData.floatSpeed;
    });
    
    // Hiệu ứng nhấp nháy cho các ngôi sao
    stars.forEach(star => {
        star.userData.pulseFactor += star.userData.pulse;
        const scale = star.userData.originalScale + Math.sin(star.userData.pulseFactor) * 0.2;
        star.scale.set(scale, scale, scale);
        
        // Thêm vệt sáng cho một số ngôi sao
        if (star.userData.trail && Math.random() > 0.99) {
            try {
                const trailLength = Math.random() * 0.5 + 0.3;
                const trailColor = star.material.color.clone();
                
                const trailGeo = new THREE.BoxGeometry(0.05, 0.05, trailLength);
                const trailMat = new THREE.MeshBasicMaterial({
                    color: trailColor,
                    transparent: true,
                    opacity: 0.6,
                    blending: THREE.AdditiveBlending
                });
                
                const trail = new THREE.Mesh(trailGeo, trailMat);
                trail.position.copy(star.position);
                
                // Điều chỉnh hướng ngẫu nhiên
                trail.rotation.x = Math.random() * Math.PI * 2;
                trail.rotation.y = Math.random() * Math.PI * 2;
                trail.rotation.z = Math.random() * Math.PI * 2;
                
                trail.userData = {
                    life: 1.0,
                    decay: 0.02
                };
                
                scene.add(trail);
                lightTrails.push(trail);
            } catch (e) {
                console.error("Lỗi khi tạo vệt sáng sao:", e);
            }
        }
    });
    
    // Xoay nhẹ các hạt
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;
    
    // Xoay nhẹ các hình ảnh
    if (photoPlanes.length > 0) {
        photoPlanes.forEach(plane => {
            plane.rotation.y += plane.userData.rotationSpeed;
            plane.position.y += Math.sin(time + plane.userData.floatFactor) * plane.userData.floatSpeed;
        });
    }
    
    // Nhấp nháy cho sparkles
    if (sparkles) {
        sparkles.rotation.x += 0.0004;
        sparkles.rotation.y += 0.0008;
    }
    
    // Sử dụng composer để render với hiệu ứng bloom
    try {
        if (composer) {
            composer.render();
        } else {
            // Fallback nếu composer không khả dụng
            renderer.render(scene, camera);
        }
    } catch (e) {
        console.error("Lỗi khi render:", e);
        renderer.render(scene, camera);
    }
}

// Fallback animation nếu không có hiệu ứng bloom
function animate_fallback() {
    requestAnimationFrame(animate_fallback);
    
    time += 0.01;
    
    // Di chuyển camera theo chuột một cách mềm mại
    targetX = mouseX * 5;
    targetY = mouseY * 5;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Hiệu ứng nhẹ nhàng cho camera
    camera.position.x += Math.sin(time) * 0.05;
    camera.position.y += Math.cos(time) * 0.05;
    
    // Xoay và di chuyển các trái tim
    hearts.forEach(heart => {
        heart.rotation.x += heart.userData.rotationSpeed;
        heart.rotation.y += heart.userData.rotationSpeed * 0.8;
        heart.rotation.z += heart.userData.rotationSpeed * 0.5;
        
        // Thêm hiệu ứng nổi
        heart.position.y += Math.sin(time + heart.userData.floatFactor) * heart.userData.floatSpeed;
    });
    
    // Hiệu ứng nhấp nháy cho các ngôi sao
    stars.forEach(star => {
        star.userData.pulseFactor += star.userData.pulse;
        const scale = star.userData.originalScale + Math.sin(star.userData.pulseFactor) * 0.2;
        star.scale.set(scale, scale, scale);
    });
    
    // Xoay nhẹ các hạt
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;
    
    // Xoay nhẹ các hình ảnh
    if (photoPlanes.length > 0) {
        photoPlanes.forEach(plane => {
            plane.rotation.y += plane.userData.rotationSpeed;
            plane.position.y += Math.sin(time + plane.userData.floatFactor) * plane.userData.floatSpeed;
        });
    }
    
    // Nhấp nháy cho sparkles
    if (sparkles) {
        sparkles.rotation.x += 0.0004;
        sparkles.rotation.y += 0.0008;
    }
    
    // Render scene
    renderer.render(scene, camera);
}

// Xử lý thay đổi kích thước màn hình
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (composer) {
        composer.setSize(window.innerWidth, window.innerHeight);
    }
}); 