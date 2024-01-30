import { setPluginOn, getPluginOn, CheckpluginOn } from "./MaxGuest"
import { removeGuest } from "./removeGuest"

let MaxGuest: number = 0;
let MaxRemove: number = 0;
let multiGeust: number = 1;
let multiRemove: number = 1;
let selectedIdGuest: number = 0;
let selectedIdRemove: number = 0;
let colorMain = 0o6;
let colorSecond = 0o7;

const windowTag = "MaxGuestPlugin";
let windowMain: Window = ui.getWindow(windowTag);
let windowMaxGuest: Window = ui.getWindow(windowTag);
let windowRemoveGuest: Window = ui.getWindow(windowTag);
let emptyWindow: Window;
let intCount: number[] = [0,0];

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
				isChecked: getPluginOn(),
				onChange: () => {
					if (!getPluginOn()) {
						setPluginOn(true);
					}
					else {
						setPluginOn(false);
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
				onDecrement: () => updateMax("GUEST", false),
				onIncrement: () => updateMax("GUEST", true),
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
					updateMultiplier(index, "GUEST");

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
				onClick: () => { removeGuest(MaxGuest, "MAX") },
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
				onDecrement: () => updateMax("REMOVE", false),
				onIncrement: () => updateMax("REMOVE", true),
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
					updateMultiplier(index,"REMOVE");
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
				text: "these are V2.0.0 (CODENAME: LONGHORN) functions and its future is not guaranteed!"
			},
			{
				type: 'button',
				x: 5,
				y: 125,
				width: 24,
				height: 24,
				onClick: () => { removeGuest(MaxRemove, "VALUE") },
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
export function showWindowMain(): void {
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

function updateMultiplier(selectedId: number, multiplier: String) {

	if (selectedId === 0) {
		multiplier === "GUEST" ? (multiGeust = 1) : (multiRemove = 1);
	} else if (selectedId === 1) {
		multiplier === "GUEST" ? (multiGeust = 10) : (multiRemove = 10);
	} else if (selectedId === 2) {
		multiplier === "GUEST" ? (multiGeust = 100) : (multiRemove = 100);
	} else if (selectedId === 3) {
		multiplier === "GUEST" ? (multiGeust = 1000) : (multiRemove = 1000);
	}
}

function updateMax(type: string, increase: boolean) {
	let input: string;
	let window: Window;
	let index: number;

	if (type === "GUEST") {
		input = "MaxGuestInput";
		window = windowMaxGuest;
		index = 0;
	} else {
		input = "MaxRemoveInput";
		window = windowRemoveGuest;
		index = 1;
	}

	if (increase) {
		type === "GUEST" ? (intCount[index] += 1 * multiGeust) : (intCount[index] += 1 * multiRemove)
	} else {
		type === "GUEST" ? (intCount[index] -= 1 * multiGeust) : (intCount[index] -= 1 * multiRemove)
	}

	if (intCount[index] > 10000) {
		intCount[index] = 10000
	}
	else if (intCount[index] < 0) {
		intCount[index] = 0
	}
	window.findWidget<SpinnerWidget>(input).text = String(intCount[index]);
}


function getMaxGuest() {
	return MaxGuest;
}

function getMaxRemove() {
	return MaxRemove;
}

export function getMaxGuests() {
    return MaxGuest
}

export function setMaxGuests(maxGuests: number) {
MaxGuest = maxGuests
}
