var KOLOBOK_GAME_CONFIG = {
	audio: {
		menuMusicVolume: 0.7,
		gameplayMusicVolume: 0.25
	},
	gameplay: {
		maxSpeedShoot: 1000,
		shootFactor: 8,
		enemyKolobokKillDiff: 6,
		enemyBlockKillDiff: 7,
		enemyGroundKillDiff: 7
	},
	koloboks: {
		heroKolobokDefault: {
			destroys: [],
			pushDiff: 7,
			pushXFactor: 0.14,
			pushYFactor: 0.06,
			pushAngular: 0.7,
			minRetainedSpeedX: 130,
			pierceCount: 0,
			bodyMass: 1,
			bodyDamping: 0.12,
			bodyAngularDamping: 0.08,
			flyAudioKey: "sfxFly1"
		},
		heroKolobokWreath: {
			destroys: ["blockLight"],
			blockKillDiff: 8,
			pierceCount: 0,
			bodyMass: 1.1,
			bodyDamping: 0.12,
			bodyAngularDamping: 0.08,
			flyAudioKey: "sfxFly2"
		},
		heroKolobokBogatyr: {
			destroys: ["blockLight", "blockHeavy"],
			blockKillDiff: 8,
			pierceCount: 7,
			pierceLightVelocityFactor: 0.50,
			pierceHeavyVelocityFactor: 0.50,
			pierceLightAngularFactor: 0.50,
			pierceHeavyAngularFactor: 0.50,
			bodyMass: 8,
			bodyDamping: 0.08,
			bodyAngularDamping: 0.05,
			flyAudioKey: "sfxFly3"
		}
	},
	ui: {
		splash: {
			textBottomOffset: 58,
			textFontSize: 28,
			blinkAlpha: 0.35,
			blinkDuration: 650,
			loadingTickMs: 350
		},
		final: {
			videoBackground: {
				enabled: true
			},
			bottomOffset: 18,
			bottomGap: 16,
			awardsTextOffsetX: 50,
			awardsTextOffsetY: 21,
			awardsTextColor: "#ffff38",
			awardsTextFontSize: 16
		},
		menu: {
			titleTop: 25,
			playTop: 175,
			soundButton: {
				x: 5,
				y: 5,
				width: 60,
				height: 60
			}
		},
		levelSelector: {
			videoBackground: {
				enabled: true
			},
			buttons: [
				{ level: "1", x: 50, y: 50 },
				{ level: "2", x: 200, y: 50 },
				{ level: "3", x: 350, y: 50 },
				{ level: "4", x: 500, y: 50 },
				{ level: "5", x: 650, y: 50 },
				{ level: "6", x: 50, y: 150 },
				{ level: "7", x: 200, y: 150 },
				{ level: "8", x: 350, y: 150 },
				{ level: "9", x: 500, y: 150 },
				{ level: "10", x: 650, y: 150 },
				{ level: "11", x: 50, y: 250 },
				{ level: "12", x: 200, y: 250 }
			],
			backButton: {
				x: 10,
				y: 370,
				hitX: 0,
				hitY: 360,
				hitWidth: 90,
				hitHeight: 90
			}
		},
		game: {
			tutorial: {
				firstLevelText: "Схвати колобка и попади в зверя",
				textBottomOffset: 48,
				textFontSize: 24
			},
			floor: {
				centerYOffset: 24,
				height: 48
			},
			grassBack: {
				x: -3,
				bottomOffset: 65,
				heightOffset: 418
			},
			grassFront: {
				x: -3,
				bottomOffset: 60,
				heightOffset: 420
			},
			slingshot: {
				base: { x: 180, y: 300, anchorX: 0.5, anchorY: 0 },
				back: { x: 180, y: 294, scale: 0.5 },
				front: { x: 166, y: 291, scale: 0.5 },
				launcher: { x: 145, y: 265, width: 75, height: 75 }
			},
			hud: {
				menu: { x: 5, y: 5, width: 60, height: 60 },
				restart: { x: 70, y: 5, width: 60, height: 60 },
				sound: { x: 135, y: 5, width: 60, height: 60 }
			},
			overlays: {
				panel: { width: 480, height: 361 },
				dimAlpha: 0.50,
				fadeDuration: 220,
				win: {
					textOffsetY: 168,
					starsOffsetY: 78,
					continueOffsetY: 220
				},
				lose: {
					textOffsetY: 148,
					restartOffsetY: 200
				}
			}
		}
	}
};
