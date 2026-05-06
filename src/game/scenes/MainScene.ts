import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  private car!: Phaser.Physics.Arcade.Sprite;
  private parkingZone!: Phaser.GameObjects.Rectangle;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private controls = {
    left: false,
    right: false,
    gas: false,
    brake: false,
    reverse: false
  };

  private velocity = 0;
  private maxVelocity = 200;
  private acceleration = 6;
  private friction = 0.97;
  private isLevelActive = false;

  constructor() {
    super('MainScene');
  }

  preload() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Car texture - more detailed
    graphics.fillStyle(0x3b82f6); // Body
    graphics.fillRect(0, 0, 44, 24);
    graphics.fillStyle(0x1e293b); // Roof
    graphics.fillRect(10, 4, 20, 16);
    graphics.fillStyle(0xfacc15); // Headlights
    graphics.fillRect(40, 2, 4, 6);
    graphics.fillRect(40, 16, 4, 6);
    graphics.generateTexture('car', 44, 24);
    graphics.clear();

    // Wall texture
    graphics.fillStyle(0x334155);
    graphics.fillRect(0, 0, 32, 32);
    graphics.lineStyle(2, 0x475569);
    graphics.strokeRect(0, 0, 32, 32);
    graphics.generateTexture('wall', 32, 32);
  }

  create() {
    this.setupListeners();
    this.obstacles = this.physics.add.staticGroup();
    
    // Create car
    this.car = this.physics.add.sprite(-200, -200, 'car');
    this.car.setCollideWorldBounds(true);
    this.car.setDamping(true);
    
    // Create parking zone
    this.parkingZone = this.add.rectangle(0, 0, 80, 50, 0x22c55e, 0.2);
    this.parkingZone.setStrokeStyle(3, 0x22c55e);
    this.physics.add.existing(this.parkingZone, true);

    // Initial state
    this.car.setActive(false).setVisible(false);
    this.parkingZone.setActive(false).setVisible(false);

    // Handle Resize
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.cameras.main.setSize(gameSize.width, gameSize.height);
    });
  }

  setupListeners() {
    window.addEventListener('car-control', (e: any) => {
      const { action, value } = e.detail;
      if (action === 'left') this.controls.left = value;
      if (action === 'right') this.controls.right = value;
      if (action === 'gas') this.controls.gas = value;
      if (action === 'brake') this.controls.brake = value;
      if (action === 'gear') this.controls.reverse = value;
    });
  }

  startLevel(level: number) {
    this.isLevelActive = true;
    this.velocity = 0;
    
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // Reset car
    this.car.setActive(true).setVisible(true);
    this.car.setPosition(100, h / 2);
    this.car.setAngle(0);
    if (this.car.body) {
      this.car.body.enable = true;
      this.car.setVelocity(0, 0);
    }

    // Reset Obstacles
    this.obstacles.clear(true, true);
    
    // Parking Position
    const px = w - 150;
    const py = h / 2 + (Math.sin(level) * 100);
    this.parkingZone.setPosition(px, py);
    this.parkingZone.setActive(true).setVisible(true);

    // Level Walls
    this.createWall(w / 2, 0, w, 40); // Top
    this.createWall(w / 2, h, w, 40); // Bottom

    // Dynamic obstacles based on level
    const count = Math.min(level + 3, 12);
    for(let i = 0; i < count; i++) {
      const ox = Phaser.Math.Between(300, w - 300);
      const oy = Phaser.Math.Between(100, h - 100);
      // Avoid parking zone area
      if (Phaser.Math.Distance.Between(ox, oy, px, py) > 100) {
        this.createWall(ox, oy, 40, 40);
      }
    }

    // Colliders
    this.physics.add.collider(this.car, this.obstacles, () => this.handleCrash());
  }

  createWall(x: number, y: number, w: number, h: number) {
    const wall = this.obstacles.create(x, y, 'wall');
    wall.setDisplaySize(w, h);
    wall.refreshBody();
    return wall;
  }

  stopLevel() {
    this.isLevelActive = false;
    this.car.setActive(false).setVisible(false);
    this.parkingZone.setVisible(false);
    if (this.car.body) this.car.body.enable = false;
  }

  handleCrash() {
    if (!this.isLevelActive) return;
    this.isLevelActive = false;
    this.velocity = 0;
    this.game.registry.get('onLose')();
  }

  update() {
    if (!this.isLevelActive) return;

    // 1. Handle Input & Velocity
    if (this.controls.gas) {
      const dir = this.controls.reverse ? -1 : 1;
      this.velocity += this.acceleration * dir;
    } else if (this.controls.brake) {
      this.velocity *= 0.85; // Stronger braking
    } else {
      this.velocity *= this.friction;
    }

    // Limit speed
    if (this.velocity > this.maxVelocity) this.velocity = this.maxVelocity;
    if (this.velocity < -this.maxVelocity/1.5) this.velocity = -this.maxVelocity/1.5;

    // Stop car if very slow
    if (Math.abs(this.velocity) < 1) this.velocity = 0;

    // 2. Handle Turning (only if moving)
    if (Math.abs(this.velocity) > 5) {
      const turnMultiplier = this.velocity > 0 ? 1 : -1;
      if (this.controls.left) this.car.angle -= 3 * turnMultiplier;
      if (this.controls.right) this.car.angle += 3 * turnMultiplier;
    }

    // 3. Apply Physics
    const angleRad = Phaser.Math.DegToRad(this.car.angle);
    this.car.setVelocityX(Math.cos(angleRad) * this.velocity);
    this.car.setVelocityY(Math.sin(angleRad) * this.velocity);

    // 4. Win Condition
    const pBounds = this.parkingZone.getBounds();
    const cBounds = this.car.getBounds();
    
    // Check if car center is in parking zone
    if (Phaser.Geom.Rectangle.Contains(pBounds, this.car.x, this.car.y)) {
      // Must be slow and aligned-ish (optional alignment check)
      if (Math.abs(this.velocity) < 10) {
        this.isLevelActive = false;
        this.game.registry.get('onWin')();
      }
    }
  }
}