;(function(plugins) {
    'use strict';

    function isDescendant(parent, child) {
         var node = child.parentNode;
         while (node !== null) {
             if (node == parent) {
                 return true;
             }
             node = node.parentNode;
         }
         return false;
    }

    var toggleCKEditorReadonly = function(form, isReadOnly) {
        var toggleEditor = function(editor) {
            if (!isDescendant(form, editor.element.$)) {
                return;
            }

            if (editor.status == 'ready' || editor.status == 'basic_ready') {
                editor.setReadOnly(isReadOnly);
            } else {
                editor.on('contentDom', function(e) {
                    e.editor.setReadOnly(isReadOnly);
                });
            }
        };
        if (window.CKEDITOR !== undefined) {
            switch (CKEDITOR.status) {
                case 'basic_ready':
                case 'ready':
                case 'loaded':
                case 'basic_loaded':
                    for (var instanceId in CKEDITOR.instances) {
                        toggleEditor(CKEDITOR.instances[instanceId]);
                    }
                    break;
                default:
                    CKEDITOR.on("instanceReady", function(e) {
                        toggleEditor(e.editor);
                    });
                    break;
            }
        }
    };

    plugins.register(
        function() { return toggleCKEditorReadonly(false); },
        function() { return toggleCKEditorReadonly(true); }
    );

})(window.locking.LockingFormPlugins);
