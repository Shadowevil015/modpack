var fs = require("fs");
var path = require("path");

var modsFolder = "mods";

var listing = "";

fs.readdir(modsFolder, function(err, files) {
	if (err) {
		console.error("Could not list the directory.", err);
		process.exit(1);
	}

	files.forEach(function(file, index) {
		var fromPath = path.join(modsFolder, file);

		if (file.endsWith(".jar")) {
			listing += "- " + file + "\n";
			return;
		}

		let fileData = fs.readFileSync(fromPath);
		listing += "- ";
		listing += /name = "([^"]+)"/.exec(fileData)[1];
		let matchProjId = /project-id = (\d+)/.exec(fileData);
		if (matchProjId != null) {
			listing += " (<https://minecraft.curseforge.com/projects/";
			listing += matchProjId[1];
			listing += ">)";
		} else {
			let matchModId = /mod-id = "([^"]+)"/.exec(fileData);
			if (matchModId != null) {
				listing += " (<https://modrinth.com/mod/";
				listing += matchModId[1];
				listing += ">)";
			}
		}
		if (/side = "server"/.test(fileData)) {
			listing += " *(Server only)*";
		} else if (/optional = true/.test(fileData)) {
			listing += " *(Optional)*";
		}
		listing += "\n";
	});

	fs.writeFileSync("README.md", listing);
});
