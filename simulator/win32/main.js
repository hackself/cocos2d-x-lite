(function () {

    function boot () {

        if ( !_CCSettings.debug ) {
            // retrieve minified raw assets
            var rawAssets = _CCSettings.rawAssets;
            var assetTypes = _CCSettings.assetTypes;
            for (var mount in rawAssets) {
                var entries = rawAssets[mount];
                for (var uuid in entries) {
                    var entry = entries[uuid];
                    var type = entry[1];
                    if (typeof type === 'number') {
                        entry[1] = assetTypes[type];
                    }
                }
            }
        }

        // init engine
        var canvas, div;

        var AssetOptions = {
            libraryPath: 'D:/thirteencard/ThirteenCard_js/library/imports/',
            rawAssetsBase: 'D:/thirteencard/ThirteenCard_js/',
            rawAssets: _CCSettings.rawAssets
        };

        var onStart = function () {
            cc.view.resizeWithBrowserSize(true);

            // init assets
            cc.AssetLibrary.init(AssetOptions);

            // load stashed scene, unlike the standard loading process, here we do some hack to reduce the engine size.
            cc.loader.load('preview-scene.json', function (error, json) {
                cc.AssetLibrary.loadJson(json,
                    function (err, sceneAsset) {
                        var scene = sceneAsset.scene;
                        // scene._id = ??;   stashed scene dont have uuid...
                        cc.director.runSceneImmediate(scene, function () {
                            // play game
                            cc.game.resume();
                        });
                    }
                );
            });

            // purge
            //noinspection JSUndeclaredVariable
            _CCSettings = undefined;
        };

        var option;

        var txt = jsb.fileUtils.getStringFromFile("project.json");
        if (!txt) txt = jsb.fileUtils.getStringFromFile("project-runtime.json");
        if (!txt) {
            console.log('Can\'t find project.json');
            option = {};
        }
        else {
            option = JSON.parse(txt);
        }

        option.scenes = _CCSettings.scenes;
        option.groupList = _CCSettings.groupList;
        option.collisionMatrix = _CCSettings.collisionMatrix;

        var jsList = _CCSettings.jsList || [];
        jsList = jsList.map(function (x) { return AssetOptions.rawAssetsBase + x; });
        option.jsList = jsList.concat(option.jsList);

        cc.game.run(option, onStart);
    }

    require('src/settings.js');
    require('src/jsb_polyfill.js');

    boot();

})();
