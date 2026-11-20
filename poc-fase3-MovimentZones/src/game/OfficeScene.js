import Phaser from 'phaser';

export class OfficeScene extends Phaser.Scene{
    constructor() {
        super('OfficeScene');
    }

    preload() {
        this.load.image('bathroom', '/assets/tilesets/clean_publicbathroom_set.png');
        this.load.image('computer', '/assets/tilesets/computer_front.png');
        this.load.image('floors', '/assets/tilesets/floors.png');
        this.load.image('meeting_preview', '/assets/tilesets/meeting_room_preview.png');
        this.load.image('meeting_props', '/assets/tilesets/meeting_room_props.png');
        this.load.image('meeting_tiles', '/assets/tilesets/meeting_room_tileset.png');
        this.load.image('chair_back', '/assets/tilesets/office_chair_back.png');
        this.load.image('chair_front', '/assets/tilesets/office_chair_front.png');
        this.load.image('walls', '/assets/tilesets/walls.png');

        this.load.tilemapTiledJSON('mapa_oficina', '/assets/maps/mapa.json');

        this.load.spritesheet('george', '/assets/sprites/george.png', {
            frameWidth: 48,
            frameHeight: 48
        });
    }

    create(){
        const map = this.make.tilemap({ key: 'mapa_oficina' });
        this.zones = [];

        const bathroom = map.addTilesetImage('clean_publicbathroom_set', 'bathroom');
        const computer = map.addTilesetImage('computer_front', 'computer');
        const floors = map.addTilesetImage('floors', 'floors');
        const meetingPreview = map.addTilesetImage('meeting_room_preview', 'meeting_preview');
        const meetingProps = map.addTilesetImage('meeting_room_props', 'meeting_props');
        const meetingTiles = map.addTilesetImage('meeting_room_tileset', 'meeting_tiles');
        const chairBack = map.addTilesetImage('office_chair_back', 'chair_back');
        const chairFront = map.addTilesetImage('office_chair_front', 'chair_front');
        const walls = map.addTilesetImage('walls', 'walls');

        if (!bathroom || !computer || !floors || !meetingPreview ||
        !meetingProps || !meetingTiles || !chairBack || !chairFront || !walls) {
            console.error('Error: no se han encontrado todos los tilesets');
            return;
        }

        const tilesets=[
            bathroom,
            computer,
            floors,
            meetingPreview,
            meetingProps,
            meetingTiles,
            chairBack,
            chairFront,
            walls
        ];

        const capaTerra = map.createLayer('Terra', tilesets, 0, 0);
        const capaMobiliari0 = map.createLayer('Mobiliari0', tilesets, 0, 0);
        this.capaParets = map.createLayer('Parets', tilesets, 0, 0);
        const capaMobiliari = map.createLayer('Mobiliari', tilesets, 0, 0);
        const capaMobiliari1 = map.createLayer('Mobiliari1', tilesets, 0, 0);

        this.capaParets?.setCollisionByProperty({ Collides: true });
        

        // Llegim la capa d'objectes
        const capaObjectes = map.getObjectLayer('Objectes');
        const elementsDetectats = [];

        capaObjectes?.objects.forEach((obj)=>{
            const props = this.obtenirPropietats(obj);

            // Calculem el centre de l'objecte
            const cx = obj.x + (obj.width || 0) / 2;
            const cy = obj.y + (obj.height || 0) / 2;

            // Si l'objecte és el spawn, creem l'avatar
            if (props.spawn === 'spawn') {
                this.jugador = this.physics.add.sprite(cx, cy, 'george', 0);

                this.jugador.body.setSize(16, 12);
                this.jugador.body.setOffset(16, 32);

                this.jugador.setCollideWorldBounds(true);

                //this.physics.world.createDebugGraphic();

                if (this.capaParets) {
                    this.physics.add.collider(this.jugador, this.capaParets);
                }
            }

            if (props.tipus === 'zona') {
                const rect = new Phaser.Geom.Rectangle(
                    obj.x,
                    obj.y,
                    obj.width,
                    obj.height
                );

                this.zones.push({
                    nom: props.nomSala || 'Sala',
                    rect
                });

                this.add.rectangle(
                    cx,
                    cy,
                    obj.width,
                    obj.height,
                    0x10b981,
                    0.18
                ).setStrokeStyle(1.5, 0x10b981);

                this.add.text(
                    cx,
                    obj.y + 12,
                    props.nomSala || 'Sala',
                    {
                        fontSize: '11px',
                        color: '#a7f3d0'
                    }
                ).setOrigin(0.5);

                elementsDetectats.push({
                    tipus: 'Zona',
                    nom: props.nomSala || 'Sense nom',
                    aforament: props.aforament || 0
                });
            }


            if (props.tipus === 'monitor') {
                this.add.rectangle(cx, cy, 28, 20, 0xf59e0b).setStrokeStyle(2, 0xffffff);
                this.add.text(cx, cy - 18, props.titol || 'Monitor', { fontSize: '12px', color: '#fde68a' }).setOrigin(0.5);
                elementsDetectats.push({ tipus: 'Monitor', nom: props.titol || 'Pantalla' });
            }
        });

        this.zonaActual = null;

        //animacions george
        this.direccio = 'avall';

        this.frameQuiets = {
            avall: 0,
            esquerra: 1,
            amunt: 2,
            dreta: 3
        };

        this.etiqueta = this.add.text(
            this.jugador.x,
            this.jugador.y - 30,
                'George',
                {
                    fontSize: '13px',
                    fontFamily: 'sans-serif',
                    color: '#ffffff',
                    backgroundColor: '#0f172a88'
                }
        ).setOrigin(0.5);

        this.crearAnimacions();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.teclesWASD = this.input.keyboard.addKeys('W,A,S,D');

        this.game.events.emit('mapa-carregat', elementsDetectats);
    }
// Mètode auxiliar per crear les animacions
    crearAnimacions() {
        const dirs = [
            { clau: 'caminar-avall', frames: [0, 4, 8, 12] },
            { clau: 'caminar-esquerra', frames: [1, 5, 9, 13] },
            { clau: 'caminar-amunt', frames: [2, 6, 10, 14] },
            { clau: 'caminar-dreta', frames: [3, 7, 11, 15] }
        ];

        dirs.forEach((d) => {
            this.anims.create({
                key: d.clau,
                frames: this.anims.generateFrameNumbers('george', {
                    frames: d.frames
                }),
                frameRate: 8,
                repeat: -1
            });
        });
    }

// [NOU] Afegeix update() DINS de class OfficeScene (després de crearAnimacions)
   update() {
     if (!this.jugador) return;
     let vx = 0, vy = 0;
     if (this.cursors.left.isDown || this.teclesWASD.A.isDown)  vx = -1;
     if (this.cursors.right.isDown || this.teclesWASD.D.isDown) vx =  1;
     if (this.cursors.up.isDown || this.teclesWASD.W.isDown)    vy = -1;
     if (this.cursors.down.isDown || this.teclesWASD.S.isDown)  vy =  1;
 
     // Normalitzem perquè caminar en diagonal no sigui un 41% més ràpid
     const vel = new Phaser.Math.Vector2(vx, vy).normalize().scale(160);
     this.jugador.setVelocity(vel.x, vel.y);
 
     // Triem l'animació segons cap on camina; si s'atura, deixem l'última mirada
    if (vx !== 0 || vy !== 0) {
       if (Math.abs(vx) > Math.abs(vy)) this.direccio = vx < 0 ? 'esquerra' : 'dreta';
       else this.direccio = vy < 0 ? 'amunt' : 'avall';
       this.jugador.anims.play(`caminar-${this.direccio}`, true); // true = no reiniciïs si ja sona
    } else {
       this.jugador.anims.stop();
       this.jugador.setFrame(this.frameQuiets[this.direccio]);
    }
    this.etiqueta.setPosition(this.jugador.x, this.jugador.y - 30);
    this.etiqueta.setPosition(this.jugador.x, this.jugador.y - 30);

    this.comprovarZones();
   }

    comprovarZones() {
        const peuY = this.jugador.y + 14;

        const trobada = this.zones.find((z) =>
            Phaser.Geom.Rectangle.Contains(
                z.rect,
                this.jugador.x,
                peuY
            )
        ) || null;

        if (trobada?.nom !== this.zonaActual?.nom) {
            this.zonaActual = trobada;

            this.game.events.emit(
                'canvi-zona',
                trobada ? { nom: trobada.nom } : null
            );
        }
    }

// Mètode auxiliar per llegir les propietats de Tiled
    obtenirPropietats(obj){
        const resultat = {};
        (obj.properties || []).forEach((p) =>{
            resultat[p.name] = p.value;
        });

        return resultat;
    }

}

