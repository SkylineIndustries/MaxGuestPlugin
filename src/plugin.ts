/// <reference path="../lib/openrct2.d.ts" />

import { main } from "./main";

registerPlugin({
	name: "MaxGuestPlugin",
	version: "2.2.0",
	authors: [ "NityeSky_Rodin" ],
	type: "remote",
	licence: "MIT",
	/**
	 * This field determines which OpenRCT2 API version to use. It's best to always use the
	 * latest release version, unless you want to use specific versions from a newer develop
	 * version. Version 70 equals the v0.4.4 release.
	 * @see https://github.com/OpenRCT2/OpenRCT2/blob/v0.4.4/src/openrct2/scripting/ScriptEngine.h#L50
	 */
	targetApiVersion: 70,
	main: main,
});