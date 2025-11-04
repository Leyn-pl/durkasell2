// System
var barNormalise = undefined;
var regenID = undefined;
var hackID = undefined;
const cost = [10, 30, 100, 250]
const icost = [20, 50, 120, 120]
const dev_mode = false;
// Stats
var progress = 50;
var maxStamina = 50;
var stamina = 50;
var regenTime = 1000 / 1.5;
var money = 0;
var shizium = [0, 0, 0, 0]
var items = [0, 0, 0, 0]
var mult = 1;
// Upgrades
var ups = {
	"wifi": 1,
	"wifi_cost": 10,
	"cooling": 0,
	"cooling_cost": 50,
	"luck": 0,
	"luck_cost": 100,
	"adv_cooling": 0,
	"water_cooling": 0,
	"wired_wifi": 0
};
// Crafts
var canHack = false;

$(document).ready(() => {
	// Debug
	if (dev_mode) {
		$(".dev").css("display", "inline")
		$(".oneshot").on("click", () => {
			progress += 100;
			mine();
			update();
		});
		$(".removestamina").on("click", () => {
			stamina -= 50;
			flash($(".stamina"), "orchid");
			update();
		});
		$(".givestamina").on("click", () => {
			stamina += 50;
			flash($(".stamina"), "orchid");
			update();
		});
		for(let i=0; i<4; i++) {
			$(".give"+i).on("click", () => {
				shizium[i] += 10;
				flash($(".value."+i), "orchid");
				update();
			});
		};
		for(let i=0; i<4; i++) {
			$(".givei"+i).on("click", () => {
				items[i] += 10;
				flash($(".value.i"+i), "orchid");
				update();
			});
		};
		$(".removemoney").on("click", () => {
			money = 0;
			flash($(".money"), "orchid");
			update();
		});
		$(".givemoney").on("click", () => {
			money += 10000;
			flash($(".money"), "orchid");
			update();
		});
	};
	
	// Mining
	$(".mine").on("click", () => {
		if (stamina > 0) mine()
	});
	$(".hack").on("click", () => {
		mult = Math.floor(Math.random()*20) / 10 + 1;
		canHack = false;
		flash($(".mult"), "lime");
		if (hackID) clearTimeout(hackID);
		hackID = setTimeout(() => {
			mult = 1;
			flash($(".mult"), "red");
			update("hack");
		}, 5000);
		update("hack");
	});
	
	// Selling
	for(let i=0; i<4; i++) {
		$("button."+i).on("click", () => {
			sell(i);
		});
		$("button.i"+i).on("click", () => {
			sell(i+4);
		});
	};
	
	// Shop
	$("button.wifi").on("click", () => {
		if (money >= ups.wifi_cost) {
			money -= ups.wifi_cost;
			ups.wifi_cost *= 2;
			ups.wifi++;
			flash($(".money"), "red");
			flash($(".value.wifi"), "lime");
			update("wifi");
		} else {
			flash($("button.wifi"), "red");
		};
	});
	$("button.cooling").on("click", () => {
		if (money >= ups.cooling_cost) {
			money -= ups.cooling_cost;
			ups.cooling_cost += 50;
			ups.cooling++;
			regenTime = 1000 / (0.5 * ups.cooling + 1.5);
			flash($(".money"), "red");
			flash($(".value.cooling"), "lime");
			update("cooling");
		} else {
			flash($("button.cooling"), "red");
		};
	});
	$("button.luck").on("click", () => {
		if (money >= ups.luck_cost) {
			money -= ups.luck_cost;
			ups.luck_cost += 100;
			ups.luck++;
			flash($(".money"), "red");
			flash($(".value.luck"), "lime");
			update("luck");
		} else {
			flash($("button.luck"), "red");
		};
	});
	$("button.adv_cooling").on("click", () => {
		if (money >= 100 && shizium[1] >= 5 && shizium[2] >= 1) {
			money -= 100;
			shizium[1] -= 5;
			shizium[2] -= 1;
			ups.adv_cooling++;
			maxStamina += 25;
			flash($(".money"), "red");
			flash($(".value.1"), "red");
			flash($(".value.2"), "red");
			flash($("button.adv_cooling"), "lime");
			flash($(".stamina"), "lime");
			update("adv_cooling");
		} else {
			flash($("button.adv_cooling"), "red");
		};
	});
	$("button.water_cooling").on("click", () => {
		if (money >= 500 && shizium[2] >= 10 && shizium[3] >= 3) {
			money -= 500;
			shizium[2] -= 10;
			shizium[3] -= 3;
			ups.water_cooling++;
			maxStamina += 25;
			flash($(".money"), "red");
			flash($(".value.2"), "red");
			flash($(".value.3"), "red");
			flash($("button.water_cooling"), "lime");
			flash($(".stamina"), "lime");
			update("water_cooling");
		} else {
			flash($("button.water_cooling"), "red");
		};
	});
	$("button.wired_wifi").on("click", () => {
		if (money >= 500 && shizium[1] >= 25 && shizium[3] >= 1) {
			money -= 500;
			shizium[1] -= 25;
			shizium[3] -= 1;
			ups.wired_wifi++;
			flash($(".money"), "red");
			flash($(".value.1"), "red");
			flash($(".value.3"), "red");
			flash($("button.wired_wifi"), "lime");
			update("wired_wifi");
		} else {
			flash($("button.wired_wifi"), "red");
		};
	});
	
	// Crafts
	$("button.craft3").on("click", () => {
		if (shizium[1] >= 2 && shizium[2] >= 2) {
			shizium[1] -= 2;
			shizium[2] -= 2;
			if (Math.random() < 0.8) {
				shizium[3] += 1;
				flash($(".value.3"), "lime");
				flash($(".value.craft3"), "lime");
			} else {
				flash($(".value.craft3"), "red");
			};
			flash($(".value.1"), "red");
			flash($(".value.2"), "red");
			update();
		} else {
			flash($("button.craft3"), "red");
		};
	});
	$("button.crafthack").on("click", () => {
		if (items[0] >= 2) {
			items[0] -= 2;
			if (Math.random() < 0.7) {
				canHack = true;
				flash($(".hack"), "lime");
				flash($(".value.crafthack"), "lime");
			} else {
				flash($(".value.crafthack"), "red");
			};
			flash($(".value.i0"), "red");
			update("hack");
		} else {
			flash($("button.crafthack"), "red");
		};
	});
	$("button.craftmoney").on("click", () => {
		if (items[0] >= 3 && items[1] >= 2) {
			items[0] -= 3;
			items[1] -= 2;
			if (Math.random() < 0.20) {
				money += 1000;
				flash($(".money"), "lime");
				flash($(".value.craftmoney"), "lime");
			} else {
				flash($(".value.craftmoney"), "red");
			};
			flash($(".value.i0"), "red");
			flash($(".value.i2"), "red");
			update();
		} else {
			flash($("button.craftmoney"), "red");
		};
	});
});

