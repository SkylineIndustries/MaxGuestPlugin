let subscribed = false;
let sub: IDisposable;
let sub2: IDisposable;
let sub3: IDisposable;
let pluginOn: boolean = false;
let MaxGuest: number = 0;
let MaxRemove: number = 0;
let multiGeust: number = 1;
let multiRemove: number = 1;
let selectedIdGuest: number = 0;
let selectedIdRemove: number = 0;
let colorMain = 0o6;
let colorSecond = 0o7;
var saveData = context.getParkStorage();

const remove = (args: GuestGenerationArgs): void => {
	var entity = map.getEntity(args.id);
	entity.remove();
};

const windowTag = "MaxGuestPlugin";
let windowMain: Window = ui.getWindow(windowTag);
let windowMaxGuest: Window = ui.getWindow(windowTag);
let windowRemoveGuest: Window = ui.getWindow(windowTag);
let emptyWindow: Window;

function showWindowMaxGuest(): void {
	if (windowMaxGuest) {
		windowMaxGuest.bringToFront();
		return;
	}
	const windowDesc: WindowDesc = {
		classification: windowTag,
		width: 550,
		height: 110,
		title: 'MaxGuests',
		colours: [colorMain, colorSecond],
		widgets: [
				{
				name: "checkbox_auto_reset",
				type: "checkbox",
				width: 240,
				height: 10,
				x: 5,
				y: 20,
				text: "Enable",
				tooltip: "Will update every ingame day",
				isChecked: pluginOn,
				onChange: () => {
					if (!pluginOn) {
						pluginOn = true;
					}
					else {
						pluginOn = false;
					}
					CheckpluginOn();
				}
			},
			{
				type: 'label',
				x: 5,
				y: 40,
				width: 550,
				height: 20,
				text: "Enter the max amount of guest that can enter the park. (This number can be between 0 and 10.000)",				
			},
			{
				name: "MaxGuestInput",
				type: "spinner",
				width: 100,
				height: 20,
				x: 5,
				y: 50,
				text: String(getMaxGuest()),
				onDecrement: () => updateMaxGuest("De"),
				onIncrement: () => updateMaxGuest("In"),
			},
			{
				name: "Multi",
				type: "dropdown",
				width: 50,
				height: 20,
				x: 5,
				y: 80,
				items: ["1", "10", "100", "1000"],
				selectedIndex: selectedIdGuest,
				onChange: (index: number) => {
					selectedIdGuest = index;
					updateMultiMaxGuest();
				},
			},
			{
				type: 'label',
				x: 55,
				y: 80,
				width: 500,
				height: 20,
				text: "Multiplier",
			}
		],
		onClose() {
			windowMaxGuest = emptyWindow;
		}
	}
	windowMaxGuest = ui.openWindow(windowDesc);
}
function showWindowRemoveGuest() {
	if (windowRemoveGuest) {
		windowRemoveGuest.bringToFront();
		return;
	}
	const windowDesc: WindowDesc = {
		classification: windowTag,
		width: 550,
		height: 200,
		title: 'RemoveGuests',
		colours: [colorMain, colorSecond],
		widgets: [
			{
				type: 'button',
				x: 5,
				y: 20,
				width: 24,
				height: 24,
				onClick: () => { removeGuest(MaxGuest,"MAX") },
				border: true,
				tooltip: "Remove all guest to the max guest limit",
				image: 5165
			},
			{
				type: 'label',
				x: 30,
				y: 20,
				width: 500,
				height: 20,
				text: "Remove based on MaxGuestLimit",
			},
			{
				type: 'label',
				x: 5,
				y: 50,
				width: 550,
				height: 20,
				text: "Enter the  amount of guest to remove. (This number can be between 0 and 10.000)",
			},
			{
				name: "MaxRemoveInput",
				type: "spinner",
				width: 100,
				height: 30,
				x: 5,
				y: 60,
				text: String(getMaxRemove()),
				onDecrement: () => updateMaxRemove("De"),
				onIncrement: () => updateMaxRemove("In"),
			},
			{
				name: "Multi",
				type: "dropdown",
				width: 50,
				height: 20,
				x: 5,
				y: 100,
				items: ["1", "10", "100", "1000"],
				selectedIndex: selectedIdRemove,
				onChange: (index: number) => {
					selectedIdRemove = index;
					updateMultiMaxRemove();
				},
			},
			{
				type: 'label',
				x: 55,
				y: 100,
				width: 500,
				height: 20,
				text: "Multiplier",
			},
			{
				type: 'label',
				x: 5,
				y: 185,
				width: 500,
				height: 90,
				text: "these are beta V2.0.0 (CODENAME: LONGHORN) functions and its future is not guaranteed!"
			},
			{
				type: 'button',
				x: 5,
				y: 125,
				width: 24,
				height: 24,
				onClick: () => { removeGuest(MaxRemove,"VALUE") },
				border: true,
				tooltip: "Remove amount of guest equal to the set value",
				image: 5165
			},
			{
				type: 'label',
				x: 30,
				y: 125,
				width: 500,
				height: 20,
				text: "Remove based on value",
			},
		],
		onClose() {
			windowRemoveGuest = emptyWindow;
		}
	};
	windowRemoveGuest = ui.openWindow(windowDesc);
}
function showWindowMain(): void {
	if (windowMain) {
		windowMain.bringToFront();
		return;
	}
	const windowDesc: WindowDesc = {
		classification: windowTag,
		width: 100,
		height: 50,
		title: 'MaxGuests',
		colours: [colorMain, colorSecond],
		widgets: [
			{
				name: 'remove',
				type: 'button',
				x: 5,
				y: 20,
				width: 24,
				height: 24,
				onClick: () => { showWindowRemoveGuest() },
				border: true,
				tooltip: "Show the menu to remove guests",
				image: 5165,
			},
			{
				name: 'add',
				type: 'button',
				x: 40,
				y: 20,
				width: 26,
				height: 26,
				onClick: () => { showWindowMaxGuest() },
				border: true,
				tooltip: "Show the menu to set the max amount of guests that can enter the park",
				image: "cheats",
			},
		],
		onClose() {
			windowMain = emptyWindow;
		},
	};
	windowMain = ui.openWindow(windowDesc);
}

