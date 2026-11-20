import Phaser from 'phaser';

export class MapScene extends Phaser.Scene{
    constructor() {super('MapScene');}

    preload(){
        this.load.image('bathroom', '/assets/clean_publicbathroom_set.png');
        this.load.image('computer', '/assets/computer_front.png');
        this.load.image('floors', '/assets/floors.png');
        this.load.image('meeting_preview', '/assets/meeting_room_preview.png');
        this.load.image('meeting_props', '/assets/meeting_room_props.png');
        this.load.image('meeting_tiles', '/assets/meeting_room_tileset.png');
        this.load.image('chair_back', '/assets/office_chair_back.png');
        this.load.image('chair_front', '/assets/office_chair_front.png');
        this.load.image('walls', '/assets/walls.png');

        this.load.tilemapTiledJSON('mapa_oficina', '/assets/mapa.json'); 
    }

    create(){
        const map = this.make.tilemap({key:'mapa_oficina'});
         
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
        const capaParets = map.createLayer('Parets', tilesets, 0, 0);
        const capaMobiliari = map.createLayer('Mobiliari', tilesets, 0, 0);
        const capaMobiliari1 = map.createLayer('Mobiliari1', tilesets, 0, 0);

        capaParets?.setCollisionByProperty({ collides: true });

        // Llegim la capa d'objectes
        const capaObjectes = map.getObjectLayer('Objectes');
        const elementsDetectats = [];

        capaObjectes?.objects.forEach((obj)=>{
            const props = this.obtenirPropietats(obj);

            // Calculem el centre de l'objecte
            const cx = obj.x + (obj.width || 0) / 2;
            const cy = obj.y + (obj.height || 0) / 2;

            // Si l'objecte és el spawn, creem l'avatar
            if(props.spawn === 'spawn'){
                this.avatar = this.add.circle(cx, cy, 14, 0x10b981).setStrokeStyle(2, 0xffffff);
            }

            if(props.tipus === 'zona'){
                this.add.rectangle(cx, cy, obj.width, obj.height, 0x10b981, 0.22).setStrokeStyle(2, 0x10b981);

                this.add.text(cx, cy, props.nomSala || 'Zona', { fontSize: '13px', color: '#a7f3d0' }).setOrigin(0.5);

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

        this.game.events.emit('mapa-carregat', elementsDetectats);
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

