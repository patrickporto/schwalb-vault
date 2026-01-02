export interface DiceTheme {
	name: string;
	description?: string;
	author?: string;
	showColorPicker?: boolean;
	surface: string;
	category: string;
	dice: {
		foreground: string | string[];
		background: string | string[];
		outline?: string | string[];
		edge?: string | string[];
		texture: string | string[];
		material: string;
	};
	cubeMap?: string[];
}

const DEFAULT_CUBEMAP = ['envmap.jpg', 'envmap.jpg', 'envmap.jpg', 'envmap.jpg', 'envmap.jpg', 'envmap.jpg'];
const TABLE_CUBEMAP = ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'];

export const THEMES: Record<string, DiceTheme> = {
// Original Themes (Apps/Presets)
	'default': {
		name: 'Solid Color',
		author: 'MajorVictory',
		showColorPicker: true,
		surface: 'wood_tray',
		category: 'Basic',
		dice: {
			foreground: '#9794ff',
			background: '#0b1a3e',
			texture: 'none',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'blue-felt': {
		name: 'Blue Felt',
		author: 'MajorVictory',
		showColorPicker: true,
		surface: 'felt',
		category: 'Basic',
		dice: {
			foreground: '#9794ff',
			background: '#0b1a3e',
			texture: 'none',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'red-felt': {
		name: 'Red Felt',
		author: 'MajorVictory',
		showColorPicker: true,
		surface: 'felt',
		category: 'Basic',
		dice: {
			foreground: '#ff9494',
			background: '#4d1e1e',
			texture: 'none',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'green-felt': {
		name: 'Green Felt',
		author: 'MajorVictory',
		showColorPicker: true,
		surface: 'felt',
		category: 'Basic',
		dice: {
			foreground: '#97ff94',
			background: '#244d1e',
			texture: 'none',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'taverntable': {
		name: 'Old Tavern Table',
		author: 'MajorVictory',
		showColorPicker: true,
		surface: 'wood_table',
		category: 'Basic',
		dice: {
			foreground: '#9794ff',
			background: '#0b1a3e',
			texture: 'none',
			material: 'plastic'
		},
		cubeMap: TABLE_CUBEMAP
	},
	'mahogany': {
		name: '(Mah-Hog-Any)',
		author: 'MajorVictory',
		showColorPicker: true,
		surface: 'wood_table',
		category: 'Basic',
		dice: {
			foreground: '#9794ff',
			background: '#0b1a3e',
			texture: 'none',
			material: 'plastic'
		},
		cubeMap: TABLE_CUBEMAP
	},
	'stainless': {
		name: 'Stainless Steel',
		author: 'MajorVictory',
		showColorPicker: true,
		surface: 'metal',
		category: 'Basic',
		dice: {
			foreground: '#9794ff',
			background: '#0b1a3e',
			texture: 'metal',
			material: 'metal'
		},
		cubeMap: TABLE_CUBEMAP
	},
	'cyberpunk': {
		name: 'Neo-New-Future-City',
		author: 'MajorVictory',
		showColorPicker: true,
		surface: 'metal',
		category: 'Basic',
		dice: {
			foreground: '#3494A6',
			background: '#440B28',
			texture: 'none',
			material: 'metal'
		},
		cubeMap: TABLE_CUBEMAP
	},
	'cagetown': {
		name: 'Cage Town',
		author: 'MajorVictory',
		showColorPicker: true,
		surface: 'wood_table',
		category: 'Basic',
		dice: {
			foreground: '#D7A866',
			background: '#282811',
			texture: 'none',
			material: 'wood'
		},
		cubeMap: TABLE_CUBEMAP
	},

	// Migrated from COLORSETS
	'coin_default': {
		name: 'Gold Coin',
		description: 'Gold Dragonhead Coin',
		category: 'Other',
		surface: 'wood_tray',
		dice: {
			foreground: '#f6c928',
			background: '#f6c928',
			outline: 'none',
			texture: 'metal',
			material: 'metal'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'coin_silver': {
		name: 'Silver Coin',
		description: 'Gold Dragonhead Coin',
		category: 'Other',
		surface: 'wood_tray',
		dice: {
			foreground: '#f6c928',
			background: '#f6c928',
			outline: 'none',
			texture: 'metal',
			material: 'metal'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'radiant': {
		name: 'Radiant',
		category: 'Damage Types',
		description: 'Radiant',
		surface: 'wood_tray',
		dice: {
			foreground: '#F9B333',
			background: '#FFFFFF',
			outline: '',
			texture: 'paper',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'fire': {
		name: 'Fire',
		category: 'Damage Types',
		description: 'Fire',
		surface: 'wood_tray',
		dice: {
			foreground: '#f8d84f',
			background: ['#f8d84f', '#f9b02d', '#f43c04', '#910200', '#4c1009'],
			outline: 'black',
			texture: 'fire',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'ice': {
		name: 'Ice',
		category: 'Damage Types',
		description: 'Ice',
		surface: 'wood_tray',
		dice: {
			foreground: '#60E9FF',
			background: ['#214fa3', '#3c6ac1', '#253f70', '#0b56e2', '#09317a'],
			outline: 'black',
			texture: 'ice',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'poison': {
		name: 'Poison',
		category: 'Damage Types',
		description: 'Poison',
		surface: 'wood_tray',
		dice: {
			foreground: '#D6A8FF',
			background: ['#313866', '#504099', '#66409e', '#934fc3', '#c949fc'],
			outline: 'black',
			texture: 'cloudy',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'acid': {
		name: 'Acid',
		category: 'Damage Types',
		description: 'Acid',
		surface: 'wood_tray',
		dice: {
			foreground: '#A9FF70',
			background: ['#a6ff00', '#83b625', '#5ace04', '#69f006', '#b0f006', '#93bc25'],
			outline: 'black',
			texture: 'marble',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'thunder': {
		name: 'Thunder',
		category: 'Damage Types',
		description: 'Thunder',
		surface: 'wood_tray',
		dice: {
			foreground: '#FFC500',
			background: '#7D7D7D',
			outline: 'black',
			texture: 'cloudy',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'lightning': {
		name: 'Lightning',
		category: 'Damage Types',
		description: 'Lightning',
		surface: 'wood_tray',
		dice: {
			foreground: '#FFC500',
			background: ['#f17105', '#f3ca40', '#eddea4', '#df9a57', '#dea54b'],
			outline: '#7D7D7D',
			texture: 'ice',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'air': {
		name: 'Air',
		category: 'Damage Types',
		description: 'Air',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: ['#d0e5ea', '#c3dee5', '#a4ccd6', '#8dafb7', '#80a4ad'],
			outline: 'black',
			texture: 'cloudy',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'water': {
		name: 'Water',
		category: 'Damage Types',
		description: 'Water',
		surface: 'wood_tray',
		dice: {
			foreground: '#60E9FF',
			background: ['#87b8c4', '#77a6b2', '#6b98a3', '#5b8691', '#4b757f'],
			outline: 'black',
			texture: 'water',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'earth': {
		name: 'Earth',
		category: 'Damage Types',
		description: 'Earth',
		surface: 'wood_tray',
		dice: {
			foreground: '#6C9943',
			background: ['#346804', '#184200', '#527f22', '#3a1d04', '#56341a', '#331c17', '#5a352a', '#302210'],
			outline: 'black',
			texture: 'speckles',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'force': {
		name: 'Force',
		category: 'Damage Types',
		description: 'Force',
		surface: 'wood_tray',
		dice: {
			foreground: 'white',
			background: ['#FF97FF', '#FF68FF', '#C651C6'],
			outline: '#570000',
			texture: 'stars',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'psychic': {
		name: 'Psychic',
		category: 'Damage Types',
		description: 'Psychic',
		surface: 'wood_tray',
		dice: {
			foreground: '#D6A8FF',
			background: ['#313866', '#504099', '#66409E', '#934FC3', '#C949FC', '#313866'],
			outline: 'black',
			texture: 'speckles',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'necrotic': {
		name: 'Necrotic',
		category: 'Damage Types',
		description: 'Necrotic',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: '#6F0000',
			outline: 'black',
			texture: 'skulls',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'breebaby': {
		name: 'Pastel Sunset',
		category: 'Custom Sets',
		description: 'Pastel Sunset, for Breyanna',
		surface: 'wood_tray',
		dice: {
			foreground: ['#5E175E', '#564A5E', '#45455E', '#3D5A5E', '#1E595E', '#5E3F3D', '#5E1E29', '#283C5E', '#25295E'],
			background: ['#FE89CF', '#DFD4F2', '#C2C2E8', '#CCE7FA', '#A1D9FC', '#F3C3C2', '#EB8993', '#8EA1D2', '#7477AD'],
			outline: 'white',
			texture: 'marble',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'pinkdreams': {
		name: 'Pink Dreams',
		category: 'Custom Sets',
		description: 'Pink Dreams, for Ethan',
		surface: 'wood_tray',
		dice: {
			foreground: 'white',
			background: ['#ff007c', '#df73ff', '#f400a1', '#df00ff', '#ff33cc'],
			outline: '#570000',
			texture: 'skulls',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'inspired': {
		name: 'Inspired',
		category: 'Custom Sets',
		description: 'Inspired, for Austin',
		surface: 'wood_tray',
		dice: {
			foreground: '#FFD800',
			background: '#C4C4B6',
			outline: '#8E8E86',
			texture: 'none',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'bloodmoon': {
		name: 'Blood Moon',
		category: 'Custom Sets',
		description: 'Blood Moon, for Jared',
		surface: 'wood_tray',
		dice: {
			foreground: '#CDB800',
			background: '#6F0000',
			outline: 'black',
			texture: 'marble',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'starynight': {
		name: 'Stary Night',
		category: 'Custom Sets',
		description: 'Stary Night, for Mai',
		surface: 'wood_tray',
		dice: {
			foreground: '#4F708F',
			background: ['#091636', '#233660', '#4F708F', '#8597AD', '#E2E2E2'],
			outline: 'white',
			texture: 'speckles',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'glitterparty': {
		name: 'Glitter Party',
		category: 'Custom Sets',
		description: 'Glitter Party, for Austin',
		surface: 'wood_tray',
		dice: {
			foreground: 'white',
			background: ['#FFB5F5', '#7FC9FF', '#A17FFF'],
			outline: 'none',
			texture: 'glitter',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'astralsea': {
		name: 'Astral Sea',
		category: 'Custom Sets',
		description: 'The Astral Sea, for Austin',
		surface: 'wood_tray',
		dice: {
			foreground: '#565656',
			background: 'white',
			outline: 'none',
			texture: 'astral',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'bronze': {
		name: 'Thylean Bronze',
		description: 'Thylean Bronze by @SpencerThayer',
		category: 'Custom Sets',
		surface: 'wood_tray',
		dice: {
			foreground: ['#FF9159', '#FFB066', '#FFBF59', '#FFD059'],
			background: ['#705206', '#7A4E06', '#643100', '#7A2D06'],
			outline: ['#3D2D03', '#472D04', '#301700', '#471A04'],
			edge: ['#FF5D0D', '#FF7B00', '#FFA20D', '#FFBA0D'],
			texture: ['bronze01', 'bronze02', 'bronze03', 'bronze03a', 'bronze03b', 'bronze04'],
			material: 'metal'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'dragons': {
		name: 'Here be Dragons',
		category: 'Custom Sets',
		description: 'Here be Dragons',
		surface: 'wood_tray',
		dice: {
			foreground: '#FFFFFF',
			background: ['#B80000', '#4D5A5A', '#5BB8FF', '#7E934E', '#FFFFFF', '#F6ED7C', '#7797A3', '#A78437', '#862C1A', '#FFDF8A'],
			outline: 'black',
			texture: ['dragon', 'lizard'],
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'birdup': {
		name: 'Bird Up',
		category: 'Custom Sets',
		description: 'Bird Up!',
		surface: 'wood_tray',
		dice: {
			foreground: '#FFFFFF',
			background: ['#F11602', '#FFC000', '#6EC832', '#0094BC', '#05608D', '#FEABB3', '#F75680', '#F3F0DF', '#C7A57F'],
			outline: 'black',
			texture: 'bird',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'tigerking': {
		name: 'Tiger King',
		category: 'Other',
		description: 'Leopard Print',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: '#FFCC40',
			outline: 'black',
			texture: ['leopard', 'tiger', 'cheetah'],
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'covid': {
		name: 'COViD',
		category: 'Other',
		description: 'Covid-19',
		surface: 'wood_tray',
		dice: {
			foreground: '#A9FF70',
			background: ['#a6ff00', '#83b625', '#5ace04', '#69f006', '#b0f006', '#93bc25'],
			outline: 'black',
			texture: 'fire',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'acleaf': {
		name: 'Animal Crossing',
		category: 'Other',
		description: 'Animal Crossing Leaf',
		surface: 'wood_tray',
		dice: {
			foreground: '#00FF00',
			background: '#07540A',
			outline: 'black',
			texture: 'acleaf',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'isabelle': {
		name: 'Isabelle',
		category: 'Other',
		description: 'Isabelle',
		surface: 'wood_tray',
		dice: {
			foreground: 'white',
			background: '#FEE5CC',
			outline: 'black',
			texture: 'isabelle',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'thecage': {
		name: 'Nicholas Cage',
		category: 'Other',
		description: 'Nicholas Cage',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: '#ffffff',
			outline: 'black',
			texture: 'thecage',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'test': {
		name: 'Test',
		category: 'Colors',
		description: 'Test',
		surface: 'wood_tray',
		dice: {
			foreground: ['#00FF00', '#0000FF', '#FF0000'],
			background: ['#FF0000', '#00FF00', '#0000FF'],
			outline: 'black',
			texture: 'none',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'rainbow': {
		name: 'Rainblow',
		category: 'Colors',
		description: 'Rainblow',
		surface: 'wood_tray',
		dice: {
			foreground: ['#FF5959', '#FFA74F', '#FFFF56', '#59FF59', '#2374FF', '#00FFFF', '#FF59FF'],
			background: ['#900000', '#CE3900', '#BCBC00', '#00B500', '#00008E', '#008282', '#A500A5'],
			outline: 'black',
			texture: 'none',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'black': {
		name: 'Black',
		category: 'Colors',
		description: 'Black',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: '#000000',
			outline: 'black',
			texture: 'none',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'white': {
		name: 'White',
		category: 'Colors',
		description: 'White',
		surface: 'wood_tray',
		dice: {
			foreground: '#000000',
			background: '#FFFFFF',
			outline: '#FFFFFF',
			texture: 'none',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swrpg_abi': {
		name: 'Star Wars RPG - Ability',
		category: 'Star Wars™ RPG',
		description: 'Star Wars™ RPG Ability Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#00FF00',
			background: ['#3D9238', '#52B848', '#5EAC56', '#9ECB9A'],
			outline: '#000000',
			texture: 'cloudy_2',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swrpg_pro': {
		name: 'Star Wars RPG - Proficiency',
		category: 'Star Wars™ RPG',
		description: 'Star Wars™ RPG Proficiency Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#FFFF00',
			background: ['#CABB1C', '#F9E33B', '#FFE900', '#F0E49D'],
			outline: '#000000',
			texture: 'paper',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swrpg_dif': {
		name: 'Star Wars RPG - Difficulty',
		category: 'Star Wars™ RPG',
		description: 'Star Wars™ RPG Difficulty Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#8000FC',
			background: ['#39165F', '#664B84', '#50247E', '#745F88'],
			outline: '#000000',
			texture: 'cloudy_2',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swrpg_cha': {
		name: 'Star Wars RPG - Challenge',
		category: 'Star Wars™ RPG',
		description: 'Star Wars™ RPG Challenge Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#FF0000',
			background: ['#A91F32', '#EB4254', '#E51836', '#BA3645'],
			outline: '#000000',
			texture: 'paper',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swrpg_boo': {
		name: 'Star Wars RPG - Boost',
		category: 'Star Wars™ RPG',
		description: 'Star Wars™ RPG Boost Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#00FFFF',
			background: ['#4B9DC6', '#689FC4', '#85CFF2', '#8FC0D8'],
			outline: '#000000',
			texture: 'glitter',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swrpg_set': {
		name: 'Star Wars RPG - Setback',
		category: 'Star Wars™ RPG',
		description: 'Star Wars™ RPG Setback Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#111111',
			background: ['#252223', '#241F21', '#282828', '#111111'],
			outline: '#ffffff',
			texture: 'glitter',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swrpg_for': {
		name: 'Star Wars RPG - Force',
		category: 'Star Wars™ RPG',
		description: 'Star Wars™ RPG Force Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#000000',
			background: ['#F3F3F3', '#D3D3D3', '#BABABA', '#FFFFFF'],
			outline: '#FFFFFF',
			texture: 'stars',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swa_red': {
		name: 'Armada Attack - Red',
		category: 'Star Wars™ Armada',
		description: 'Star Wars™ Armada Red Attack Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: ['#440D19', '#8A1425', '#C72336', '#C04551'],
			outline: 'none',
			texture: 'stainedglass',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swa_blue': {
		name: 'Armada Attack - Blue',
		category: 'Star Wars™ Armada',
		description: 'Star Wars™ Armada Blue Attack Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: ['#212642', '#28286E', '#2B348C', '#3D4BB5', '#5D64AB'],
			outline: 'none',
			texture: 'stainedglass',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swa_black': {
		name: 'Armada Attack - Black',
		category: 'Star Wars™ Armada',
		description: 'Star Wars™ Armada Black Attack Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: ['#252223', '#241F21', '#282828', '#111111'],
			outline: 'none',
			texture: 'stainedglass',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'xwing_red': {
		name: 'X-Wing Attack - Red',
		category: 'Star Wars™ X-Wing',
		description: 'Star Wars™ X-Wing Red Attack Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: ['#440D19', '#8A1425', '#C72336', '#C04551'],
			outline: 'none',
			texture: 'stars',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'xwing_green': {
		name: 'X-Wing Attack - Green',
		category: 'Star Wars™ X-Wing',
		description: 'Star Wars™ X-Wing Green Attack Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: ['#3D9238', '#52B848', '#5EAC56', '#9ECB9A'],
			outline: 'none',
			texture: 'stars',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swl_atkred': {
		name: 'Legion Attack - Red',
		category: 'Star Wars™ Legion',
		description: 'Star Wars™ Legion Red Attack Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: ['#440D19', '#8A1425', '#C72336', '#C04551'],
			outline: 'none',
			texture: 'fire',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swl_atkblack': {
		name: 'Legion Attack - Black',
		category: 'Star Wars™ Legion',
		description: 'Star Wars™ Legion Black Attack Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: ['#252223', '#241F21', '#282828', '#111111'],
			outline: 'none',
			texture: 'fire',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swl_atkwhite': {
		name: 'Legion Attack - White',
		category: 'Star Wars™ Legion',
		description: 'Star Wars™ Legion White Attack Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#000000',
			background: ['#ffffff', '#DFF4FA', '#BCBCBC', '#F1EDE2', '#F2ECE0'],
			outline: 'none',
			texture: 'fire',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swl_defred': {
		name: 'Legion Defense - Red',
		category: 'Star Wars™ Legion',
		description: 'Star Wars™ Legion Red Defense Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#ffffff',
			background: ['#440D19', '#8A1425', '#C72336', '#C04551'],
			outline: 'none',
			texture: 'fire',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	},
	'swl_defwhite': {
		name: 'Legion Defense - White',
		category: 'Star Wars™ Legion',
		description: 'Star Wars™ Legion White Defense Dice',
		surface: 'wood_tray',
		dice: {
			foreground: '#000000',
			background: ['#ffffff', '#DFF4FA', '#BCBCBC', '#F1EDE2', '#F2ECE0'],
			outline: 'none',
			texture: 'fire',
			material: 'plastic'
		},
		cubeMap: DEFAULT_CUBEMAP
	}
};