function update(segment = undefined) {
	// Bar and stamina
	$(".progress").css("transition-duration", 0.5 - ups.wifi * 0.02 +"s");
	$(".progress").css("width", Math.floor(progress)+"%");
	$(".stamina").text(stamina + " / " + maxStamina);
	$(".mult").text("x"+mult);
	// Shizium and items
	for(let i=0; i<4; i++) {
		$(".value."+i).text(shizium[i]);
		$("button."+i).prop("disabled", shizium[i]==0);
		$(".value.i"+i).text(items[i]);
		$("button.i"+i).prop("disabled", items[i]==0);
	};
	// Money
	$(".money").text(money);
	// Upgrades
	if (["wifi", "cooling", "luck"].includes(segment)) {
		$(".value."+segment).text(ups[segment]);
		if (ups[segment] < 10) {
			$("button."+segment).text("$" + ups[segment + "_cost"]);
		} else {
			$("button."+segment).text("макс.");
			$("button."+segment).prop("disabled", true);
		};
	} else if (["adv_cooling", "water_cooling", "wired_wifi"].includes(segment)) {
		$("button."+segment).text("куплено");
		$("button."+segment).prop("disabled", true);
	} else if (segment == "hack") {
		$("button.hack").prop("disabled", !canHack);
		$("button.crafthack").prop("disabled", canHack);
		if (canHack) {
			$("button.crafthack").text("имеется");
		} else {
			$("button.crafthack").text("2Х");
		};
	};
	// Start regen
	if (stamina < maxStamina) {
		if (regenID) clearTimeout(regenID);
		regen();
	};
}

function mine() {
	// Recolor bar
	$(".progress").css("background-color", "#7c7cf9");
	if (barNormalise) clearTimeout(barNormalise);
	barNormalise = setTimeout(() => {
		$(".progress").css("background-color", "#9c9ce9");
	}, 500);
		
	// Add progress
	progress += (ups.wifi + 2 * ups.wired_wifi) * mult;
	if (progress >= 100) {
		let [rarity, item] = reward();
		shizium[rarity]++;
		progress %= 100;
		flash($(".value."+rarity), "lime");
		if (item != undefined) {
			items[item]++;
			flash($(".value.i"+item), "lime");
		};
	};
	
	// Schedule stamina regen
	stamina -= 1;
	update();
}

function regen() {
	regenID = setTimeout(() => {
		stamina += 1;
		if (stamina < maxStamina) regen();
		$(".stamina").text(stamina + " / " + maxStamina);
	}, regenTime);
}

function reward() {
	$("#inventory").css("opacity", "1");
	// Calculate chances
	let luck = ups.luck
	let c_legendary = luck * 0.01;
	let c_rare = (luck * 0.05) ** 2 + 0.025;
	let c_uncommon = luck * 0.05 + 0.2 - c_rare;
	let drop = [];
	// Shizium drop
	let rand = Math.random();
	if (rand <= c_legendary) {
		drop.push(3);
	} else if (rand <= c_rare) {
		drop.push(2);
	} else if (rand <= c_uncommon) {
		drop.push(1);
	} else {
		drop.push(0);
	};
	// Item drops
	let ipool = []
	if (luck >= 1) { ipool.push(0) } else return drop;
	if (luck >= 3) ipool.push(1);
	if (luck >= 5) {
		ipool.push(2);
		ipool.push(3);
	};
	if (Math.random() < 0.1 + luck * 0.01) drop.push(ipool[Math.floor(Math.random()*ipool.length)]);
	return drop;
}

function sell(rarity) {
	$("#shop").css("opacity", "1");
	if (rarity < 4) {
		money += shizium[rarity] * cost[rarity];
		shizium[rarity] = 0;
		flash($(".value."+rarity), "red");
	} else {
		rarity -= 4;
		money += items[rarity] * icost[rarity];
		items[rarity] = 0;
		flash($(".value.i"+rarity), "red");
	}
	flash($(".money"), "lime");
	update();
}

function flash(elem, color) {
	elem.css("color", color);
	setTimeout(() => {
		elem.css("color", "white");
	}, 200);
}