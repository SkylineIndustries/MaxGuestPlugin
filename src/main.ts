import { getPluginOn, CheckpluginOn, setSub3, setPluginOn } from "./MaxGuest"
import { getMaxGuests,setMaxGuests, showWindowMain } from "./mainWindow"
var saveData = context.getParkStorage();

export function main() {
	// Write code here that should happen on startup of the plugin.
	// Register a menu item under the map icon:
	if (typeof ui !== "undefined") {
		ui.registerMenuItem("Max guest plugin", () => showWindowMain());
	}
	setSub3( context.subscribe("map.save", () => {
		saveData.set("1", getMaxGuests())
		saveData.set("2", getPluginOn())
	}));

	if (saveData.has("1") && saveData.has("2")) {
		var pluginOn1: any = saveData.get("2");
		setPluginOn(pluginOn1)
		var maxGuest1: any = saveData.get("1");
		setMaxGuests(maxGuest1)
	}
	if (getPluginOn()) {
		CheckpluginOn();
	}
}


