export default class StashAppLoader {
    data;
    verifyVideoSRC;

    constructor(stashappURL, verifyVideoSRC = false) {
        if (typeof stashappURL === "string") {
            this.verifyVideoSRC = verifyVideoSRC;
            fetch(
                stashappURL +
                    (stashappURL.substring(stashappURL.length - 1) == "/"
                        ? ""
                        : "/") +
                    "graphql",
                {
                    method: "POST",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: "{ allScenes {id title file_mod_time files {width height} paths { screenshot stream } studio { id name } tags { id name } } }",
                    }),
                }
            )
                .then((response) => response.json())
                .then((jsonRaw) => this.processStashAppData(jsonRaw))
                .then((json) => {
                    window.registerExtension({
                        type: "stashapp",
                        name: "Stash App",
                        verifyVideoSRC: false,
                        data: json,
                    });
                    return true;
                })
                .catch((error) => {
                    console.error("Error:", error);
                    return error;
                });
        } else {
            err = "Error: `json_file` must be valid string";
            console.error(err);
            return err;
        }
    }

    processStashAppData(json) {
        let preparedJson = { videos: [] };
        let folders = [];
        json.data.allScenes.forEach((scene) => {
            let screen_type = "screen";
            scene.tags.forEach((tag) => {
                switch (tag.name) {
                    case "SBS":
                        screen_type = "sbs";
                        break;
                    case "TB":
                        screen_type = "tb";
                        break;
                    case "SCREEN":
                        screen_type = "screen";
                        break;
                }
            });
            let epoch = Date.parse(scene.file_mod_time);
            if (scene.studio === null) {
                scene.studio = { name: "MAIN" };
            }
            if (!preparedJson.videos[folders[scene.studio.name] - 1]) {
                folders.push(scene.studio.name);
                folders[scene.studio.name] = preparedJson.videos.push(
                    new FolderEntry(scene.studio.name)
                );
            }
            preparedJson.videos[folders[scene.studio.name] - 1].list.push(
                new VideoEntry(
                    scene.title != "" ? scene.title : scene.id,
                    scene.paths.stream,
                    scene.paths.screenshot,
                    screen_type,
                    scene.files[0].height,
                    scene.files[0].width,
                    scene.file_mod_time,
                    epoch
                )
            );
        });
        return preparedJson;
    }
}

class FolderEntry {
    name;
    list;

    constructor(name) {
        this.name = name;
        this.list = [];
    }
}
class VideoEntry {
    name;
    src;
    thumbnail;
    screen_type;
    frame_height;
    frame_width;
    date;
    epoch;

    constructor(
        name,
        src,
        thumbnail,
        screen_type,
        frame_height,
        frame_width,
        date,
        epoch
    ) {
        this.name = name;
        this.src = src;
        this.thumbnail = thumbnail;
        this.screen_type = screen_type;
        this.frame_height = frame_height;
        this.frame_width = frame_width;
        this.date = date;
        this.epoch = epoch;
    }
}
