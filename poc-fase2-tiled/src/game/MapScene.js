export class MapScene extends PhaserScene(){
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
    }
}

