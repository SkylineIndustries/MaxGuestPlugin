let subscribed = false;
let sub: IDisposable;
let sub2: IDisposable;
let pluginOn = false;
let MaxGuest: number = 0;
let multi: number = 1;
let selectedId: number = 0
const remove = (args: GuestGenerationArgs): void => {
	var entity = map.getEntity(args.id);
	entity.remove();
};

const windowTag = "MaxGuestPlugin"
let window: Window = ui.getWindow(windowTag);
let window2 = window
function showWindow(): void {
	if (window) {
		window.bringToFront();
		return;
	}
	const windowDesc: WindowDesc = {
		classification: windowTag,
		width: 550,
		height: 150,
		title: 'MaxGuestPlugin_V1.5.0',
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
						CheckpluginOn();
					}
					else {
						pluginOn = false;
						CheckpluginOn();
					}
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
				onDecrement: () => updateMaxGuest("De","MaxGuestInput"),
				onIncrement: () => updateMaxGuest("In","MaxGuestInput"),
			},
			{
				name: "Multi",
				type: "dropdown",
				width: 50,
				height: 20,
				x: 5,
				y: 80,
				items: ["1", "10", "100", "1000"],
				selectedIndex: selectedId,
				onChange: (index: number) => {
					selectedId = index;
					updateMulti();
				},
			},
			{
				type: 'label',
				x: 55,
				y: 80,
				width: 500,
				height: 20,
				text: "Multiplier",
			},
			{
				type: 'button',
				x: 5,
				y: 120,
				width: 500,
				height: 20,
				onClick: () => { removeGuest(MaxGuest) },
				text: "Remove Guest to limit",
			},
		],
	};
	window2 = ui.openWindow(windowDesc);
}

function updateMulti() {
	if (selectedId === 0) {
		multi = 1;
	} else if (selectedId === 1) {
		multi = 10;
	} else if (selectedId === 2) {
		multi = 100;
	} else if (selectedId === 3) {
		multi = 1000;
	}
}



function updateMaxGuest(type: String, widgetName: string) {
	if (type === "In") {
		MaxGuest += 1 * multi;
		if (MaxGuest < 10000) {
			var MaxGuestInput = window2.findWidget(widgetName) as SpinnerWidget;
			MaxGuestInput.text = String(getMaxGuest());
		}
		else if (MaxGuest > 10000) {
			MaxGuest = 10000
			var MaxGuestInput = window2.findWidget(widgetName) as SpinnerWidget;
			MaxGuestInput.text = "10000"
		}
	}
	else if (type === "De") {
		MaxGuest -= 1 * multi;
		if (MaxGuest > 0) {
			var MaxGuestInput = window2.findWidget(widgetName) as SpinnerWidget;
			MaxGuestInput.text = String(getMaxGuest());
		}
		else if (MaxGuest < 0) {
			MaxGuest = 0
			var MaxGuestInput = window2.findWidget(widgetName) as SpinnerWidget;
			MaxGuestInput.text = "0"
		}
	}


}

function getMaxGuest() {
	return MaxGuest
}
export function main() {
	// Write code here that should happen on startup of the plugin.
	// Register a menu item under the map icon:
	if (typeof ui !== "undefined") {
		ui.registerMenuItem("Max guest plugin", () => showWindow());
	}

}
function CheckpluginOn() {
	console.log(subscribed);
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

function removeGuest(maxGuestAmount: number) {
	var count: Entity[] = map.getAllEntities("guest");
	var total: number = calculateRemoveGuest(maxGuestAmount);
	for (var i: number = 0; i < total; i++) {
		if (count[i])
		count[i].remove();
	}
} 

function calculateRemoveGuest(maxGuestAmount: number) {
	var count = map.getAllEntities("guest").length;
	var total = count - maxGuestAmount;
	if (total < 0) {
		return 0;
	}
	else {
		return total;
	}
}