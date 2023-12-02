### StashApp must be configured with SSL

### Usage:

Include script in html file

```
<script defer src="web_vr_video_player_extensions/stashapp/dist/stashappLoader.js"></script>
```

Add loader with your StashApp URL

```
<script defer type="module">
    try {
        new StashAppLoader("https://10.10.10.10:9999/");
    } catch (error) {
        console.warn(error);
    }
</script>
```
