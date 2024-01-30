import { getMaxGuests} from "./mainWindow"

let subscribed = false;
let sub: IDisposable;
let sub2: IDisposable;
let sub3: IDisposable;
let pluginOn: boolean = false;

const remove = (args: GuestGenerationArgs): void => {
	var entity = map.getEntity(args.id);
	entity.remove();
};

function removeSub(subToRemove: IDisposable) {
	subToRemove.dispose()
}

export function CheckpluginOn() {
	if (pluginOn) {
		if (network.mode !== "client") {
			sub2 = context.subscribe("interval.day", () => {
				maxGuestLimit(getMaxGuests());
			});
		};
	}
	else {
		subscribed = false;
		removeSub(sub2)
		removeSub(sub)
	}

	if (false) {
		removeSub(sub3)
	}
}

var countGuestOnMap = function (): number {
	return map.getAllEntities("guest").length
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

export function getSub3(){
	return sub3;
}

export function setSub3(sub3Import: IDisposable){
	sub3 = sub3Import;
}

export function setPluginOn(pluginOnImport: boolean){
    pluginOn = pluginOnImport;
}

export function getPluginOn(){
    return pluginOn;
}