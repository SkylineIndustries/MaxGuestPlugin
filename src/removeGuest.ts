
 export function removeGuest(maxGuestAmount: number, type: string) {
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