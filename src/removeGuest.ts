import {logger} from "./main"
 export function removeGuest(maxGuestAmount: number, type: string) {
	var guests: Entity[] = map.getAllEntities("guest");
	if (type === "MAX") {
		var total: number = calculateRemoveGuest(maxGuestAmount);
		for (var i: number = 0; i < total; i++) {
			try {
				guests[i].remove();
			}
			catch {
				logger.log('error', 'Cannot remove guest')
			}
		}
	}
	else {
		for (var i: number = 0; i < maxGuestAmount; i++) {
			try {
				guests[i].remove();
			}
			catch {
				maxGuestAmount++;
				logger.log('error', 'Cannot remove guest')
			}
		}
	}
}

function calculateRemoveGuest(maxGuestAmount: number) {
	var count = map.getAllEntities("guest").length;
	var total = count - maxGuestAmount;
	if (total <= 0) {
		count = 0;
		return 0;
	}
	else {
		count = 0;
		return total;
	}
}