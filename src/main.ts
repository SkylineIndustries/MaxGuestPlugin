import winston from "winston";
import { getPluginOn, CheckpluginOn, setSub3, setPluginOn } from "./MaxGuest"
import { getMaxGuests,setMaxGuests, showWindowMain } from "./mainWindow"
var saveData = context.getParkStorage();
export const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'logfile.log' })
	]
});

export function main() {
	logger.log('info', 'PLUGIN STARTED')
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