function updateMultiMaxGuest() {
	if (selectedIdGuest === 0) {
		multiGeust = 1;
	} else if (selectedIdGuest === 1) {
		multiGeust = 10;
	} else if (selectedIdGuest === 2) {
		multiGeust = 100;
	} else if (selectedIdGuest === 3) {
		multiGeust = 1000;
	}
}

function updateMultiMaxRemove() {
	if (selectedIdRemove === 0) {
		multiRemove = 1;
	} else if (selectedIdRemove === 1) {
		multiRemove = 10;
	} else if (selectedIdRemove === 2) {
		multiRemove = 100;
	} else if (selectedIdRemove === 3) {
		multiRemove = 1000;
	}
}

function updateMaxGuest(type: String) {
	if (type === "In") {
		MaxGuest += 1 * multiGeust;
		if (MaxGuest < 10000) {
			windowMaxGuest.findWidget<SpinnerWidget>("MaxGuestInput").text = String(getMaxGuest());
		}
		else if (MaxGuest >= 10000) {
			MaxGuest = 10000
			windowMaxGuest.findWidget<SpinnerWidget>("MaxGuestInput").text = "10000"
		}
	}
	else if (type === "De") {
		MaxGuest -= 1 * multiGeust;
		if (MaxGuest > 0) {
			windowMaxGuest.findWidget<SpinnerWidget>("MaxGuestInput").text = String(getMaxGuest());
		}
		else if (MaxGuest <= 0) {
			MaxGuest = 0
			windowMaxGuest.findWidget<SpinnerWidget>("MaxGuestInput").text = "0"
		}
	}


}

function updateMaxRemove(type: String) {
	if (type === "In") {
		MaxRemove += 1 * multiRemove;
		if (MaxRemove < 10000) {
			windowRemoveGuest.findWidget<SpinnerWidget>('MaxRemoveInput').text = String(getMaxRemove());
		}
		else if (MaxRemove >= 10000) {
			MaxRemove = 10000
			windowRemoveGuest.findWidget<SpinnerWidget>('MaxRemoveInput').text = "10000";
		}
	}
	else if (type === "De") {
		MaxRemove -= 1 * multiRemove;
		if (MaxRemove > 0) {
			windowRemoveGuest.findWidget<SpinnerWidget>('MaxRemoveInput').text = String(getMaxRemove());
		}
		else if (MaxRemove <= 0) {
			MaxRemove = 0
			windowRemoveGuest.findWidget<SpinnerWidget>('MaxRemoveInput').text = "0"
		}
	}
}

function getMaxGuest() {
	return MaxGuest;
}

function getMaxRemove() {
	return MaxRemove;
}
export function main() {
	// Write code here that should happen on startup of the plugin.
	// Register a menu item under the map icon:
	if (typeof ui !== "undefined") {
		ui.registerMenuItem("Max guest plugin", () => showWindowMain());
	}
	sub3 = context.subscribe("map.save", () => {
		saveData.set("1", MaxGuest)
		saveData.set("2", pluginOn)
	});

	var pluginOn1: any = saveData.get("2");
	pluginOn = pluginOn1;
	var maxGuest1: any = saveData.get("1");
	MaxGuest = maxGuest1;

	if (pluginOn) {
		CheckpluginOn();
	}
}
function CheckpluginOn() {
	if (pluginOn) {
		if (network.mode !== "client") {
			sub2 = context.subscribe("interval.day", () => {
				maxGuestLimit(MaxGuest);
			});
		};
	}
	else {
		subscribed = false;
		removeSub(sub2)
		removeSub(sub)
	}
	let one = 1;
	let two = 2;

	if (one == two) {
		removeSub(sub3)
	}
}


var maxGuestLimit = function (maxGuestAmount: number) {
	if (countGuestOnMap() >= maxGuestAmount) {
		if (!subscribed) {
			subscribed = true;
			sub = context.subscribe("guest.generation", remove);
		}
	}
	else {
		if (subscribed) {
			subscribed = false;
		}
		removeSub(sub)
	}
};

var countGuestOnMap = function (): number {
	var count = map.getAllEntities("guest").length
	return count
}

function removeSub(subToRemove: IDisposable) {
	subToRemove.dispose()
}

function removeGuest(maxGuestAmount: number, type: string) {
	var count: Entity[] = map.getAllEntities("guest");
	if (type === "MAX") {
		var total: number = calculateRemoveGuest(maxGuestAmount);
		for (var i: number = 0; i < total; i++) {
			try {
				count[i].remove();
			}
			catch {
				Error
			}
		}
	}
	else {
		for (var i: number = 0; i < maxGuestAmount; i++) {
			try {
				count[i].remove();
			}
			catch {
				Error
			}
		}
	}
} 

function calculateRemoveGuest(maxGuestAmount: number) {
	var count = map.getAllEntities("guest").length;
	var total = count - maxGuestAmount;
	if (total <= 0) {
		return 0;
	}
	else {
		return total;
	}
}